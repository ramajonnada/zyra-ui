import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faNpm } from '@fortawesome/free-brands-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
    faAlignLeft,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faBolt,
    faBoxOpen,
    faCertificate,
    faCheck,
    faCircleInfo,
    faCircleUser,
    faCodeBranch,
    faCubes,
    faDroplet,
    faEnvelope,
    faFolder,
    faGlobe,
    faHammer,
    faHandPointer,
    faKeyboard,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faMoon,
    faPalette,
    faPhone,
    faPuzzlePiece,
    faRocket,
    faScaleBalanced,
    faSpinner,
    faSwatchbook,
    faTrash,
    faTriangleExclamation,
    faUniversalAccess,
    faUser,
    faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';

export const appIcons = {
    alignLeft: faAlignLeft,
    arrowLeft: faArrowLeft,
    arrowRight: faArrowRight,
    arrowUp: faArrowUp,
    bolt: faBolt,
    boxOpen: faBoxOpen,
    certificate: faCertificate,
    check: faCheck,
    circleInfo: faCircleInfo,
    circleUser: faCircleUser,
    codeBranch: faCodeBranch,
    cubes: faCubes,
    droplet: faDroplet,
    envelope: faEnvelope,
    folder: faFolder,
    github: faGithub,
    globe: faGlobe,
    hammer: faHammer,
    handPointer: faHandPointer,
    keyboard: faKeyboard,
    lock: faLock,
    magnifyingGlass: faMagnifyingGlass,
    message: faMessage,
    moon: faMoon,
    npm: faNpm,
    palette: faPalette,
    phone: faPhone,
    puzzlePiece: faPuzzlePiece,
    rocket: faRocket,
    scaleBalanced: faScaleBalanced,
    spinner: faSpinner,
    square: faSquare,
    swatchbook: faSwatchbook,
    trash: faTrash,
    triangleExclamation: faTriangleExclamation,
    universalAccess: faUniversalAccess,
    user: faUser,
    waveSquare: faWaveSquare,
} as const;

export type AppIconKey = keyof typeof appIcons;

export interface AppIconOption {
    key: AppIconKey;
    label: string;
    icon: IconDefinition;
}

export const buttonLeftIconOptions: readonly AppIconOption[] = [
    { key: 'rocket', label: 'Rocket', icon: appIcons.rocket },
    { key: 'folder', label: 'Folder', icon: appIcons.folder },
    { key: 'magnifyingGlass', label: 'Search', icon: appIcons.magnifyingGlass },
    { key: 'trash', label: 'Trash', icon: appIcons.trash },
];

export const buttonRightIconOptions: readonly AppIconOption[] = [
    { key: 'arrowRight', label: 'Arrow right', icon: appIcons.arrowRight },
    { key: 'arrowLeft', label: 'Arrow left', icon: appIcons.arrowLeft },
    { key: 'arrowUp', label: 'Arrow up', icon: appIcons.arrowUp },
];

export const inputIconOptions: readonly AppIconOption[] = [
    { key: 'magnifyingGlass', label: 'Search', icon: appIcons.magnifyingGlass },
    { key: 'envelope', label: 'Email', icon: appIcons.envelope },
    { key: 'phone', label: 'Phone', icon: appIcons.phone },
    { key: 'user', label: 'User', icon: appIcons.user },
    { key: 'globe', label: 'Globe', icon: appIcons.globe },
    { key: 'lock', label: 'Lock', icon: appIcons.lock },
];
