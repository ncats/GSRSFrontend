/**
 * Object used to provide search suggestions
 */
export interface SubstanceSuggestion {
    /**
     * String that is displayed to user as suggestion and
     * is sent to API as search query parameter
     */
    key: string;
    /**
     * Substring of the key that can be highlighted so user
     * can see the value he/she typed in
     */
    highlight: string;
    weight: number;
}
