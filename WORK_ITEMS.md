# Zyra UI Work Items

This file is the source checklist for the GitHub roadmap. Use GitHub Projects for visual tracking and keep this file as the long-form plan.

## Board Columns

- Backlog
- Ready
- In Progress
- Review
- Done

## Milestone 1: Project Audit

- [ ] Compare `projects/zyra-ng-ui/src/public-api.ts` with `UI_COMPONENT_SHOWCASE`.
- [ ] Confirm every exported component appears in the website component data.
- [ ] Confirm every component has a live demo under `projects/zyra-ui/src/app/pages/ui-components/comp`.
- [ ] Confirm every component has example code, variants, API props, accessibility notes, and related components.
- [ ] Create a missing-items table for docs/demo/test gaps.

## Milestone 2: Existing Component Docs

- [ ] Fix broken text encoding in docs data.
- [ ] Standardize all component descriptions.
- [ ] Standardize all example code snippets.
- [ ] Ensure every example uses standalone Angular components.
- [ ] Ensure every example imports from `zyra-ng-ui`.
- [ ] Make examples copy-paste ready for AI tools and developers.
- [ ] Add missing API props for all documented components.
- [ ] Add missing accessibility notes for all documented components.
- [ ] Add missing variant descriptions for all documented components.
- [ ] Add related component links for all documented components.

## Milestone 3: Components Gallery

- [ ] Review and polish `/components` gallery layout.
- [ ] Add category filters for Actions, Forms, Feedback, Layout, Overlays, and Identity.
- [ ] Add component search.
- [ ] Add optional status badges such as New and Popular.
- [ ] Add install command CTA near the top.
- [ ] Add quick links to `/docs` and `/use-with-ai`.

## Milestone 4: Component Detail Pages

- [ ] Keep `/components/:component` as the main component docs route.
- [ ] Reorder component detail sections: Header, Live Preview, Install/Import, Usage Example, Variants, API, Accessibility, Related Components.
- [ ] Add import snippet section.
- [ ] Add copy button for import snippets.
- [ ] Keep copy button for full example code.
- [ ] Add "Edit this component" GitHub link.
- [ ] Add "View source" GitHub link.
- [ ] Add a better invalid component slug state.
- [ ] Improve SEO title and description for every component page.
- [ ] Confirm SSR/prerender works for all component slugs.

## Milestone 5: Docs Setup Page

- [ ] Use `/docs` for setup docs, not individual component docs.
- [ ] Add installation section.
- [ ] Add peer dependencies section.
- [ ] Add global styles import section.
- [ ] Add `provideZyra()` setup section.
- [ ] Add dark/light theme setup.
- [ ] Add design token customization section.
- [ ] Add first component example.
- [ ] Add troubleshooting section.
- [ ] Add links to component gallery and blocks page.

## Milestone 6: AI Usage Page

- [ ] Add `/use-with-ai` route.
- [ ] Add page folder under `projects/zyra-ui/src/app/pages/use-with-ai`.
- [ ] Add server route for SSR/prerender.
- [ ] Add navigation link where appropriate.
- [ ] Add AI usage rules.
- [ ] Add prompt card for login page.
- [ ] Add prompt card for dashboard page.
- [ ] Add prompt card for settings page.
- [ ] Add prompt card for form validation.
- [ ] Add prompt card for modal workflow.
- [ ] Add prompt card for theme customization.
- [ ] Add copy button for every prompt.
- [ ] Add SEO metadata for `/use-with-ai`.

## Milestone 7: Blocks System

- [ ] Add `/blocks` route.
- [ ] Add `/blocks/:block` route.
- [ ] Add `projects/zyra-ui/src/app/pages/blocks`.
- [ ] Create `blocks.data.ts`.
- [ ] Create blocks gallery page.
- [ ] Create block detail page.
- [ ] Create `ZyraBlock` interface.
- [ ] Add block copy-code support.
- [ ] Add SEO metadata for block pages.
- [ ] Add SSR/prerender entries for block routes.

## Milestone 8: Ready-Made Blocks

- [ ] Add Login Form block.
- [ ] Add Signup Form block.
- [ ] Add Settings Form block.
- [ ] Add Pricing Cards block.
- [ ] Add Dashboard Stats block.
- [ ] Add Empty State block.
- [ ] Add Profile Card block.
- [ ] Add Notification Settings block.
- [ ] Add Form Validation block.
- [ ] Add Modal Confirmation block.
- [ ] Confirm every block has live preview, copy code, components used, responsive layout, and dark/light support.

## Milestone 9: Theme Builder

- [ ] Add `/theme-builder` route.
- [ ] Add page folder under `projects/zyra-ui/src/app/pages/theme-builder`.
- [ ] Add accent color control.
- [ ] Add radius control.
- [ ] Add theme mode toggle.
- [ ] Add live preview using Zyra components.
- [ ] Generate CSS token output.
- [ ] Add copy CSS button.
- [ ] Add reset theme button.
- [ ] Add SEO metadata for `/theme-builder`.

## Milestone 10: Library Component Quality

- [ ] Review component APIs for naming consistency.
- [ ] Make boolean props consistent.
- [ ] Make size props consistent.
- [ ] Make variant props consistent.
- [ ] Make output event names consistent.
- [ ] Check keyboard support for Button, Modal, Accordion, Toggle, Tooltip, and Toast dismiss.
- [ ] Check ARIA behavior for each component.
- [ ] Check disabled states.
- [ ] Check loading states.
- [ ] Check focus rings.
- [ ] Check dark and light theme styling.

## Milestone 11: Tests

- [ ] Improve Button tests.
- [ ] Improve Input tests.
- [ ] Improve Toast tests.
- [ ] Improve Modal tests.
- [ ] Improve Toggle tests.
- [ ] Improve Accordion tests.
- [ ] Improve theme service tests.
- [ ] Add token output tests if needed.
- [ ] Run library tests.
- [ ] Run website tests.
- [ ] Fix failing tests.

## Milestone 12: Homepage Upgrade

- [ ] Update homepage hero message.
- [ ] Add install command.
- [ ] Add component preview section.
- [ ] Add blocks preview section.
- [ ] Add AI usage CTA.
- [ ] Add theme builder CTA.
- [ ] Add GitHub and npm CTA.
- [ ] Add "Why Zyra UI?" section.

## Milestone 13: SEO And Trust

- [ ] Update `llms.txt`.
- [ ] Update `sitemap.xml`.
- [ ] Add `/blocks` to sitemap.
- [ ] Add `/use-with-ai` to sitemap.
- [ ] Add `/theme-builder` to sitemap.
- [ ] Add Open Graph metadata.
- [ ] Improve page titles.
- [ ] Add npm badge.
- [ ] Add GitHub link.
- [ ] Add changelog link.
- [ ] Add roadmap section or page.

## Milestone 14: Release Workflow

- [ ] Run format check.
- [ ] Run lint.
- [ ] Run tests.
- [ ] Build library.
- [ ] Build website.
- [ ] Fix build issues.
- [ ] Update changelog.
- [ ] Bump package version.
- [ ] Publish `zyra-ng-ui`.
- [ ] Deploy website.
- [ ] Create launch post.
