import { ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SubstanceReference, SubstanceDetail } from '../../substance/substance.model';
import { isSerializable, serializable } from '../../utils/serialize.decorator';
import { Observable, Subscriber, Subject } from 'rxjs';
import { ReferenceApplied } from './reference-applied';

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

    referenceChanges: Observable<SubstanceReference>;
    private referenceChangesSubscriber: Subscriber<SubstanceReference>;

    documentTypeControl: FormControl;
    citationControl: FormControl;
    publicDomainControl: FormControl;
    accessEmitter: Observable<Array<string>>;
    private accessSubscriber: Subscriber<Array<string>>;
    urlControl: FormControl;
    idControl: FormControl;
    tagsEmitter: Observable<Array<string>>;
    private tagsSubscriber: Subscriber<Array<string>>;

    referenceApplied: ReferenceApplied;

    private substanceUpdatedSubject = new Subject<SubstanceDetail>();

    @ViewChild('fruitInput', {read: false}) fruitInput: ElementRef<HTMLInputElement>;

    constructor(substance: SubstanceDetail, substanceReference?: SubstanceReference) {

        if (substanceReference != null) {
            Object.keys(substanceReference).forEach(key => {
                this[key] = substanceReference[key];
            });
        }

        this.referenceChanges = new Observable(observer => {
            this.referenceChangesSubscriber = observer;
        });

        this.documentTypeControl = new FormControl(this.docType, [Validators.required]);
        this.documentTypeControl.valueChanges.subscribe(value => {
            this.docType = value;
            this.referenceChangesSubscriber.next(this.toSerializableObject());
        });

        this.citationControl = new FormControl(this.citation, [Validators.required]);
        this.citationControl.valueChanges.subscribe(value => {
            this.citation = value;
            this.referenceChangesSubscriber.next(this.toSerializableObject());
        });

        this.publicDomainControl = new FormControl(this.publicDomain);
        this.publicDomainControl.valueChanges.subscribe(value => {
            this.publicDomain = value;
            this.referenceChangesSubscriber.next(this.toSerializableObject());
        });

        this.accessEmitter = new Observable(observer => {
            this.accessSubscriber = observer;
        });

        this.urlControl = new FormControl(this.url);
        this.urlControl.valueChanges.subscribe(value => {
            this.url = value;
            this.referenceChangesSubscriber.next(this.toSerializableObject());
        });

        this.idControl = new FormControl(this.id);
        this.idControl.valueChanges.subscribe(value => {
            this.id = value;
            this.referenceChangesSubscriber.next(this.toSerializableObject());
        });

        this.tagsEmitter = new Observable(observer => {
            this.tagsSubscriber = observer;
        });

        this.referenceApplied = new ReferenceApplied(this.uuid, substance);
        this.referenceApplied.substanceUpdated().subscribe(substanceUpdated => {
            this.substanceUpdatedSubject.next(substanceUpdated);
        });
    }

    toSerializableObject(): SubstanceReference {
        const substanceReference: SubstanceReference = {};

        Object.keys(this).forEach(key => {
            if (isSerializable(this, key)) {
                substanceReference[key] = this[key];
            }
        });

        return substanceReference;
    }

    updateAccess(access: Array<string>): void {
        this.access = access;
        this.referenceChangesSubscriber.next(this.toSerializableObject());
    }

    updateTags(tags: Array<string>): void {
        this.tags = tags;
        this.referenceChangesSubscriber.next(this.toSerializableObject());
    }

    emitReferenceAccess(): void {
        this.accessSubscriber.next(this.access);
    }

    emitReferenceTags(): void {
        this.tagsSubscriber.next(this.tags);
    }

    substanceUpdated(): Observable<SubstanceDetail> {
        return this.substanceUpdatedSubject.asObservable();
    }
}
