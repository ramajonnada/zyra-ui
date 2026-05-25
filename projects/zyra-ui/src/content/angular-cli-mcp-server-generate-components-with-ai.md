---
title: "Angular CLI MCP Server: Generate Components with AI"
description: "Learn how to set up the Angular CLI MCP server, what tools it gives your AI assistant, and how to generate accurate, modern Angular components with AI in 2026."
category:
    - "Angular AI"
    - "Angular 21"
tags:
    - "angular mcp server"
    - "angular cli mcp"
    - "ai component generation"
    - "angular 21"
    - "angular ai"
    - "ng mcp"
    - "vibe coding angular"
keywords:
    - "Angular MCP server"
    - "Angular CLI MCP"
    - "AI component generation Angular"
    - "ng mcp"
    - "generate Angular components with AI"
date: "2026-05-21T10:00:00.000Z"
slug: "angular-cli-mcp-server-generate-components-with-ai"
---

# Angular CLI MCP Server: Generate Components with AI

> **TL;DR:** The Angular CLI MCP server is an experimental tool, built into the Angular CLI, that lets AI assistants talk directly to the CLI and Angular's own best-practice examples. You start it with `ng mcp` and configure it in your editor (VS Code, Cursor, etc.) by pointing to `npx @angular/cli mcp`. It gives your AI tools like `find_examples` and `get_best_practices` so generated components use modern Angular — standalone, signals, `OnPush`, and native control flow — instead of outdated patterns.

AI assistants are good at writing code, but they are not always good at writing *modern Angular* code. Ask a generic model for a component and you often get `NgModule` boilerplate, `*ngIf`, constructor injection, and other patterns that Angular has been moving away from for years.

The Angular CLI MCP server fixes this at the source. Instead of hoping the model remembers current conventions, you give it a direct line into the Angular CLI and a curated set of best-practice examples.

In this guide you will learn:

- what the Angular CLI MCP server is
- which tools it exposes to your AI assistant
- how to set it up in VS Code, Cursor, and other editors
- how to use it to generate clean, modern components
- where a design system like ZyraUI fits into an AI-assisted workflow

---

## What is the Angular CLI MCP server?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that lets AI assistants talk to external tools in a structured way. The Angular CLI ships with an experimental MCP server that exposes Angular-specific capabilities to whatever AI assistant you use in your editor.

In practice, this means your coding agent can do things like look up authoritative Angular examples, read the official best-practices guide, list the projects in your workspace, and run CLI-powered code generation, without you copying and pasting context into a chat window.

The server is part of the Angular CLI itself, so there is no separate package to install if you are already on a recent Angular version.

---

## Which tools does it provide?

By default, the MCP server registers a focused set of tools. The most useful ones for day-to-day work are:

- `find_examples` — finds authoritative code examples from a curated database of official, best-practice examples, focused on modern and recently updated Angular features.
- `get_best_practices` — retrieves the Angular Best Practices Guide so generated code uses standalone components, typed forms, and modern control flow.
- `list_projects` — reads `angular.json` and lists the applications and libraries in your workspace.
- `onpush_zoneless_migration` — analyzes code and produces a step-by-step plan to migrate it to `OnPush`, a prerequisite for going zoneless.
- `search_documentation` — searches the official documentation at angular.dev for APIs, tutorials, and best practices.

There are also experimental tools you can opt into, such as `build`, `test`, `e2e`, `modernize`, and a set of `devserver.*` tools for starting and inspecting a dev server. These are off by default and enabled individually with the `--experimental-tool` flag, since they are newer and less tested.

The key idea: `find_examples` and `get_best_practices` are what stop your AI assistant from generating outdated Angular.

---

## Setting up the MCP server

To see setup instructions for your environment, run this in your project root:

```bash
ng mcp
```

When run from an interactive terminal, this prints configuration snippets for popular editors. The configuration is small in every case — you point the editor at `npx @angular/cli mcp`.

### VS Code

Create `.vscode/mcp.json` in your project root. Note that VS Code uses a `servers` property:

```json
{
    "servers": {
        "angular-cli": {
            "command": "npx",
            "args": ["-y", "@angular/cli", "mcp"]
        }
    }
}
```

### Cursor

Create `.cursor/mcp.json` (or `~/.cursor/mcp.json` for a global setup):

```json
{
    "mcpServers": {
        "angular-cli": {
            "command": "npx",
            "args": ["-y", "@angular/cli", "mcp"]
        }
    }
}
```

The same `mcpServers` shape works for Gemini CLI (`.gemini/settings.json`), Firebase Studio (`.idx/mcp.json`), and JetBrains IDEs. Check your editor's docs for the exact file location.

### Useful flags

You can pass options to the `mcp` command through the `args` array:

- `--read-only` registers only tools that do not change your project.
- `--local-only` registers only tools that do not need an internet connection.
- `--experimental-tool` (or `-E`) enables a specific experimental tool, for example `-E build test`.

A read-only VS Code setup looks like this:

```json
{
    "servers": {
        "angular-cli": {
            "command": "npx",
            "args": ["-y", "@angular/cli", "mcp", "--read-only"]
        }
    }
}
```

---

## Generating a component with AI

Once the server is connected, you do not call these tools directly. Your AI assistant decides when to use them based on your prompt. A good prompt nudges it toward the right tools.

Instead of:

> Make me a card component.

Try:

> Create a standalone Angular product card component using signals for state and modern control flow. Use the Angular best practices and find an authoritative example first.

That phrasing encourages the assistant to call `get_best_practices` and `find_examples` before writing anything. The result should look like current Angular rather than something from three versions ago:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface Product {
    name: string;
    price: number;
    inStock: boolean;
}

@Component({
    selector: 'app-product-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <article class="card">
            <h3>{{ product().name }}</h3>
            <p>{{ product().price | currency }}</p>

            @if (product().inStock) {
                <button>Add to cart</button>
            } @else {
                <span class="out">Out of stock</span>
            }
        </article>
    `,
})
export class ProductCard {
    product = input.required<Product>();
}
```

Notice what the best-practices context produces: no `standalone: true` (it is the default now), `input()` instead of `@Input()`, `OnPush` change detection, and `@if` instead of `*ngIf`. That is the difference between a generic model and one grounded in Angular's own examples.

---

## Where a component library fits in

The MCP server makes your AI assistant fluent in Angular's *patterns*. It does not give you a consistent *visual language*. Those are two different problems.

If every AI-generated screen invents its own button, spacing, and color tokens, you trade slow hand-coding for fast inconsistency. This is where a design system earns its place in the workflow.

A practical setup looks like this:

1. Use the MCP server so generated code follows modern Angular conventions.
2. Build screens out of a fixed component library so the output is visually consistent.
3. Let the AI assistant compose those library components instead of reinventing primitives.

With [ZyraUI](https://www.zyraui.dev), the prompt shifts from "build a button with these styles" to "compose a checkout form using ZyraUI components." The assistant handles the wiring and signals; the library guarantees the result looks like the rest of your product. You get the speed of AI generation without the design drift.

```ts
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-checkout',
    template: `
        <form>
            <zyra-input label="Email" [value]="email()" />
            <zyra-button (click)="submit()">Place order</zyra-button>
        </form>
    `,
})
export class Checkout {
    email = signal('');

    submit() {
        // handle order
    }
}
```

The assistant focuses on logic and composition. The visual layer stays under your control.

---

## A few honest caveats

The MCP server is labelled experimental, and that label is fair. A few things worth knowing before you lean on it:

- AI-generated code still needs review. Grounding the model in best practices raises the floor; it does not remove the need for a human to read the output.
- The experimental tools that *change* files (`build`, `modernize`, and the dev server tools) deserve extra caution. Start with read-only mode while you build trust.
- Tool support varies between editors. The configuration is standard, but how aggressively each assistant uses the tools differs.

None of this is a reason to avoid it. It is a reason to treat it as a strong assistant, not an autopilot.

---

## Frequently asked questions

### What is the Angular CLI MCP server?

It is an experimental Model Context Protocol server built into the Angular CLI that lets AI assistants in your editor interact with the CLI. It exposes tools for finding official code examples, retrieving Angular best practices, listing workspace projects, and running CLI-powered code generation.

### How do I set up the Angular MCP server?

Run `ng mcp` in your project root to see setup instructions, then add a small config file for your editor that points to `npx -y @angular/cli mcp`. For VS Code this is `.vscode/mcp.json` using a `servers` property; for Cursor it is `.cursor/mcp.json` using `mcpServers`.

### Does the MCP server require a recent Angular version?

Yes. The MCP server ships with the Angular CLI and is available in Angular v20.2 and later, and is included by default in Angular v21 projects.

### Is AI-generated Angular code from the MCP server production-ready?

It is higher quality because the model reads Angular's own best-practice examples, but it still needs human review. Treat it as a strong assistant, not an autopilot, especially for logic, security, and accessibility.

## Final thoughts

The Angular CLI MCP server is one of the most practical pieces of Angular's AI story in 2026. It is a small amount of configuration that meaningfully improves the quality of AI-generated Angular code, because the model is now reading from Angular's own examples and best practices instead of guessing.

Pair it with a consistent component library and you get a workflow that is both fast and coherent: the MCP server keeps the *code* modern, and your design system keeps the *UI* consistent.

To go deeper, start with the official docs:

- [Angular CLI MCP Server setup](https://angular.dev/ai/mcp)
- [LLM prompts and AI IDE setup](https://angular.dev/ai/develop-with-ai)
- [Build with AI overview](https://angular.dev/ai)
