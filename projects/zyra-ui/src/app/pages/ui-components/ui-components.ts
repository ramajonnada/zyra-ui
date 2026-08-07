import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    search,
    ZyraAccordion,
    ZyraAccordionItem,
    ZyraAlert,
    ZyraAspectRatio,
    ZyraAutocomplete,
    ZyraAvatar,
    ZyraBadge,
    ZyraBox,
    ZyraBreadcrumb,
    ZyraBreadcrumbItem,
    ZyraButton,
    ZyraButtonGroup,
    ZyraCalendar,
    ZyraCard,
    ZyraCarousel,
    ZyraCarouselSlide,
    ZyraCheckbox,
    ZyraChip,
    ZyraClipboard,
    ZyraCodeBlock,
    ZyraContainer,
    ZyraDatePicker,
    ZyraDivider,
    ZyraDropdownMenu,
    ZyraEmptyState,
    ZyraFileUpload,
    ZyraFlex,
    ZyraFormField,
    ZyraGrid,
    ZyraHeader,
    ZyraHeaderEnd,
    ZyraHeaderStart,
    ZyraImage,
    ZyraInput,
    ZyraJsonViewer,
    ZyraMarkdownViewer,
    ZyraMenuItem,
    ZyraMultiSelect,
    ZyraOption,
    ZyraPagination,
    ZyraProgress,
    ZyraRadio,
    ZyraRadioGroup,
    ZyraRating,
    ZyraScrollArea,
    ZyraSelect,
    ZyraSidebar,
    ZyraSidebarItem,
    ZyraSkeleton,
    ZyraSlider,
    ZyraSpinner,
    ZyraStack,
    ZyraStep,
    ZyraStepper,
    ZyraSwitch,
    ZyraTab,
    ZyraTable,
    ZyraTabs,
    ZyraTextarea,
    ZyraThemeSwitch,
    ZyraTimeline,
    ZyraTimelineItem,
    ZyraToastItem,
    ZyraToggle,
    ZyraTooltip,
    ZyraTreeView,
    ZyraTypography,
} from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { COMPONENT_COUNT, UI_COMPONENT_SHOWCASE } from './ui-components.data';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../shared/breadcrumb-jsonld';

@Component({
    selector: 'app-ui-components',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        ZyraAccordion,
        ZyraAccordionItem,
        ZyraAlert,
        ZyraAspectRatio,
        ZyraAutocomplete,
        ZyraAvatar,
        ZyraBadge,
        ZyraBox,
        ZyraBreadcrumb,
        ZyraBreadcrumbItem,
        ZyraButton,
        ZyraButtonGroup,
        ZyraCalendar,
        ZyraCard,
        ZyraCarousel,
        ZyraCarouselSlide,
        ZyraCheckbox,
        ZyraChip,
        ZyraClipboard,
        ZyraCodeBlock,
        ZyraContainer,
        ZyraDatePicker,
        ZyraDivider,
        ZyraDropdownMenu,
        ZyraEmptyState,
        ZyraFileUpload,
        ZyraFlex,
        ZyraFormField,
        ZyraGrid,
        ZyraHeader,
        ZyraHeaderEnd,
        ZyraHeaderStart,
        ZyraImage,
        ZyraInput,
        ZyraJsonViewer,
        ZyraMarkdownViewer,
        ZyraMenuItem,
        ZyraMultiSelect,
        ZyraOption,
        ZyraPagination,
        ZyraProgress,
        ZyraRadio,
        ZyraRadioGroup,
        ZyraRating,
        ZyraScrollArea,
        ZyraSelect,
        ZyraSidebar,
        ZyraSidebarItem,
        ZyraSkeleton,
        ZyraSlider,
        ZyraSpinner,
        ZyraStack,
        ZyraStep,
        ZyraStepper,
        ZyraSwitch,
        ZyraTab,
        ZyraTable,
        ZyraTabs,
        ZyraTextarea,
        ZyraThemeSwitch,
        ZyraTimeline,
        ZyraTimelineItem,
        ZyraToastItem,
        ZyraToggle,
        ZyraTooltip,
        ZyraTreeView,
        ZyraTypography,
    ],
    templateUrl: './ui-components.html',
    styleUrl: './ui-components.scss',
})
export class UiComponents implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);
    private readonly route = inject(ActivatedRoute);

    readonly icons = { search };
    readonly componentCount = COMPONENT_COUNT;
    readonly categoryCount = new Set(UI_COMPONENT_SHOWCASE.map((c) => c.category)).size;

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Components', url: 'https://www.zyraui.dev/docs/components' },
    ];

    readonly searchQuery = signal('');

    private readonly sortedCards = [...UI_COMPONENT_SHOWCASE].sort((a, b) =>
        a.title.localeCompare(b.title),
    );

    readonly filteredCards = computed(() => {
        const q = this.searchQuery().toLowerCase().trim();
        if (!q) return this.sortedCards;
        return this.sortedCards.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.selector.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                (c.description ?? '').toLowerCase().includes(q),
        );
    });

    ngOnInit(): void {
        // Seeds the existing client-side search from ?q= so the SearchAction
        // JSON-LD's search endpoint (see home.ts) actually does something —
        // it was pointing here with no query-string handling at all before.
        const q = this.route.snapshot.queryParamMap.get('q');
        if (q) this.searchQuery.set(q);

        this.seo.setSEO({
            title: 'Angular UI Components - Zyra UI',
            description:
                `Explore all ${COMPONENT_COUNT} Zyra UI Angular components — buttons, cards, inputs, forms, modals, toasts, tooltips, tabs, accordion, skeleton, and more. Interactive playgrounds with copy-paste Angular code.`,
            url: 'https://www.zyraui.dev/docs/components',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
