import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface QueryStatement {
    condition?: string;
    queryableProperty?: string;
    command?: string;
    commandInputValues?: Array<string | Date | number>;
    query?: string;
    queryParts?: Array<string>;
    queryHash?: number;
}
