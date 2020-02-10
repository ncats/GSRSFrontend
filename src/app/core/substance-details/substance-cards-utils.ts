export function getEvaluatedProperty(substance: any, propertyToCheck?: string): any {

    if (propertyToCheck == null) {
        return null;
    } else if (propertyToCheck.indexOf('.') > -1) {
        const properties = propertyToCheck.split('.');
        let evaluatedObject = substance;
        const lastIndex = properties.length - 1;
        for (let i = 0; i < properties.length; i++) {
            if (i !== lastIndex) {
                if (evaluatedObject[properties[i]] != null
                    && Object.prototype.toString.call(evaluatedObject[properties[i]]) === '[object Object]') {
                    evaluatedObject = evaluatedObject[properties[i]];
                } else {
                    return null;
                }
            } else {
                return evaluatedObject[properties[i]];
            }
        }
    } else {
        return substance[propertyToCheck];
    }
}
