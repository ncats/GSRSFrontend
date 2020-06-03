import { EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';

export interface QueryableSubstanceDictionary {
    [displayName: string]: {
        lucenePath: string;
        description: string;
        type: string;
        cvDomain?: string;
    };
}

export interface CommandTypesDict {
    [commandType: string]: CommandDict;
}

export interface CommandDict {
    [command: string]: Command | CommandInput;
}

export interface Command {
    commandInputs?: Array<CommandInput>;
}

export interface CommandInput {
    type?: string;
    constructQuery?: (
        queryValue: string | MatDatepickerInputEvent<Date> | number,
        condition: string,
        lucenePath: string,
        eventEmitter: EventEmitter<string>,
        queryParts?: Array<string>
    ) => void;
}
