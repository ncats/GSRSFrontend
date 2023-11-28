import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface AdvancedQueryStatement {
  condition?: string;
  queryableProperty?: string;
  command?: string;
  commandInputValues?: Array<string | Date | number>;
  query?: string;
  queryParts?: Array<string>;
  queryHash?: number;
}
