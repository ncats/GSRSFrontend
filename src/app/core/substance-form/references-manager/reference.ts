import { SubstanceReference } from '../../substance/substance.model';
import { FormControl, Validators } from '@angular/forms';
import { serializable, isSerializable } from '../../utils/serialize.decorator';

export class Reference implements SubstanceReference {
    @serializable()
    uuid?: string;
    @serializable()
    created?: number;
    @serializable()
    createdBy?: string;
    @serializable()
    lastEdited?: number;
    @serializable()
    lastEditedBy?: string;
    @serializable()
    deprecated?: boolean;
    @serializable()
    access?: Array<string>;
    @serializable()
    id?: string;
    @serializable()
    citation?: string;
    @serializable()
    docType?: string;
    @serializable()
    publicDomain?: boolean;
    @serializable()
    tags?: Array<string>;
    @serializable()
    url?: string;
    @serializable()
    _self?: string;
    @serializable()
    documentDate?: number;

    documentTypeControl: FormControl;

    constructor(substanceReference?: SubstanceReference) {
        if (substanceReference != null) {
            Object.keys(substanceReference).forEach(key => {
                this[key] = substanceReference[key];
            });
        }

        this.documentTypeControl = new FormControl(this.docType, [Validators.required]);
    }

    getSerializableObject(): SubstanceReference {
        const substanceReference: SubstanceReference = {};

        Object.keys(this).forEach(key => {
            if (isSerializable(this, key)) {
                substanceReference[key] = this[key];
            }
        });

        return substanceReference;
    }
}
