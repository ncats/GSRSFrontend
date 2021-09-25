import { CommandTypesDict, CommandDict } from '../queryable-substance-dictionary.model';
import { EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { QueryStatement } from './query-statement.model';


export const inputTypes = [
    'text',
    'datetime',
    'number',
    'select'
];

export const typeCommandOptions: CommandTypesDict = {
    string: {
        'ANY of the following words in any order or position': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const parts = queryValue.split(' ');
                        let query = parts.map(word => {
                            return lucenePath + word;
                        }).join(' OR ');
                        if (parts.length > 1) {
                            query = `(${query})`;
                        }
                        query = `${condition}${query}`;
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'ANY of the following words in any order or position',
                            commandInputValues: [queryValue],
                            query: query
                        });

                    }
                }
            ]
        },
        'the following exact phrase, which must match completely (no partial words)': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}"^${queryValue.trim()}$"` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'the following exact phrase, which must match completely (no partial words)',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        // 'the following contained phrase, which must be found as written (no partial words)': {
            'Exact Match': {
            commandInputs: [
                {
                    type: 'text',
                    example: 'Example: aspirin sodium',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}"^${queryValue.trim()}$"` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'Exact Match',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'ALL of the following words in any order or position': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const parts = queryValue.split(' ');
                        let query = parts.map(word => {
                            return lucenePath + word;
                        }).join(' AND ');
                        if (parts.length > 1) {
                            query = `(${query})`;
                        }
                        query = `${condition}${query}`;
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'ALL of the following words in any order or position',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        // 'a WORD that contains': {
            'Contains': {
            commandInputs: [
                {
                    type: 'text',
                    example: 'Example: sodium',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}*"${queryValue.trim()}"*` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'Contains',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
       // 'a WORD that starts with': {
            'Starts With': {
            commandInputs: [
                {
                    type: 'text',
                    example: 'Example: aspir',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}^${queryValue.trim()}*` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'Starts With',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'a value that starts with with the word(s)': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}"^${queryValue.trim()}"` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'a value that starts with with the word(s)',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'a WORD that ends with': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}*${queryValue.trim()}` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'a WORD that ends with',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'a value that ends with the word(s)': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}"${queryValue.trim()}$"` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'a value that ends with the word(s)',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'values that are not empty': {
            constructQuery: (
                queryValue: string,
                condition: string,
                queryableProperty: string,
                lucenePath: string,
                eventEmitter: EventEmitter<QueryStatement>
            ) => {
                const query = `${condition}${lucenePath}*`;
                eventEmitter.emit({
                    condition: condition,
                    queryableProperty: queryableProperty,
                    command: 'values that are not empty',
                    commandInputValues: [queryValue],
                    query: query
                });
            }
        },
        'the following exact default values': {
            commandInputs: [
                {
                    type: 'select',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue.trim() && `${condition}${lucenePath}"^${queryValue.trim()}$"` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'the following exact default values',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        }
    },
    timestamp: {
        'on': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        date: Date,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        let query = '';
                        if (date != null) {
                            const timestampStart = moment(date)
                                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();
                            const timestampEnd = moment(date)
                                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
                            query = `${condition}${lucenePath}[${timestampStart} TO ${timestampEnd}]`;
                        }
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'on',
                            commandInputValues: [date],
                            query: query
                        });
                    }
                }
            ]
        },
        'before': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        date: Date,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        let query = '';
                        if (date != null) {
                            const timestampEnd = moment(date)
                                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
                            query = `${condition}${lucenePath}[-10E50 TO ${timestampEnd}]`;
                        }
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'before',
                            commandInputValues: [date],
                            query: query
                        });
                    }
                }
            ]
        },
        'after': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        date: Date,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        let query = '';
                        if (date != null) {
                            const timestampStart = moment(date)
                                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();
                            query = `${condition}${lucenePath}[${timestampStart} TO 10E50]`;
                        }
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'after',
                            commandInputValues: [date],
                            query: query
                        });
                    }
                }
            ]
        },
        'between': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        date: Date,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>,
                        queryParts?: Array<string>,
                        commandInputValues?: Array<string | Date | number>
                    ) => {
                        let query = '';
                        if (date != null) {
                            const timestampStart = moment(date)
                                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();

                            queryParts[0] = `${condition}${lucenePath}[${timestampStart} TO `;
                            query = queryParts.join('');
                        }
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'between',
                            commandInputValues: [date, (commandInputValues && commandInputValues[1] || null)],
                            query: query,
                            queryParts: queryParts
                        });
                    }
                },
                {
                    type: 'datetime',
                    constructQuery: (
                        date: Date,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>,
                        queryParts?: Array<string>,
                        commandInputValues?: Array<string | Date | number>
                    ) => {
                        let query = '';
                        if (date != null) {
                            const timestampEnd = moment(date)
                                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
                            queryParts[1] = `${timestampEnd}]`;
                            query = queryParts.join('');
                        }
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'between',
                            commandInputValues: [(commandInputValues && commandInputValues[0] || null), date],
                            query: query,
                            queryParts: queryParts
                        });
                    }
                }
            ]
        }
    },
    boolean: {
        'true': {
            constructQuery: (
                commandValue: string,
                condition: string,
                queryableProperty: string,
                lucenePath: string,
                eventEmitter: EventEmitter<QueryStatement>
            ) => {
                const query = `${condition}${lucenePath}"^${commandValue}$"`;
                eventEmitter.emit({
                    condition: condition,
                    queryableProperty: queryableProperty,
                    command: 'true',
                    query: query
                });
            }
        },
        'false': {
            constructQuery: (
                commandValue: string,
                condition: string,
                queryableProperty: string,
                lucenePath: string,
                eventEmitter: EventEmitter<QueryStatement>
            ) => {
                const query = `${condition}${lucenePath}"^${commandValue}$"`;
                eventEmitter.emit({
                    condition: condition,
                    queryableProperty: queryableProperty,
                    command: 'false',
                    query: query
                });
            }
        }
    },
    number: {
        'exact number': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number | string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue != null && queryValue !== '' && `${condition}${lucenePath}${queryValue}` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'exact number',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'number that begins with': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number | string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue != null && queryValue !== '' && `${condition}${lucenePath}[${queryValue} TO 10E50]` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'number that begins with',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'number that ends with': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number | string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>
                    ) => {
                        const query = queryValue != null && queryValue !== '' && `${condition}${lucenePath}[-10E50 TO ${queryValue}]` || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'number that ends with',
                            commandInputValues: [queryValue],
                            query: query
                        });
                    }
                }
            ]
        },
        'between': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number | string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>,
                        queryParts?: Array<string>,
                        commandInputValues?: Array<string | Date | number>
                    ) => {
                        queryParts[0] = queryValue != null && queryValue !== '' && `${condition}${lucenePath}[${queryValue} TO ` || '';
                        const query = queryParts[0] && queryParts[1] && queryParts.join('') || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'between',
                            commandInputValues: [queryValue, (commandInputValues && commandInputValues[1] || null)],
                            query: query,
                            queryParts: queryParts
                        });
                    }
                },
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number | string,
                        condition: string,
                        queryableProperty: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<QueryStatement>,
                        queryParts?: Array<string>,
                        commandInputValues?: Array<string | Date | number>
                    ) => {
                        queryParts[1] = queryValue != null && queryValue !== '' && `${queryValue}]` || '';
                        const query = queryParts[0] && queryParts[1] && queryParts.join('') || '';
                        eventEmitter.emit({
                            condition: condition,
                            queryableProperty: queryableProperty,
                            command: 'between',
                            commandInputValues: [(commandInputValues && commandInputValues[0] || null), queryValue],
                            query: query,
                            queryParts: queryParts
                        });
                    }
                }
            ]
        },
        'values that are not empty': {
            constructQuery: (
                queryValue: string,
                condition: string,
                queryableProperty: string,
                lucenePath: string,
                eventEmitter: EventEmitter<QueryStatement>
            ) => {
                const query = `${condition}${lucenePath}*`;
                eventEmitter.emit({
                    condition: condition,
                    queryableProperty: queryableProperty,
                    command: 'values that are not empty',
                    commandInputValues: [queryValue],
                    query: query
                });
            }
        }
    }
};
