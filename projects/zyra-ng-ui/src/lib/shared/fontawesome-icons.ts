import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faCheck,
    faCircle,
    faCircleInfo,
    faEye,
    faEyeSlash,
    faTriangleExclamation,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

export type ZyraIcon = IconDefinition | string | null | undefined;

export const zyraIcons = {
    check: faCheck,
    circle: faCircle,
    circleInfo: faCircleInfo,
    eye: faEye,
    eyeSlash: faEyeSlash,
    triangleExclamation: faTriangleExclamation,
    xmark: faXmark,
} as const;

export function asIconDefinition(value: ZyraIcon): IconDefinition | null {
    if (typeof value === 'object' && value !== null && 'prefix' in value && 'iconName' in value) {
        return value as IconDefinition;
    }

    return null;
}

export function asIconText(value: ZyraIcon): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
}
