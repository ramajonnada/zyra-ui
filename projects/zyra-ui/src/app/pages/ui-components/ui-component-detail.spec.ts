import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { UiComponentDetail } from './ui-component-detail';
import { getUiComponentShowcaseCard, UI_COMPONENT_SHOWCASE } from './ui-components.data';

function createWithSlug(slug: string): Promise<ComponentFixture<UiComponentDetail>> {
    return TestBed.configureTestingModule({
        imports: [UiComponentDetail],
        providers: [
            provideRouter([]),
            {
                provide: ActivatedRoute,
                useValue: {
                    paramMap: of(convertToParamMap({ component: slug })),
                    snapshot: { paramMap: convertToParamMap({ component: slug }) },
                },
            },
        ],
    })
        .compileComponents()
        .then(() => {
            const fixture = TestBed.createComponent(UiComponentDetail);
            fixture.detectChanges();
            return fixture;
        });
}

describe('UiComponentDetail', () => {
    beforeEach(() => TestBed.resetTestingModule());

    it('resolves the correct showcase card for a known slug', async () => {
        const fixture = await createWithSlug('button');
        const component = fixture.componentInstance;
        expect(component.component()).toEqual(getUiComponentShowcaseCard('button'));
    });

    it('component() is undefined for an unknown slug', async () => {
        const fixture = await createWithSlug('nonexistent-slug');
        const component = fixture.componentInstance;
        expect(component.component()).toBeUndefined();
    });

    it('playgroundConfig is null when no config exists for the slug', async () => {
        const fixture = await createWithSlug('nonexistent-slug');
        expect(fixture.componentInstance.playgroundConfig()).toBeNull();
    });

    it('relatedComponents maps relatedSlugs to showcase cards', async () => {
        // Find a component that has related slugs
        const withRelated = UI_COMPONENT_SHOWCASE.find(
            (c) => c.relatedSlugs && c.relatedSlugs.length > 0,
        );
        if (!withRelated) {
            pending('No component with relatedSlugs found');
            return;
        }

        const fixture = await createWithSlug(withRelated.slug);
        const related = fixture.componentInstance.relatedComponents();

        expect(related.length).toBe(withRelated.relatedSlugs.length);
        related.forEach((card, i) => {
            expect(card?.slug).toBe(withRelated.relatedSlugs[i]);
        });
    });

    it('relatedComponents is empty when component() is undefined', async () => {
        const fixture = await createWithSlug('no-such-component');
        expect(fixture.componentInstance.relatedComponents().length).toBe(0);
    });
});
