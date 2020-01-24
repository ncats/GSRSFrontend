export class SubstanceDetailsProperty {
    title?: string;
    count?: number;
    dynamicComponentId?: string;
    type?: string;
    order?: number;
    isLoaded: boolean;

    constructor(title?: string, count?: number, dynamicComponentId?: string, type?: string, order?: number) {
        this.title = title;
        this.count = count;
        this.dynamicComponentId = dynamicComponentId;
        this.type = type;
        this.order = order;
        this.isLoaded = false;
    }

    updateCount(count: number): void {
        this.count = count;
    }
}
