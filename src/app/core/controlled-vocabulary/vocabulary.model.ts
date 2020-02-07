export interface Vocabulary {
    id: number;
    version: number;
    created: number;
    modified: number;
    deprecated: boolean;
    domain: string;
    vocabularyTermType: string;
    fields: Array<any>;
    terms: Array<VocabularyTerm>;
}

export interface VocabularyTerm {
    version?: number;
    created?: number;
    modified?: number;
    deprecated?: boolean;
    value: string;
    display: string;
    description?: string;
    origin?: string;
    filters?: Array<any>;
    hidden?: boolean;
    selected?: boolean;
    fragmentStructure?: string;
    simplifiedStructure?: string;
    systemCategory?: string;
}

export interface VocabularyDictionary {
    [domain: string]: {
        dictionary?: { [vocabularyValue: string]: VocabularyTerm },
        list?: Array<VocabularyTerm>
    };
}
