export interface SubstanceDetailsProperty<T> {
    name: string;
    count: number;
    data: T;
    dynamicComponentId?: string;
}
