import { Injectable } from '@angular/core';
import { SubstanceFormModule } from '../substance-form.module';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { StructuralUnit } from '@gsrs-core/substance/structural-unit.model';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: SubstanceFormModule
})
export class SubstanceFormStructuralUnitsService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<StructuralUnit>();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.polymer != null) {
        if (this.substance.polymer.structuralUnits == null) {
          this.substance.polymer.structuralUnits = [];
        } else {
          this.setSRUConnectivityDisplay(this.substance.polymer.structuralUnits);
        }
        substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.polymer.structuralUnits);
      }
    });
    this.subscriptions.push(subscription);
  }

  get substanceSRUs(): Observable<Array<StructuralUnit>> {
    return this.propertyEmitter.asObservable();
  }

  deleteSubstanceSRU(unit: StructuralUnit): void {
    const subNameIndex = this.substance.polymer.structuralUnits.findIndex(subName => unit.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.polymer.structuralUnits.splice(subNameIndex, 1);
      this.propertyEmitter.next(this.substance.polymer.structuralUnits);
    }
  }

  updateSRUs(SRUs: Array<StructuralUnit>): void {
    this.setSRUConnectivityDisplay(SRUs);
    this.substance.polymer.structuralUnits = SRUs;
    this.propertyEmitter.next(this.substance.polymer.structuralUnits);
  }

  private setSRUConnectivityDisplay(srus: any) {
    const rmap = this.getAttachmentMapUnits(srus);
    // tslint:disable-next-line:forin
    for (const i in srus) {
      const disp = this.sruConnectivityToDisplay(srus[i].attachmentMap, rmap);
      srus[i]._displayConnectivity = disp;
    }
  }

  private getAttachmentMapUnits(srus: any) {
    const rmap = {};
    // tslint:disable-next-line:forin
    for (const i in srus) {
      let lab = srus[i].label;
      if (!lab) {
        lab = '{' + i + '}';
      }
      for (const k in srus[i].attachmentMap) {
        if (srus[i].attachmentMap.hasOwnProperty(k)) {
          rmap[k] = lab;
        }
      }
    }
    return rmap;
  }

  private sruConnectivityToDisplay(amap: any, rmap: any) {
    let disp = '';
    for (const k in amap) {
      if (amap.hasOwnProperty(k)) {
        const start = rmap[k] + '_' + k;
        // tslint:disable-next-line:forin
        for (const i in amap[k]) {
          const end = rmap[amap[k][i]] + '_' + amap[k][i];
          disp += start + '-' + end + ';\n';
        }
      }
    }
    if (disp === '') { return undefined; }
    return disp;
  }

  // This function not being used anywhere. Consider removing
  private sruDisplayToConnectivity(display: any) {
    if (!display) {
      return {};
    }
    const errors = [];
    const connections = display.split(';');
    const regex = /^\s*[A-Za-z][A-Za-z]*[0-9]*_(R[0-9][0-9]*)[-][A-Za-z][A-Za-z]*[0-9]*_(R[0-9][0-9]*)\s*$/g;
    const map = {};
    for (let i = 0; i < connections.length; i++) {
      const con = connections[i].trim();
      if (con === '') { continue; }
      regex.lastIndex = 0;
      const res = regex.exec(con);
      if (res == null) {
        const text = 'Connection \'' + con + '\' is not properly formatted';
        errors.push({
          text: text,
          type: 'warning'
        });
      } else {
        if (!map[res[1]]) {
          map[res[1]] = [];
        }
        map[res[1]].push(res[2]);
      }
    }
    if (errors.length > 0) {
      // map.$errors = errors;
    }
    return map;
  }
}
