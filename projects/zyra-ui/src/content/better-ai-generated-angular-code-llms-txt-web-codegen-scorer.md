---
title: "Better AI-Generated Angular Code: llms.txt & Codegen Scorer"
description: "How to make AI assistants write modern Angular: use llms.txt, the official best-practices rules files, and the Web Codegen Scorer to measure and improve generated code."
category:
    - "Angular AI"
    - "Angular 21"
tags:
    - "ai generated angular code"
    - "angular llms.txt"
    - "web codegen scorer"
    - "angular ai prompts"
    - "angular 21"
    - "angular best practices"
    - "vibe coding"
keywords:
    - "Angular llms.txt"
    - "AI generated Angular code"
    - "Web Codegen Scorer"
    - "Angular AI prompts"
    - "Angular best practices AI"
date: "2026-05-19T10:00:00.000Z"
slug: "better-ai-generated-angular-code-llms-txt-web-codegen-scorer"
---

# Better AI-Generated Angular Code: llms.txt & Codegen Scorer

> **TL;DR:** To make AI assistants write modern Angular, give them current context and measure the output. Install Angular's official `best-practices.md` as your editor's rules file, attach `llms.txt` or `llms-full.txt` for grounding, and use the open-source Web Codegen Scorer to score generations so you can tune prompts with evidence instead of guesswork. Together these stop models from defaulting to outdated patterns like `NgModule`, `*ngIf`, and `@Input()`.

Most teams ship AI-generated code now. The question is no longer *whether* to use it, but how to stop it from producing Angular that is subtly out of date.

Left alone, a general-purpose model tends to reach for the patterns it saw most often in training: `NgModule`, `*ngIf`, `@Input()`, constructor injection. Those still work, but they are not how modern Angular is written, and they age your codebase the moment the AI writes them.

Angular's team has shipped three concrete tools to fix this. This post covers all three and how to combine them.

You will learn:

- how to feed Angular conventions to your AI assistant with `llms.txt`
- how to install the official best-practices rules files in your editor
- how to measure AI-generated code quality with the Web Codegen Scorer
- a practical loop for improving generated code over time

---

## The core problem: models drift from frameworks

Frameworks evolve faster than model training data. Angular has changed significantly in just the last few releases: standalone components became the default, signals arrived and matured, native control flow replaced the structural directives, and zoneless became the default in v21.

A model trained on years of public code has seen far more old Angular than new Angular. Without extra context, it averages toward the past. The fix is to give it current, authoritative context at generation time. That is exactly what the following tools do.

---

## 1. Provide context with llms.txt

`llms.txt` is a proposed standard for websites that helps LLMs understand and process their content. The Angular team publishes two versions:

- [`llms.txt`](https://angular.dev/llms.txt) — an index file linking to key resources.
- [`llms-full.txt`](https://angular.dev/assets/context/llms-full.txt) — a larger compiled set of resources describing how Angular works and how to build Angular applications.

You can attach one of these as context when prompting, or wire it into tools that support fetching context files. The full version is heavier but gives the model a much richer picture of current Angular. Use the index version when you want something lightweight, and the full version when accuracy matters more than token cost.

---

## 2. Install the official best-practices rules

This is the highest-leverage step, and most teams skip it. Angular publishes a `best-practices.md` file designed to be used as system instructions or editor rules. It encodes the conventions you actually want enforced. A few highlights from it:

- Always use standalone components; do **not** set `standalone: true` (it is the default in v20+).
- Use `signals` for state and `computed()` for derived state.
- Use `input()` and `output()` functions instead of the `@Input()` / `@Output()` decorators.
- Set `changeDetection: ChangeDetectionStrategy.OnPush`.
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use `inject()` instead of constructor injection.
- Put host bindings in the `host` object rather than `@HostBinding` / `@HostListener`.
- Use `class` and `style` bindings instead of `ngClass` and `ngStyle`.

Most editors have a dedicated location for rules files. Angular documents the mapping, including:

- **VS Code** — `.instructions.md`
- **Copilot-powered IDEs** — `.github/copilot-instructions.md`
- **Cursor** — a rules file under `.cursor`
- **JetBrains / Windsurf / Firebase Studio** — `guidelines.md` or `airules.md`

Drop the official guidance into the right file once, and every generation in that project inherits modern conventions. You can [download the best-practices file here](https://angular.dev/assets/context/best-practices.md).

### Before and after

Without rules, a typical generation:

```ts
@Component({
    selector: 'app-counter',
    standalone: true,
    template: `<div *ngIf="visible">{{ count }}</div>`,
})
export class CounterComponent {
    @Input() count = 0;
    visible = true;
    constructor(private service: CounterService) {}
}
```

With the rules applied:

```ts
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

@Component({
    selector: 'app-counter',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (visible()) {
            <div>{{ count() }}</div>
        }
    `,
})
export class Counter {
    private readonly service = inject(CounterService);
    count = input(0);
    visible = input(true);
}
```

Same request, very different code. The second version will not look dated in six months.

---

## 3. Measure quality with the Web Codegen Scorer

Rules raise the floor, but how do you know they are working? You measure. The Angular team open-sourced the [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer), a tool that evaluates and scores the quality of AI-generated web code.

It lets you make evidence-based decisions instead of relying on vibes. Concretely, you can use it to:

- compare the quality of code produced by different models
- fine-tune your prompts and measure whether a change actually helped
- monitor quality over time as models and your rules evolve

This matters because prompt and rule tuning is otherwise guesswork. A scorer turns "this feels better" into "this scored higher," which is the only way to improve a generation pipeline with any confidence.

---

## Putting it together: a practical loop

These three tools form a feedback loop rather than a checklist:

1. **Set the rules.** Install `best-practices.md` in your editor's rules location.
2. **Add context.** Attach `llms.txt` or `llms-full.txt` for richer grounding.
3. **Generate.** Prompt as usual; ask the assistant to consult best practices first.
4. **Score.** Run the Web Codegen Scorer against representative prompts.
5. **Adjust.** Tweak rules and prompts, re-score, keep what improves the number.

Run this loop occasionally — not on every commit — and your AI-assisted output keeps pace with Angular instead of drifting behind it.

---

## Where consistency comes from

There is one thing none of these tools give you: a consistent *look*. They make generated Angular technically modern, but two screens generated from two prompts will still differ visually unless they build from shared components.

That is the role of a design system in an AI workflow. When your assistant composes screens from a fixed component library like [ZyraUI](https://www.zyraui.dev) instead of hand-rolling buttons and inputs each time, the visual layer stays consistent no matter how the code was generated. The rules keep the code clean; the library keeps the UI coherent. You need both.

---

## A realistic note on quality

None of this makes AI-generated code automatically correct. It makes it *modern* and *measurable*, which is a real improvement, but review still matters. Treat scores as a trend line, not a guarantee, and keep a human in the loop for anything that touches business logic, security, or accessibility.

The teams getting the most out of AI in 2026 are not the ones generating the most code. They are the ones who invested an afternoon in rules, context, and measurement so that everything generated afterward is worth keeping.

---

## Frequently asked questions

### What is llms.txt in Angular?

`llms.txt` is a proposed standard file that helps large language models understand a website's content. Angular publishes two versions — `llms.txt`, an index of key resources, and `llms-full.txt`, a larger compiled context file — that you attach when prompting so the model generates current Angular code.

### How do I make AI write modern Angular code?

Install Angular's official `best-practices.md` in your editor's rules location (for example `.github/copilot-instructions.md` for Copilot, or a rules file for Cursor). It instructs the model to use standalone components, signals, `input()`/`output()`, `OnPush`, native control flow, and `inject()`.

### What is the Web Codegen Scorer?

It is an open-source tool from the Angular team that evaluates and scores the quality of AI-generated web code. You use it to compare models, tune prompts, and monitor whether your generated code quality improves over time.

### Why does AI generate outdated Angular code?

Models are trained on years of public code, so they have seen far more old Angular (NgModules, structural directives, decorators) than the newer signal-first, standalone style. Providing current best-practices context at generation time corrects that bias.

## Final thoughts

If you do one thing from this post, install the official best-practices rules file in your editor. It is the cheapest, highest-impact change available. Add `llms.txt` for grounding and the Web Codegen Scorer when you are ready to measure, and you have a generation pipeline that produces Angular you would have written by hand.

To go deeper:

- [LLM prompts and AI IDE setup](https://angular.dev/ai/develop-with-ai)
- [Web Codegen Scorer on GitHub](https://github.com/angular/web-codegen-scorer)
- [Build with AI overview](https://angular.dev/ai)
