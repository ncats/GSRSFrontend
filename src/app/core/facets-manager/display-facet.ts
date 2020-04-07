export class DisplayFacet {
    type: string;
    bool: boolean;
    val: string;
    removeFacet: (type: string, bool: boolean, val: string) => void;

    constructor(type: string, bool: boolean, val: string, onRemove: (type: string, bool: boolean, val: string) => void) {
        this.type = type;
        this.bool = bool;
        this.val = val;
        this.removeFacet = onRemove;
    }
}
