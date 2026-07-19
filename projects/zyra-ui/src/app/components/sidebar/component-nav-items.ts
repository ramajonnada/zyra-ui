// Lightweight slug/title list for nav purposes only — deliberately NOT
// derived from ui-components.data.ts at runtime. That file carries example
// code, API prop tables, and icons for all 53 components (~170KB) and is
// only ever pulled into the lazy-loaded ui-components/ui-component-detail
// chunks. Sidebar/header are part of the eager app shell, so importing the
// full data file here would drag that ~170KB into every page's initial
// bundle. Keep this list in sync with ui-components.data.ts's slugs/titles
// when components are added, renamed, or removed. (56 components as of
// this writing — see COMPONENT_COUNT in ui-components.data.ts.)
export interface ComponentNavItem {
	label: string;
	route: string;
}

export const COMPONENT_NAV_ITEMS: readonly ComponentNavItem[] = [
	{ label: 'Accordion', route: '/docs/components/accordion' },
	{ label: 'Alert', route: '/docs/components/alert' },
	{ label: 'Aspect Ratio', route: '/docs/components/aspect-ratio' },
	{ label: 'Autocomplete', route: '/docs/components/autocomplete' },
	{ label: 'Avatar', route: '/docs/components/avatar' },
	{ label: 'Badge', route: '/docs/components/badge' },
	{ label: 'Box', route: '/docs/components/box' },
	{ label: 'Breadcrumb', route: '/docs/components/breadcrumb' },
	{ label: 'Button', route: '/docs/components/button' },
	{ label: 'Button Group', route: '/docs/components/button-group' },
	{ label: 'Calendar', route: '/docs/components/calendar' },
	{ label: 'Card', route: '/docs/components/card' },
	{ label: 'Carousel', route: '/docs/components/carousel' },
	{ label: 'Checkbox', route: '/docs/components/checkbox' },
	{ label: 'Chip', route: '/docs/components/chip' },
	{ label: 'Clipboard', route: '/docs/components/clipboard' },
	{ label: 'Code Block', route: '/docs/components/code-block' },
	{ label: 'Confirm Dialog', route: '/docs/components/confirm-dialog' },
	{ label: 'Container', route: '/docs/components/container' },
	{ label: 'Date Picker', route: '/docs/components/date-picker' },
	{ label: 'Divider', route: '/docs/components/divider' },
	{ label: 'Drawer', route: '/docs/components/drawer' },
	{ label: 'Dropdown Menu', route: '/docs/components/dropdown-menu' },
	{ label: 'Empty State', route: '/docs/components/empty-state' },
	{ label: 'File Upload', route: '/docs/components/file-upload' },
	{ label: 'Flex', route: '/docs/components/flex' },
	{ label: 'Form Field', route: '/docs/components/form-field' },
	{ label: 'Grid', route: '/docs/components/grid' },
	{ label: 'Header', route: '/docs/components/header' },
	{ label: 'Input', route: '/docs/components/input' },
	{ label: 'Modal', route: '/docs/components/modal' },
	{ label: 'Multi Select', route: '/docs/components/multi-select' },
	{ label: 'Pagination', route: '/docs/components/pagination' },
	{ label: 'Popover', route: '/docs/components/popover' },
	{ label: 'Progress', route: '/docs/components/progress' },
	{ label: 'Radio Group', route: '/docs/components/radio' },
	{ label: 'Rating', route: '/docs/components/rating' },
	{ label: 'Scroll Area', route: '/docs/components/scroll-area' },
	{ label: 'Select', route: '/docs/components/select' },
	{ label: 'Sidebar', route: '/docs/components/sidebar' },
	{ label: 'Skeleton', route: '/docs/components/skeleton' },
	{ label: 'Slider', route: '/docs/components/slider' },
	{ label: 'Spinner', route: '/docs/components/spinner' },
	{ label: 'Stack', route: '/docs/components/stack' },
	{ label: 'Stepper', route: '/docs/components/stepper' },
	{ label: 'Switch', route: '/docs/components/switch' },
	{ label: 'Table', route: '/docs/components/table' },
	{ label: 'Tabs', route: '/docs/components/tabs' },
	{ label: 'Textarea', route: '/docs/components/textarea' },
	{ label: 'Theme Switch', route: '/docs/components/theme-switch' },
	{ label: 'Timeline', route: '/docs/components/timeline' },
	{ label: 'Toast', route: '/docs/components/toast' },
	{ label: 'Toggle', route: '/docs/components/toggle' },
	{ label: 'Tooltip', route: '/docs/components/tooltip' },
	{ label: 'Tree View', route: '/docs/components/tree-view' },
	{ label: 'Typography', route: '/docs/components/typography' },
];
