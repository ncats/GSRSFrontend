import { CommandTypesDict, CommandDict } from './queryable-substance-dictionary.model';
import { EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';


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
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const parts = queryValue.split(' ');
                        let query = parts.map(word => {
                            return lucenePath + word;
                        }).join(' OR ');
                        if (parts.length > 1) {
                            query = `(${query})`;
                        }
                        query = `${condition}${query}`;
                        eventEmitter.emit(query);
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
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"^${queryValue}$"`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'the following contained phrase, which must be found as written (no partial words)': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"${queryValue}"`;
                        eventEmitter.emit(query);
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
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const parts = queryValue.split(' ');
                        let query = parts.map(word => {
                            return lucenePath + word;
                        }).join(' AND ');
                        if (parts.length > 1) {
                            query = `(${query})`;
                        }
                        query = `${condition}${query}`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'for a WORD that contains': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"*${queryValue}*"`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'a WORD that starts with': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"${queryValue}*"`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'for a value that starts with with the word(s)': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"^${queryValue}"`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'for a WORD that ends with': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"*${queryValue}"`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'for a value that ends with the word(s)': {
            commandInputs: [
                {
                    type: 'text',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"${queryValue}$"`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'values that are not empty': {
            constructQuery: (
                queryValue: string,
                condition: string,
                lucenePath: string,
                eventEmitter: EventEmitter<string>
            ) => {
                const query = `${condition}${lucenePath}*`;
                eventEmitter.emit(query);
            }
        },
        'the following exact default values': {
            commandInputs: [
                {
                    type: 'select',
                    constructQuery: (
                        queryValue: string,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}"^${queryValue}$"`;
                        eventEmitter.emit(query);
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
                        datepickerEvent: MatDatepickerInputEvent<Date>,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const timestampStart = moment(datepickerEvent.value)
                            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();
                        const timestampEnd = moment(datepickerEvent.value)
                            .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
                        const query = `${condition}${lucenePath}[${timestampStart} TO ${timestampEnd}]`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'before': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        datepickerEvent: MatDatepickerInputEvent<Date>,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const timestampEnd = moment(datepickerEvent.value)
                            .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
                        const query = `${condition}${lucenePath}[-10E50 TO ${timestampEnd}]`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'after': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        datepickerEvent: MatDatepickerInputEvent<Date>,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const timestampStart = moment(datepickerEvent.value)
                            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();
                        const query = `${condition}${lucenePath}[${timestampStart} TO 10E50]`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'between': {
            commandInputs: [
                {
                    type: 'datetime',
                    constructQuery: (
                        datepickerEvent: MatDatepickerInputEvent<Date>,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>,
                        queryParts?: Array<string>
                    ) => {
                        const timestampStart = moment(datepickerEvent.value)
                            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();

                        queryParts[0] = `${condition}${lucenePath}[${timestampStart} TO `;
                        const query = queryParts.join('');
                        eventEmitter.emit(query);
                    }
                },
                {
                    type: 'datetime',
                    constructQuery: (
                        datepickerEvent: MatDatepickerInputEvent<Date>,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>,
                        queryParts?: Array<string>
                    ) => {
                        const timestampEnd = moment(datepickerEvent.value)
                            .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
                        queryParts[1] = `${timestampEnd}]`;
                        const query = queryParts.join('');
                        eventEmitter.emit(query);
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
                lucenePath: string,
                eventEmitter: EventEmitter<string>
            ) => {
                const query = `${condition}${lucenePath}"^${commandValue}$"`;
                eventEmitter.emit(query);
            }
        },
        'false': {
            constructQuery: (
                commandValue: string,
                condition: string,
                lucenePath: string,
                eventEmitter: EventEmitter<string>
            ) => {
                const query = `${condition}${lucenePath}"^${commandValue}$"`;
                eventEmitter.emit(query);
            }
        }
    },
    number: {
        'exact number': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}${queryValue}`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'number that begins with': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}[${queryValue} TO 10E50]`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'number that ends with': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>
                    ) => {
                        const query = `${condition}${lucenePath}[-10E50 TO ${queryValue}]`;
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'between': {
            commandInputs: [
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>,
                        queryParts?: Array<string>
                    ) => {
                        queryParts[0] = `${condition}${lucenePath}[${queryValue} TO `;
                        const query = queryParts.join('');
                        eventEmitter.emit(query);
                    }
                },
                {
                    type: 'number',
                    constructQuery: (
                        queryValue: number,
                        condition: string,
                        lucenePath: string,
                        eventEmitter: EventEmitter<string>,
                        queryParts?: Array<string>
                    ) => {
                        queryParts[1] = `${queryValue}]`;
                        const query = queryParts.join('');
                        eventEmitter.emit(query);
                    }
                }
            ]
        },
        'values that are not empty': {
            constructQuery: (
                queryValue: string,
                condition: string,
                lucenePath: string,
                eventEmitter: EventEmitter<string>
            ) => {
                const query = `${condition}${lucenePath}*`;
                eventEmitter.emit(query);
            }
        }
    }
};
