#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function parseMarkdownWithFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split frontmatter and content
  const match = content.match(/^---\n(.*?)\n---\n(.*)/s);
  if (!match) {
    // Handle files without frontmatter (like some marketing agents)
    return parseMarkdownWithoutFrontmatter(filePath, content);
  }
  
  const [, frontmatterText, markdownContent] = match;
  
  try {
    // Try to parse as YAML first
    const frontmatter = yaml.load(frontmatterText, { 
      schema: yaml.CORE_SCHEMA,
      lineWidth: -1  // Don't wrap long lines
    });
    
    return {
      frontmatter,
      content: markdownContent.trim()
    };
  } catch (yamlError) {
    console.log(`YAML parsing failed for ${filePath}, trying manual parsing...`);
    // If YAML parsing fails, try manual parsing for problematic multiline descriptions
    return parseManualFrontmatter(filePath, frontmatterText, markdownContent.trim());
  }
}

function parseMarkdownWithoutFrontmatter(filePath, content) {
  // Extract agent name from filename
  const filename = path.basename(filePath, '.md');
  const name = filename;
  
  // Extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : name;
  
  // For agents without frontmatter, create a basic structure
  return {
    frontmatter: {
      name: name,
      description: `This agent specializes in ${title.toLowerCase()}. Use when you need ${title.toLowerCase()} assistance.`,
      color: 'blue', // default color
      tools: 'Write, Read, MultiEdit, WebSearch, WebFetch' // default tools
    },
    content: content
  };
}

function parseManualFrontmatter(filePath, frontmatterText, markdownContent) {
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  let currentKey = null;
  let currentValue = '';
  
  for (const line of lines) {
    // Only treat as a new key if it's a top-level YAML key (no leading space and ends with colon)
    const keyMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)/);
    
    if (keyMatch && ['name', 'description', 'color', 'tools'].includes(keyMatch[1])) {
      // Save previous key-value pair
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }
      
      // Start new key-value pair
      currentKey = keyMatch[1];
      currentValue = keyMatch[2];
    } else if (currentKey) {
      // Continue multiline value
      currentValue += (currentValue ? '\n' : '') + line;
    }
  }
  
  // Save last key-value pair
  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }
  
  return {
    frontmatter,
    content: markdownContent
  };
}

function parseExamples(description) {
  const examples = [];
  
  // Extract examples from description - handle both literal newlines and \n strings
  const normalizedDesc = description.replace(/\\n/g, '\n');
  const exampleRegex = /<example>\s*Context:\s*(.*?)\s*user:\s*"(.*?)"\s*assistant:\s*"(.*?)"\s*<commentary>\s*(.*?)\s*<\/commentary>\s*<\/example>/gs;
  
  let match;
  while ((match = exampleRegex.exec(normalizedDesc)) !== null) {
    examples.push({
      context: match[1].trim(),
      user: match[2].trim(),
      assistant: match[3].trim(),
      commentary: match[4].trim()
    });
  }
  
  return examples;
}

function cleanDescription(description) {
  // Remove examples section and clean up the description
  const normalizedDesc = description.replace(/\\n/g, '\n');
  const parts = normalizedDesc.split('Examples:');
  let cleanDesc = parts[0].trim();
  
  // Remove trailing periods and normalize
  cleanDesc = cleanDesc.replace(/\.$/, '');
  
  return cleanDesc;
}

function parseTools(toolsString) {
  if (!toolsString) return [];
  return toolsString.split(',').map(tool => tool.trim());
}

function convertAgentToJS(filePath, outputDir) {
  const { frontmatter, content } = parseMarkdownWithFrontmatter(filePath);
  
  // Parse examples from description
  const examples = parseExamples(frontmatter.description);
  
  // Clean description
  const cleanedDescription = cleanDescription(frontmatter.description);
  
  // Parse tools
  const tools = parseTools(frontmatter.tools);
  
  // Create JavaScript object
  const agentObject = {
    name: frontmatter.name,
    description: cleanedDescription,
    color: frontmatter.color,
    tools: tools,
    systemPrompt: content,
    examples: examples
  };
  
  // Generate JavaScript file content
  const jsContent = `// GitHub Copilot Agent: ${frontmatter.name}
// Converted from Claude Code Agent

export const ${frontmatter.name.replace(/-/g, '_')} = ${JSON.stringify(agentObject, null, 2)};

export default ${frontmatter.name.replace(/-/g, '_')};
`;
  
  // Write to output directory
  const outputPath = path.join(outputDir, `${frontmatter.name}.js`);
  fs.writeFileSync(outputPath, jsContent);
  
  console.log(`✓ Converted ${frontmatter.name} -> ${outputPath}`);
  return agentObject;
}

function convertAllAgents() {
  const sourceDir = path.join(__dirname, '..');
  const outputBaseDir = __dirname;
  
  const directories = [
    'engineering',
    'design', 
    'product',
    'marketing',
    'project-management',
    'studio-operations',
    'testing',
    'bonus'
  ];
  
  const allAgents = {};
  
  directories.forEach(dir => {
    const sourceDirPath = path.join(sourceDir, dir);
    const outputDirPath = path.join(outputBaseDir, dir);
    
    if (!fs.existsSync(sourceDirPath)) {
      console.log(`⚠️  Directory ${dir} not found, skipping...`);
      return;
    }
    
    console.log(`\n📁 Processing ${dir}/ directory...`);
    
    const files = fs.readdirSync(sourceDirPath)
      .filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(sourceDirPath, file);
      try {
        const agent = convertAgentToJS(filePath, outputDirPath);
        allAgents[agent.name] = agent;
      } catch (error) {
        console.error(`❌ Error converting ${file}:`, error.message);
      }
    });
  });
  
  // Generate index file with all exports
  const indexContent = `// GitHub Copilot Agents - Index
// Auto-generated from Claude Code Agents

// Import all agents
${Object.keys(allAgents).map(name => {
  const dir = findAgentDirectory(name);
  return `import { ${name.replace(/-/g, '_')} } from './${dir}/${name}.js';`;
}).join('\n')}

// Re-export individual agents
export {
${Object.keys(allAgents).map(name => 
  `  ${name.replace(/-/g, '_')}`
).join(',\n')}
};

// Export all agents as a collection
export const agents = {
${Object.keys(allAgents).map(name => 
  `  '${name}': ${name.replace(/-/g, '_')}`
).join(',\n')}
};
`;
  
  fs.writeFileSync(path.join(outputBaseDir, 'index.js'), indexContent);
  
  console.log(`\n🎉 Conversion complete! ${Object.keys(allAgents).length} agents converted.`);
  console.log(`📄 Generated index.js with all exports.`);
  
  return allAgents;
}

function findAgentDirectory(agentName) {
  const directories = [
    'engineering',
    'design', 
    'product',
    'marketing',
    'project-management',
    'studio-operations',
    'testing',
    'bonus'
  ];
  
  for (const dir of directories) {
    const filePath = path.join(__dirname, '..', dir, `${agentName}.md`);
    if (fs.existsSync(filePath)) {
      return dir;
    }
  }
  return 'unknown';
}

// Run conversion if this script is executed directly
if (require.main === module) {
  try {
    convertAllAgents();
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

module.exports = {
  convertAgentToJS,
  convertAllAgents,
  parseMarkdownWithFrontmatter,
  parseMarkdownWithoutFrontmatter,
  parseManualFrontmatter,
  parseExamples
};