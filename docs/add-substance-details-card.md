# Adding Substance Details Cards

- Any console/command-line commands written below have to be done from inside this project's directory
- Core code (in the ./src/app/core directory) should never be touched
- How substance cards work:
    - Cards are dynamic, lazy-loaded pieces of code that are only added to the application when needed (they're not part of the main application code/chunk)
    - In order for the card to be included in a certain substance details page, it has to be associated with a predicate function (called filters here) that returns 'true' when called
    - Filters work async that initially return an observable and eventually "resolves" to a boolean
    - The cards have the option to return a count, which will appear as a rounded number on the left-side nav

## Create Substance Details Card
It's a good idea to include all the files related to a specific card inside a directory (and that directory preferably inside a directory called "substance-details")

1. Create module:
    1. Open CMD or any console
    2. Type `ng generate module path/to/files/{module-name} --flat=false` and hit enter
    3. This command will create a new module and add a new directory name after what you enter in `{module-name}`
    4. The module will be called ModuleNameModule (based on what you enter in `{module-name}`)
2. Create component:
    1. Open console
    2. Type `ng generate component path/to/files/{module-name}/{component-name} --flat=true` and hit enter
    3. This command will create a new component in the same directory as your previously created module and will add the component to your module
    4. The component will be called ComponentNameComponent
3. Update module:
    1. Import the DynamicComponentLoaderModule, by adding this to the top of the page: `import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';`
    2. Add the following to the `imports` section of the `@NgModule` data annotation: `DynamicComponentLoaderModule.forChild(ComponentNameComponent)`
4. Update component:
    1. The component has to inherit from `SubstanceCardBase` or from `SubstanceCardBaseFilteredList`
        - `SubstanceCardBase` has the following properties:
            ```
            substance: SubstanceDetail;
            title: string;
            analyticsEventCategory: string;
            @Output() countUpdate = new EventEmitter<number>();
            ```
        - `SubstanceCardBaseFilteredList` inherits from `SubstanceCardBase` and adds the following properties and methods:
            ```
            filtered: Array<T>;
            paged: Array<T>;
            page = 0;
            pageSize = 5;
            private searchTimer: any;
            searchControl = new FormControl();
            pageChange(pageEvent?: PageEvent, analyticsEventCategory?: string): void;
            filterList(searchInput: string, listToFilter: Array<T>, analyticsEventCategory: string = 'substance card'): void;
            ```
            - The construstor takes `public gaService: GoogleAnalyticsService` as parameter, so you have to make sure it gets passed in `super()`
    2. Import one of the above:
        - `import { SubstanceCardBase } from '@gsrs-core/substance-details/substance-card-base';`, or
        - `import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details/substance-card-base-filtered-list';`
    3. Extend component class:
        - `export class ComponentNameComponent extends SubstanceCardBase implements OnInit`, or
        - `export class ComponentNameComponent extends SubstanceCardBaseFilteredList<TypeOfObjectInList> implements OnInit`
5. Register lazy-loaded, dynamic module and component
    1. If list `export const manifiestsConstantName: Array<DynamicComponentManifest>` doesn't exist, create it in a single file
    2. Add instance of `DynamicComponentManifest` to the list with the following properties:
        ```
        {
            componentId: string, // unique name that identifies the component
            path: string, // unique url path used by the router to compile new bundle
            loadChildren: string // ./path/to-module/module-name.module#ModuleNameModule',
        }
        ```
    3. If the manifests list has not been added to your module, add it as follows:
        1. At the top of your module file, include `import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';` and `import { manifiestsConstantName } from './path-to-manifests-file';`,
        2. In the `imports` property of the `@NgModule` annotation, include: `DynamicComponentLoaderModule.forRoot(manifiestsConstantName)`
6. If not using one of the existing filters, register a new filter that will determine if the card is included for any specific substance
    1. Take into account the following:
        - A filter is an exportable function with the following signature:
            ```
            function (
                substance: SubstanceDetail,
                filterParameters: SubstanceCardFilterParameters,
                http?: HttpClient,
                auth?: AuthService
            ) => Observable<boolean>;
            ```
        - Your working module should have an exportable list of filter objects `export const filterConstantName: Array<SubstanceCardFilter>`, if not create one
        - If you create a new filter list, make sure it gets added to your module:
            1. At the top of your module file, include `import { SubstanceCardsModule } from '@gsrs-core/substance-details/substance-cards.module';` and `import { filterConstantName } from './path/to/filter-file';`
            2. In the `imports` property of the `@NgModule` annotation, include: `SubstanceCardsModule.forRoot(filterConstantName)`
        - The filter object has 2 propeties: 1) name of the filter, and 2) the exportable filter function:
            ```
            export interface SubstanceCardFilter {
                name: string;
                filter: (
                    substance: SubstanceDetail,
                    filterParameters: SubstanceCardFilterParameters,
                    http?: HttpClient,
                    auth?: AuthService
                ) => Observable<boolean>;
            }
            ```
    2. Create and register new filter
        1. Create exportable function that returns an Observable and then "resolves" a boolean
            ```
            export function myFilter(
                substance: SubstanceDetail,
                filter: SubstanceCardFilterParameters,
                http?: HttpClient,
                auth?: AuthService
            ): Observable<boolean> {
                return new Observable(observer => {
                    
                    /* here you can make http calls
                    or write any kind of logic*/

                    if (conditionMet) {
                        observer.next(true);
                    } else {
                        observer.next(false);
                    }

                    // always call the complete method
                    observer.complete();
                });
            }
            ```
        2. Add function to exportable list of filter, make sure to add unique name:
            ```
            export const constantName: Array<SubstanceCardFilter> = [
                {
                    name: 'my-filter' // can be anything - doesn't have to match how you name the function
                    filter: myFilter // you can either declare the function here or just add the function type here
                }
            ]
            ```
7. Include card and filter(s) in config file (located in the assets directory)
    1. In the `substanceDetailsCard` property of the config JSON object add the following:
        ```
        substanceDetailsCard: {
            card: string; // name of card that matches the name of the card in the DynamicComponentManifest above
            title?: string; // this will be displayed in the header of the card
            type?: string;  // optional and will be passed to component class
            order?: number; // optional, if you want it ordered different than order in config file
            filters?: [{ // this can have a list of filters and all have to return true for the card to be included for a specific substance
                         // all properties of this filter object are passed as a parameter to the filter function
                filterName: string; // must match name property of filter object that is registered in the app
                propertyToCheck?: string; // optional to be used by filter (default filters like 'equals' or 'contains'
                                          // use it to know what property it's checking)
                value?: any; // options to be used by filter (default filters like 'equals' or 'contains'
                             // use it to know what the value it's checking against the           property)
                propertyInArray?: string;
                order?: number;
            }]
        }
        ```
    