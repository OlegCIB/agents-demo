# GitHub Copilot Agents

A comprehensive collection of specialized GitHub Copilot Agents converted from Claude Code Agents. Each agent is designed to accelerate and enhance every aspect of rapid development during Copilot PR Coding Sessions.

## 🚀 Quick Start

These agents are exported as JavaScript/TypeScript modules that can be imported and used in GitHub Copilot PR Coding Sessions.

### Import Individual Agents

```javascript
// Import specific agents
import { frontend_developer } from './engineering/frontend-developer.js';
import { ui_designer } from './design/ui-designer.js';
import { trend_researcher } from './product/trend-researcher.js';

// Use an agent
const agent = frontend_developer;
console.log(agent.systemPrompt);
```

### Import All Agents

```javascript
// Import all agents at once
import { agents } from './index.js';

// Access any agent by name
const frontendAgent = agents['frontend-developer'];
const designAgent = agents['ui-designer'];
```

### Using with GitHub Copilot

In your Copilot PR Coding Sessions, you can reference these agents to get specialized assistance:

```javascript
// Example: Using the frontend developer agent
const task = "Create a responsive navigation component";
const specialist = agents['frontend-developer'];

// The agent provides:
// - systemPrompt: Detailed expertise and instructions
// - examples: Real-world usage scenarios
// - tools: Available development tools
// - description: When to use this agent
```

## 📁 Available Agents

### Engineering Department (`engineering/`)
- **ai-engineer** - Integrate AI/ML features that actually ship
- **backend-architect** - Design scalable APIs and server systems  
- **devops-automator** - Deploy continuously without breaking things
- **frontend-developer** - Build blazing-fast user interfaces
- **mobile-app-builder** - Create native iOS/Android experiences
- **rapid-prototyper** - Build MVPs in days, not weeks
- **test-writer-fixer** - Write tests that catch real bugs

### Design Department (`design/`)
- **brand-guardian** - Keep visual identity consistent everywhere
- **ui-designer** - Design interfaces developers can actually build
- **ux-researcher** - Turn user insights into product improvements
- **visual-storyteller** - Create visuals that convert and share
- **whimsy-injector** - Add delight to every interaction

### Product Department (`product/`)
- **feedback-synthesizer** - Transform complaints into features
- **sprint-prioritizer** - Ship maximum value in 6 days
- **trend-researcher** - Identify viral opportunities

### Marketing Department (`marketing/`)
- **app-store-optimizer** - Dominate app store search results
- **content-creator** - Generate content across all platforms
- **growth-hacker** - Find and exploit viral growth loops
- **instagram-curator** - Master the visual content game
- **reddit-community-builder** - Win Reddit without being banned
- **tiktok-strategist** - Create shareable marketing moments
- **twitter-engager** - Ride trends to viral engagement

### Project Management (`project-management/`)
- **experiment-tracker** - Data-driven feature validation
- **project-shipper** - Launch products that don't crash
- **studio-producer** - Keep teams shipping, not meeting

### Studio Operations (`studio-operations/`)
- **analytics-reporter** - Turn data into actionable insights
- **finance-tracker** - Keep the studio profitable
- **infrastructure-maintainer** - Scale without breaking the bank
- **legal-compliance-checker** - Stay legal while moving fast
- **support-responder** - Turn angry users into advocates

### Testing & Benchmarking (`testing/`)
- **api-tester** - Ensure APIs work under pressure
- **performance-benchmarker** - Make everything faster
- **test-results-analyzer** - Find patterns in test failures
- **tool-evaluator** - Choose tools that actually help
- **workflow-optimizer** - Eliminate workflow bottlenecks

### Bonus Agents (`bonus/`)
- **studio-coach** - Rally the AI troops to excellence
- **joker** - Lighten the mood with tech humor

## 🛠️ Agent Structure

Each agent is a JavaScript object with the following structure:

```javascript
{
  "name": "agent-name",
  "description": "When to use this agent with examples",
  "color": "blue", // Visual identification color
  "tools": ["Write", "Read", "MultiEdit", "Bash"], // Available tools
  "systemPrompt": "Detailed expertise and instructions...", // Main agent behavior
  "examples": [ // Real-world usage examples
    {
      "context": "Situation description",
      "user": "User request",
      "assistant": "Agent response approach", 
      "commentary": "Why this example matters"
    }
  ]
}
```

## 🔧 Usage in Copilot PR Coding Sessions

### 1. Context-Specific Assistance

```javascript
// Get the right specialist for your task
const getSpecialist = (task) => {
  if (task.includes('frontend') || task.includes('React')) {
    return agents['frontend-developer'];
  } else if (task.includes('API') || task.includes('backend')) {
    return agents['backend-architect'];
  } else if (task.includes('design') || task.includes('UI')) {
    return agents['ui-designer'];
  }
  // ... more conditions
};
```

### 2. Multi-Agent Workflows

```javascript
// Combine agents for complex tasks
const buildFeature = async (featureSpec) => {
  const designer = agents['ui-designer'];
  const frontend = agents['frontend-developer']; 
  const backend = agents['backend-architect'];
  const tester = agents['test-writer-fixer'];
  
  // Use each agent's expertise in sequence
  // 1. Design phase with ui-designer
  // 2. Frontend implementation with frontend-developer
  // 3. Backend API with backend-architect
  // 4. Testing with test-writer-fixer
};
```

### 3. Dynamic Agent Selection

```javascript
// Let Copilot choose the best agent
const selectAgent = (projectType, taskType) => {
  const agentMap = {
    'mobile-app': agents['mobile-app-builder'],
    'web-frontend': agents['frontend-developer'],
    'api-design': agents['backend-architect'],
    'user-research': agents['ux-researcher'],
    'marketing': agents['growth-hacker']
  };
  
  return agentMap[taskType] || agents['rapid-prototyper'];
};
```

## 📊 Agent Examples

Each agent includes real-world examples showing:
- **Context**: The situation where the agent helps
- **User**: What someone might ask for
- **Assistant**: How the agent approaches the task
- **Commentary**: Why this expertise matters

Example usage:

```javascript
const agent = agents['frontend-developer'];
agent.examples.forEach(example => {
  console.log(`Context: ${example.context}`);
  console.log(`User Request: ${example.user}`);
  console.log(`Agent Response: ${example.assistant}`);
  console.log(`Why It Matters: ${example.commentary}`);
});
```

## 🔄 Converting New Agents

To convert additional Claude Code Agents to Copilot format:

```bash
# Add new .md files to the appropriate directory
cp new-agent.md engineering/

# Run the conversion script
node convert.js

# The new agent will be automatically converted and added to index.js
```

The conversion script (`convert.js`) handles:
- YAML frontmatter parsing
- Example extraction from descriptions
- JavaScript module generation
- Index file updates

## 💡 Best Practices

1. **Choose the Right Specialist**: Match your task to the agent's domain expertise
2. **Use Examples for Context**: Review agent examples to understand their strengths
3. **Combine Agents**: Many tasks benefit from multiple agents working together
4. **Follow the 6-Day Sprint Philosophy**: Agents are optimized for rapid development cycles

## 📈 Integration Tips

### With TypeScript

```typescript
interface CopilotAgent {
  name: string;
  description: string;
  color: string;
  tools: string[];
  systemPrompt: string;
  examples: Array<{
    context: string;
    user: string;
    assistant: string;
    commentary: string;
  }>;
}

const typedAgent: CopilotAgent = agents['frontend-developer'];
```

### With React/Vue Projects

```javascript
// Use frontend specialists for component work
import { frontend_developer, ui_designer } from './copilot-agents';

const buildComponent = (componentSpec) => {
  // Leverage UI design expertise
  const designGuidance = ui_designer.systemPrompt;
  
  // Apply frontend implementation expertise  
  const implGuidance = frontend_developer.systemPrompt;
  
  // Combine both for optimal results
};
```

## 🚦 Agent Status

- ✅ **Active**: All 37 agents converted and ready for use
- 🔧 **Tools**: Standard development tools (Write, Read, MultiEdit, Bash, etc.)
- 📖 **Examples**: Real usage scenarios included for each agent
- 🎯 **Specialized**: Domain-specific expertise for faster development

## 📝 Original Source

These agents were converted from [Claude Code Agents](../README.md) while preserving all original functionality and expertise. The original Markdown files remain unchanged and can still be used with Claude Code.

## 🤝 Contributing

To add new agents or improve existing ones:

1. Add/modify the source `.md` file in the appropriate directory
2. Run `node convert.js` to regenerate the Copilot agents
3. Test the converted agent in your Copilot sessions
4. Submit a PR with your improvements

## 🔮 Future Enhancements

- TypeScript definitions for better IDE support
- Agent composition utilities for complex workflows
- Performance optimization suggestions
- Integration with popular development frameworks