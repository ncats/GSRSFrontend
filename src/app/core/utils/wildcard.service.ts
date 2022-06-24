import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WildcardService {

  wildCardObservable: Observable<any>;
  topSearchObservable: Observable<any>;
  private wildcardText = new Subject<any>();
  private topSearchBox = new Subject<any>();

  constructor() { 
    this.wildCardObservable = this.wildcardText.asObservable();
    this.topSearchObservable = this.topSearchBox.asObservable();
  }

  getWildCardText(data) {
    this.wildcardText.next(data);
  }

  getTopSearchBoxText(data) {
    this.topSearchBox.next(data);
  }

}
