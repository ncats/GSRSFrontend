import 'reflect-metadata';

const serializbleMetadataKey = Symbol('serializable');

export function serializable() {
    return Reflect.metadata(serializbleMetadataKey, true);
}

export function isSerializable(target: any, propertyKey: string) {
    return Reflect.hasMetadata(serializbleMetadataKey, target, propertyKey);
}
