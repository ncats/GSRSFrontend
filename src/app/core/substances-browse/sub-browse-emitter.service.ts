import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SubBrowseEmitterService {

    public refresh: EventEmitter<boolean> = new EventEmitter();
    public cancel: EventEmitter<boolean> = new EventEmitter();

    public setRefresh(value) {
        console.log('setting refresh as ', value);
        this.refresh.emit(value)
    }

    public setCancel(value) {
        console.log('setting cancel as ', value);
        this.cancel.emit(value)
    }

}