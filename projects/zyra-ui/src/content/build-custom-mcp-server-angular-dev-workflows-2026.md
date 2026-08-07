---
title: "Build a Custom MCP Server for Angular Dev Workflows in 2026"
description: "Learn how to build a custom MCP server that gives AI assistants deep Angular workflow context — generate components, run schematics, and query your design system."
category:
    - "Angular 21"
tags:
    - "mcp"
    - "angular"
    - "ai-tooling"
    - "developer-experience"
    - "typescript"
keywords:
    - "build custom MCP server Angular"
    - "Model Context Protocol Angular workflows"
    - "MCP tools for frontend developers"
    - "Angular AI tooling 2026"
    - "TypeScript MCP server tutorial"
date: "2026-08-07T10:00:00.000Z"
slug: "build-custom-mcp-server-angular-dev-workflows-2026"
---

# Build a Custom MCP Server for Angular Dev Workflows in 2026

> **TL;DR:** The Model Context Protocol (MCP) lets you give any AI assistant structured access to your project's tools and context. In this post you'll build a custom MCP server in TypeScript that exposes Angular CLI commands, schematic helpers, and component query tools — so your AI assistant can generate components, inspect your design system, and scaffold features without leaving the conversation.

Every Angular team eventually has the same problem: your AI assistant knows TypeScript but knows nothing about _your_ project. It doesn't know which components exist in your design system, which schematics your team uses, or how your folder structure is laid out. You end up pasting boilerplate context into every chat session, and the moment you close the tab that context evaporates.

**Build a custom MCP server** and you solve this once. The Model Context Protocol gives AI assistants a standardized way to call tools and read resources you define — including tools that shell out to the Angular CLI, query your component index, or read your team's CLAUDE.md conventions file.

---

## The Problem: AI Assistants Have No Angular Project Context

When you ask an AI to "generate a UserProfileCard component following our conventions," it has to guess. It doesn't know:

- Whether you use `OnPush` by default (you should)
- Which ZyraUI components to import
- Where feature components live (`src/app/features/` vs `src/app/components/`)
- Which signals API your team standardized on

The naive fix is to paste your conventions into every prompt. That works until the conventions evolve, the paste is forgotten, or a new team member skips it entirely.

The better fix is a **custom MCP server**: a small Node.js process that runs alongside your editor and exposes a set of _tools_ the AI can call programmatically.

---

## New Concept: Model Context Protocol (MCP)

[MCP](https://modelcontextprotocol.io) is an open protocol originally published by Anthropic that defines how AI assistants communicate with external servers to access tools and context. It has since been adopted across editors, AI assistants, and developer tools.

An MCP server exposes three kinds of primitives:

- **Tools** — functions the AI can call (e.g. `generate_component`, `list_components`)
- **Resources** — static or dynamic content the AI can read (e.g. your `CLAUDE.md`, your component token list)
- **Prompts** — reusable prompt templates injected into a conversation

The AI calls your tool, your server runs the logic (including shelling out to the Angular CLI), and returns structured JSON. The AI uses that result to continue its reasoning without another round-trip through you.

For a deeper introduction to the protocol spec, see the [official MCP documentation](https://modelcontextprotocol.io/introduction).

---

## New Tool: `@modelcontextprotocol/sdk`

The official TypeScript SDK for building MCP servers is [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk). It handles the transport layer (stdio or SSE), input validation via Zod schemas, and tool/resource registration — so you write pure business logic.

```bash
mkdir angular-mcp-server && cd angular-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx
```

Add a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "outDir": "dist"
  }
}
```

---

## Building the Angular MCP Server

Create `src/index.ts`. The server will expose three tools: listing components in your project, generating a new standalone component via the Angular CLI, and reading your team's conventions file.

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Resolve from the Angular workspace root — adjust as needed
const WORKSPACE_ROOT = resolve(process.env['ANGULAR_ROOT'] ?? process.cwd());

const server = new McpServer({
  name: 'angular-dev-tools',
  version: '1.0.0',
});

// Tool 1 — list all standalone components in the project
server.tool(
  'list_components',
  'Returns a list of all Angular standalone components found under src/app.',
  {},
  async () => {
    const srcPath = join(WORKSPACE_ROOT, 'src', 'app');
    const results: string[] = [];

    function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (entry.name.endsWith('.component.ts')) {
          results.push(fullPath.replace(WORKSPACE_ROOT, ''));
        }
      }
    }

    walk(srcPath);
    return {
      content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
    };
  }
);

// Tool 2 — generate a standalone Angular component using the CLI
server.tool(
  'generate_component',
  'Generates a new standalone Angular component using the Angular CLI.',
  {
    name: z.string().describe('Component name, e.g. "UserProfileCard"'),
    path: z.string().optional().describe('Path relative to src/app, e.g. "features/user"'),
  },
  async ({ name, path }) => {
    const routePath = path ? `${path}/${name}` : name;
    const cmd = [
      'npx ng generate component',
      routePath,
      '--standalone',
      '--change-detection=OnPush',
      '--skip-tests=false',
    ].join(' ');

    try {
      const output = execSync(cmd, { cwd: WORKSPACE_ROOT, encoding: 'utf8' });
      return {
        content: [{ type: 'text', text: `Generated successfully:\n${output}` }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: 'text', text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// Tool 3 — read the project's conventions file (CLAUDE.md or README)
server.tool(
  'read_conventions',
  'Returns the contents of CLAUDE.md so the AI has your team conventions in context.',
  {},
  async () => {
    try {
      const content = readFileSync(join(WORKSPACE_ROOT, 'CLAUDE.md'), 'utf8');
      return { content: [{ type: 'text', text: content }] };
    } catch {
      return {
        content: [{ type: 'text', text: 'CLAUDE.md not found in workspace root.' }],
        isError: true,
      };
    }
  }
);

// Start the server over stdio
const transport = new StdioServerTransport();
await server.connect(transport);
```

Run it with `tsx src/index.ts` to verify it starts without errors.

---

## Wiring the Server into Your AI Assistant

### Claude Desktop / Cowork

Add an entry to your `claude_desktop_config.json` (or the Cowork plugin config):

```json
{
  "mcpServers": {
    "angular-dev-tools": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/angular-mcp-server/src/index.ts"],
      "env": {
        "ANGULAR_ROOT": "/absolute/path/to/your/angular-project"
      }
    }
  }
}
```

### VS Code + GitHub Copilot

VS Code's MCP support (available since the 1.100 release) reads from `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "angular-dev-tools": {
      "type": "stdio",
      "command": "npx",
      "args": ["tsx", "${workspaceFolder}/../angular-mcp-server/src/index.ts"],
      "env": {
        "ANGULAR_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

After reloading, Copilot Chat can call `list_components`, `generate_component`, and `read_conventions` automatically when you ask it Angular questions.

For the full list of supported MCP transport options, see [VS Code's MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

---

## Extending the Server: a Design System Resource

Tools handle actions; **resources** handle static content the AI should always have available. Here's how to expose your design system's component token list as a resource:

```typescript
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

server.resource(
  'design-system-tokens',
  new ResourceTemplate('design://tokens/{component}', { list: undefined }),
  async (uri, { component }) => {
    // In a real project: import from your token registry JSON
    const tokens: Record<string, string[]> = {
      button: ['--zyra-color-btn-primary-bg', '--zyra-color-btn-primary-text'],
      card: ['--zyra-color-card-shadow', '--zyra-color-surface'],
    };
    const name = String(component);
    const list = tokens[name] ?? [];
    return {
      contents: [{
        uri: uri.href,
        text: list.length ? list.join('\n') : `No tokens registered for "${name}"`,
        mimeType: 'text/plain',
      }],
    };
  }
);
```

Now when you ask the AI "which tokens does the button component use?", it reads `design://tokens/button` directly instead of you having to paste anything.

---

## Using ZyraUI for Component Scaffolding

The `generate_component` tool above creates a barebones Angular component. In practice your team probably wants to start from a ZyraUI-integrated template. Extend the tool to emit a starter template that imports the right [ZyraUI components](https://www.zyraui.dev/docs/components):

```typescript
// Inside generate_component tool, after running ng generate...
const templatePath = join(WORKSPACE_ROOT, 'src', 'app', ...routePath.split('/'), `${name.toLowerCase()}.component.ts`);

const zyraTemplate = `import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ZyraCardComponent, ZyraButtonComponent } from '@zyra-ui/angular';

@Component({
  selector: 'app-${name.toLowerCase().replace(/([A-Z])/g, (m) => '-' + m.toLowerCase())}',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZyraCardComponent, ZyraButtonComponent],
  template: \`
    <zyra-card>
      <p>{{ title() }}</p>
      <zyra-button variant="primary" (click)="onAction()">Action</zyra-button>
    </zyra-card>
  \`,
})
export class ${name}Component {
  readonly title = input.required<string>();

  onAction(): void {
    // implement
  }
}
`;

writeFileSync(templatePath, zyraTemplate, 'utf8');
```

This gives the AI a working starting point that already follows your token system, uses `input()` instead of `@Input`, and imports from [ZyraUI docs](https://www.zyraui.dev/docs) rather than a blank template.

Explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev) — the [ZyraUI components](https://www.zyraui.dev/docs/components) page shows every available import and its API.

---

## Wrapping up

A custom MCP server turns your AI assistant from a generic TypeScript helper into a tool that genuinely understands your Angular project. The `@modelcontextprotocol/sdk` makes the plumbing straightforward — you define tools with Zod schemas, return structured content, and the protocol handles the rest. Start with the three tools above, then add resources for your token registry, prompts for common refactor patterns, and tools for running your own project schematics. Once wired in, you'll stop pasting context and start getting answers that actually fit your codebase. Visit the [ZyraUI docs](https://www.zyraui.dev/docs) for component APIs you can surface directly through your server.

---

## Frequently asked questions

### What is an MCP server and why would an Angular developer build one?
An MCP server is a small process that exposes tools, resources, and prompts to AI assistants via the Model Context Protocol. Angular developers build them to give AI tools structured access to project-specific context — component lists, CLI commands, team conventions — without pasting that context manually into every chat session.

### Does my MCP server need to run continuously?
Yes, the server process must be running whenever your AI assistant is active. In practice you add it to your editor's MCP config and the editor spawns it on startup. For CI or team-shared setups you can run it as a background service or inside a Docker container.

### Can I use the Angular CLI MCP server instead of building my own?
The official Angular CLI MCP server (`ng mcp`) exposes generic Angular CLI commands and best-practice lookups. Building a custom server is worthwhile when you need project-specific tools — your own schematics, your design system's token index, your team conventions file — that the generic CLI server doesn't know about.

### Is `@modelcontextprotocol/sdk` production-ready?
The SDK is actively maintained and widely used across Claude, VS Code Copilot, and other major AI tools. Its API stabilized with version 1.x. For production use, pin the version in `package.json` and watch the [MCP changelog](https://modelcontextprotocol.io/changelog) for breaking changes between minor versions.
