import { SubstanceSuggestion } from './substance-suggestion.model';

export interface SubstanceSuggestionsGroup {
    [field: string]: Array<SubstanceSuggestion>;
}