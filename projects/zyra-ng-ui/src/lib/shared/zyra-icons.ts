import type { ZyraIconData } from '../internal/zyra-icon/zyra-icon';

export type { ZyraIconData };
export type ZyraIconInput = ZyraIconData | string | null | undefined;

export function isLucideIcon(value: ZyraIconInput): value is ZyraIconData {
    return Array.isArray(value);
}

export function asIconText(value: ZyraIconInput): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
// SVG path data in Lucide format. Each icon is a named export so bundlers can
// tree-shake unused icons — only imported icons appear in the final bundle.

export const alignLeft: ZyraIconData = [
    ['rect', { width: '6', height: '14', x: '6', y: '5', rx: '2', key: 'hsirpf' }],
    ['rect', { width: '6', height: '10', x: '16', y: '7', rx: '2', key: '13zkjt' }],
    ['path', { d: 'M2 2v20', key: '1ivd8o' }],
];

export const arrowLeft: ZyraIconData = [
    ['path', { d: 'm12 19-7-7 7-7', key: '1l729n' }],
    ['path', { d: 'M19 12H5', key: 'x3x0zl' }],
];

export const arrowRight: ZyraIconData = [
    ['path', { d: 'M5 12h14', key: '1ays0h' }],
    ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
];

export const arrowUp: ZyraIconData = [
    ['path', { d: 'm5 12 7-7 7 7', key: 'hav0vg' }],
    ['path', { d: 'M12 19V5', key: 'x0mq9r' }],
];

export const bolt: ZyraIconData = [
    ['path', { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z', key: '1xq2db' }],
];

export const boxOpen: ZyraIconData = [
    ['path', { d: 'M12 22v-9', key: 'x3hkom' }],
    ['path', { d: 'M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z', key: '2ntwy6' }],
    ['path', { d: 'M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13', key: '1pmm1c' }],
    ['path', { d: 'M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z', key: '1gyxl4' }],
];

export const caretDown: ZyraIconData  = [['path', { d: 'm6 9 6 6 6-6',   key: 'm6s9ch' }]];
export const caretLeft: ZyraIconData  = [['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }]];
export const caretRight: ZyraIconData = [['path', { d: 'm9 18 6-6-6-6',  key: 'mthhwq' }]];

export const certificate: ZyraIconData = [
    ['path', { d: 'm15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526', key: '1yiouv' }],
    ['circle', { cx: '12', cy: '8', r: '6', key: '1vp47v' }],
];

export const check: ZyraIconData = [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]];

export const chevronDown: ZyraIconData = [['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }]];

export const chevronLeft: ZyraIconData = [['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }]];

export const chevronRight: ZyraIconData = [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]];

export const circle: ZyraIconData = [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
];

export const circleInfo: ZyraIconData = [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'M12 16v-4', key: '1dtifu' }],
    ['path', { d: 'M12 8h.01', key: 'e9boi3' }],
];

export const circleUser: ZyraIconData = [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
    ['path', { d: 'M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662', key: '154egf' }],
];

export const copy: ZyraIconData = [
    ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
    ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
];

export const code: ZyraIconData = [
    ['path', { d: 'm16 18 6-6-6-6', key: 'eg8j8' }],
    ['path', { d: 'm8 6-6 6 6 6', key: 'ppft3o' }],
];

export const codeBranch: ZyraIconData = [
    ['path', { d: 'M15 6a9 9 0 0 0-9 9V3', key: '1cii5b' }],
    ['circle', { cx: '18', cy: '6', r: '3', key: '1h7g24' }],
    ['circle', { cx: '6', cy: '18', r: '3', key: 'fqmcym' }],
];

export const cubes: ZyraIconData = [
    ['path', { d: 'M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z', key: 'lc1i9w' }],
    ['path', { d: 'm7 16.5-4.74-2.85', key: '1o9zyk' }],
    ['path', { d: 'm7 16.5 5-3', key: 'va8pkn' }],
    ['path', { d: 'M7 16.5v5.17', key: 'jnp8gn' }],
    ['path', { d: 'M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z', key: '8zsnat' }],
    ['path', { d: 'm17 16.5-5-3', key: '8arw3v' }],
    ['path', { d: 'm17 16.5 4.74-2.85', key: '8rfmw' }],
    ['path', { d: 'M17 16.5v5.17', key: 'rw3hy7' }],
    ['path', { d: 'M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z', key: '1sron7' }],
    ['path', { d: 'M12 8 7.26 5.15', key: '1fzq6s' }],
    ['path', { d: 'm12 8 4.74-2.85', key: 'o6gy4' }],
    ['path', { d: 'M12 13.5V8', key: '1h7cdi' }],
];

export const droplet: ZyraIconData = [
    ['path', { d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z', key: 'c7niix' }],
];

export const envelope: ZyraIconData = [
    ['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7', key: '132q7q' }],
    ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2', key: 'izxlao' }],
];

export const eye: ZyraIconData = [
    ['path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0', key: '1nclc0' }],
    ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
];

export const eyeSlash: ZyraIconData = [
    ['path', { d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49', key: 'ct8e1f' }],
    ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242', key: '151rxh' }],
    ['path', { d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143', key: '13bj9a' }],
    ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
];

export const folder: ZyraIconData = [
    ['path', { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', key: '1kt360' }],
];

export const github: ZyraIconData = [
    ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', key: 'tonef' }],
    ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: '9comsn' }],
];

export const globe: ZyraIconData = [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', key: '13o1zl' }],
    ['path', { d: 'M2 12h20', key: '9i4pu4' }],
];

export const hammer: ZyraIconData = [
    ['path', { d: 'm15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9', key: '1hayfq' }],
    ['path', { d: 'm18 15 4-4', key: '16gjal' }],
    ['path', { d: 'm21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5', key: '15ts47' }],
];

export const handPointer: ZyraIconData = [
    ['path', { d: 'M14 4.1 12 6', key: 'ita8i4' }],
    ['path', { d: 'm5.1 8-2.9-.8', key: '1go3kf' }],
    ['path', { d: 'm6 12-1.9 2', key: 'mnht97' }],
    ['path', { d: 'M7.2 2.2 8 5.1', key: '1cfko1' }],
    ['path', { d: 'M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z', key: 's0h3yz' }],
];

export const instagram: ZyraIconData = [
    ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '2e1cvw' }],
    ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '9exkf1' }],
    ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'r4j83e' }],
];

export const keyboard: ZyraIconData = [
    ['path', { d: 'M10 8h.01', key: '1r9ogq' }],
    ['path', { d: 'M12 12h.01', key: '1mp3jc' }],
    ['path', { d: 'M14 8h.01', key: '1primd' }],
    ['path', { d: 'M16 12h.01', key: '1l6xoz' }],
    ['path', { d: 'M18 8h.01', key: 'emo2bl' }],
    ['path', { d: 'M6 8h.01', key: 'x9i8wu' }],
    ['path', { d: 'M7 16h10', key: 'wp8him' }],
    ['path', { d: 'M8 12h.01', key: 'czm47f' }],
    ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2', key: '18n3k1' }],
];

export const lightbulb: ZyraIconData = [
    ['path', { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', key: '1gvzjb' }],
    ['path', { d: 'M9 18h6', key: 'x1upvd' }],
    ['path', { d: 'M10 22h4', key: 'ceow96' }],
];

export const lock: ZyraIconData = [
    ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2', key: '1w4ew1' }],
    ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4', key: 'fwvmzm' }],
];

export const magnifyingGlass: ZyraIconData = [
    ['path', { d: 'm21 21-4.34-4.34', key: '14j7rj' }],
    ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
];

export const menu: ZyraIconData = [
    ['path', { d: 'M4 6h16', key: '1o5vig' }],
    ['path', { d: 'M4 12h16', key: '1lakjw' }],
    ['path', { d: 'M4 18h16', key: '19g7jn' }],
];

export const message: ZyraIconData = [
    ['path', { d: 'M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z', key: '18887p' }],
];

export const minus: ZyraIconData = [['path', { d: 'M5 12h14', key: '1ays0h' }]];

export const moon: ZyraIconData = [
    ['path', { d: 'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401', key: 'kfwtm' }],
];

export const npm: ZyraIconData = [
    ['path', { d: 'M12 3v6', key: '1holv5' }],
    ['path', { d: 'M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z', key: '187q7i' }],
    ['path', { d: 'M3.054 9.013h17.893', key: 'grwhos' }],
];

export const palette: ZyraIconData = [
    ['path', { d: 'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z', key: 'e79jfc' }],
    ['circle', { cx: '13.5', cy: '6.5', r: '.5', fill: 'currentColor', key: '1okk4w' }],
    ['circle', { cx: '17.5', cy: '10.5', r: '.5', fill: 'currentColor', key: 'f64h9f' }],
    ['circle', { cx: '6.5', cy: '12.5', r: '.5', fill: 'currentColor', key: 'qy21gx' }],
    ['circle', { cx: '8.5', cy: '7.5', r: '.5', fill: 'currentColor', key: 'fotxhn' }],
];

export const phone: ZyraIconData = [
    ['path', { d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384', key: '9njp5v' }],
];

export const panelLeft: ZyraIconData = [
    ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
    ['path', { d: 'M9 3v18', key: 'fh3hqa' }],
];

export const puzzlePiece: ZyraIconData = [
    ['path', { d: 'M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z', key: 'w46dr5' }],
];

export const rocket: ZyraIconData = [
    ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5', key: 'qeys4' }],
    ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09', key: 'u4xsad' }],
    ['path', { d: 'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z', key: '676m9' }],
    ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05', key: '92ym6u' }],
];

export const scaleBalanced: ZyraIconData = [
    ['path', { d: 'M12 3v18', key: '108xh3' }],
    ['path', { d: 'm19 8 3 8a5 5 0 0 1-6 0zV7', key: 'zcdpyk' }],
    ['path', { d: 'M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1', key: '1yorad' }],
    ['path', { d: 'm5 8 3 8a5 5 0 0 1-6 0zV7', key: 'eua70x' }],
    ['path', { d: 'M7 21h10', key: '1b0cd5' }],
];

export const search: ZyraIconData = [
    ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
    ['path', { d: 'm21 21-4.3-4.3', key: '1qie3q' }],
];

export const spinner: ZyraIconData = [
    ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }],
];

export const square: ZyraIconData = [
    ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
];

export const star: ZyraIconData = [
    [
        'path',
        {
            d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
            key: '17ma8d',
        },
    ],
];

export const sun: ZyraIconData = [
    ['circle', { cx: '12', cy: '12', r: '4', key: '4exip2' }],
    ['path', { d: 'M12 2v2', key: 'tus03m' }],
    ['path', { d: 'M12 20v2', key: '1lh1kg' }],
    ['path', { d: 'm4.93 4.93 1.41 1.41', key: '149t6j' }],
    ['path', { d: 'm17.66 17.66 1.41 1.41', key: 'ptbguv' }],
    ['path', { d: 'M2 12h2', key: '1t8f8n' }],
    ['path', { d: 'M20 12h2', key: '1q8mjw' }],
    ['path', { d: 'm6.34 17.66-1.41 1.41', key: '1m8zz5' }],
    ['path', { d: 'm19.07 4.93-1.41 1.41', key: '1mh1kj' }],
];

export const swatchbook: ZyraIconData = [
    ['path', { d: 'M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z', key: '1ldrpk' }],
    ['path', { d: 'M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7', key: '11i5po' }],
    ['path', { d: 'M 7 17h.01', key: '1euzgo' }],
    ['path', { d: 'm11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8', key: 'o2gii7' }],
];

export const trash: ZyraIconData = [
    ['path', { d: 'M10 11v6', key: 'nco0om' }],
    ['path', { d: 'M14 11v6', key: 'outv1u' }],
    ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', key: 'miytrc' }],
    ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
    ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'e791ji' }],
];

export const triangleExclamation: ZyraIconData = [
    ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3', key: 'wmoenq' }],
    ['path', { d: 'M12 9v4', key: 'juzpu7' }],
    ['path', { d: 'M12 17h.01', key: 'p32p05' }],
];

export const universalAccess: ZyraIconData = [
    ['circle', { cx: '16', cy: '4', r: '1', key: '1grugj' }],
    ['path', { d: 'm18 19 1-7-6 1', key: 'r0i19z' }],
    ['path', { d: 'm5 8 3-3 5.5 3-2.36 3.5', key: '9ptxx2' }],
    ['path', { d: 'M4.24 14.5a5 5 0 0 0 6.88 6', key: '10kmtu' }],
    ['path', { d: 'M13.76 17.5a5 5 0 0 0-6.88-6', key: '2qq6rc' }],
];

export const user: ZyraIconData = [
    ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' }],
    ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
];

export const waveSquare: ZyraIconData = [
    ['path', { d: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', key: 'knzxuh' }],
    ['path', { d: 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', key: '2jd2cc' }],
    ['path', { d: 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', key: 'rd2r6e' }],
];

export const xmark: ZyraIconData = [
    ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
    ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
];
