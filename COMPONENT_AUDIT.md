# Component Audit

Audit target: `projects/zyra-ng-ui/src/public-api.ts`, `projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts`, and live demos under `projects/zyra-ui/src/app/pages/ui-components/comp`.

## Summary

All original components are aligned. Seven new components were added (Select, Skeleton, Textarea, Checkbox, Radio/RadioGroup, Tabs) with library specs, app demos, and showcase data entries. FormField now has its own dedicated demo page (previously shared with Input).

## Component Matrix

| Component | Exported | Showcase Data | Live Demo | Library Spec | Website Demo Spec | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Button | Yes | Yes | Yes | Yes | Yes | OK |
| Card | Yes | Yes | Yes | Yes | Yes | OK |
| Badge | Yes | Yes | Yes | Yes | Yes | OK |
| Avatar | Yes | Yes | Yes | Yes | Yes | OK |
| Input | Yes | Yes | Yes | Yes | Yes | OK |
| Form Field | Yes | Yes | Yes (dedicated) | Yes | Yes | OK |
| Spinner | Yes | Yes | Yes | Yes | Yes | OK |
| Toast | Yes | Yes | Yes | Yes | Yes | OK |
| Tooltip | Yes | Yes | Yes | Yes | Yes | OK |
| Progress | Yes | Yes | Yes | No | No | Needs library spec |
| Divider | Yes | Yes | Yes | No | No | Needs library spec |
| Toggle | Yes | Yes | Yes | No | No | Needs library spec |
| Chip | Yes | Yes | Yes | No | No | Needs library spec |
| Alert | Yes | Yes | Yes | No | No | Needs library spec |
| Modal | Yes | Yes | Yes | No | No | Needs library spec |
| Accordion | Yes | Yes | Yes | No | No | Needs library spec |
| Accordion Item | Yes | Part of Accordion | Part of Accordion | No | Part of Accordion | Needs library spec |
| Select | Yes | Yes | Yes | Yes | Yes | OK |
| Option | Yes | Part of Select | Part of Select | Part of Select | Part of Select | OK as child |
| Skeleton | Yes | Yes | Yes | Yes | Yes | OK |
| Textarea | Yes | Yes | Yes | Yes | Yes | OK |
| Checkbox | Yes | Yes | Yes | Yes | Yes | OK |
| Radio | Yes | Yes | Yes | Yes | Yes | OK |
| Radio Group | Yes | Part of Radio | Part of Radio | Part of Radio | Part of Radio | OK as parent |
| Tabs | Yes | Yes | Yes | Yes | Yes | OK |
| Tab | Yes | Part of Tabs | Part of Tabs | Part of Tabs | Part of Tabs | OK as child |

## Remaining Issues

1. Library specs missing for: Progress, Divider, Toggle, Chip, Alert, Modal, Accordion, AccordionItem
2. Website demo specs missing for the same components
3. `tsconfig.app.json` has a `paths` override pointing `zyra-ng-ui` to `dist/zyra-ng-ui` — must be reverted before deploying to Vercel

## Next Components to Build

- Popover
- Breadcrumb
- Pagination
- Table
- Date picker
