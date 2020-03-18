import { Facet } from './facet.model';

/**
 * API response object for list calls that have paging
 */
export interface PagingResponse<T> {
    id: number;
    version: number;
    created: number;
    etag: string;
    path: string;
    uri: string;
    nextPageUri: string;
    method: string;
    sha1: string;
    total: number;
    count: number;
    skip: number;
    top: number;
    query: string;
    sideway?: Array<any>;
    narrowSearchSuggestions?: Array<NarrowSearchSuggestion>;
    content: Array<T>;
    exactMatches?: Array<T>;
    facets?: Array<Facet>;
    filter?: string;
}

export interface NarrowSearchSuggestion {
    matchType: string;
    count: number;
    displayField: string;
    luceneField: string;
    luceneQuery: string;
}

export interface MatchContext {
  atomMaps?: Array<number>;
  similarity?: number;
  alignments?: Array<Alignment>;
}

export interface Alignment {
  alignment?: string;
  global?: number;
  iden?: number;
  query?: string;
  score?: 1;
  sub?: 1;
  target?: string;
  alignments?: Array<Alignment>;
}
