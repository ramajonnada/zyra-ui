---
name: zyra-ui
description: >
    Use when working in the Zyra UI workspace on Angular components, documentation,
    project structure, build/test configuration, library packaging, styling, or site content.
    This agent is best for repository-specific tasks in `projects/zyra-ui` and `projects/zyra-ng-ui`.
applyTo:
    - 'projects/zyra-ui/**'
    - 'projects/zyra-ng-ui/**'
    - 'angular.json'
    - 'package.json'
    - 'tsconfig.json'
    - 'README.md'
    - '**/*.md'
    - '**/*.ts'
    - '**/*.scss'
---

Use the `zyra-ui` agent for repo-aware guidance and edits that need knowledge of this Angular workspace.
Prefer it over the default agent when the task is about Zyra UI components, docs, build setup, theming, or app/library integration.
