import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Subject, Observable } from 'rxjs';

export class Substance {
    private apiBaseUrl: string;
    private properties: {
        [name: string]: {
            isLoading: boolean,
            value: any,
            subscription: Subject<any>
        }
    };

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private id: string
    ) {
        this.apiBaseUrl = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
        const url = `${this.apiBaseUrl}substances(${id})`;
        this.http.get<any>(url).subscribe(response => {
            console.log(response);
        });
    }

    // getProperty(name: string): Observable<any> {

    // }
}
