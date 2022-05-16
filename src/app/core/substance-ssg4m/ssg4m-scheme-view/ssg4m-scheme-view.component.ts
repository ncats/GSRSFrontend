import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Environment } from 'src/environments/environment.model';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormSsg4mProcessService } from '../ssg4m-process/substance-form-ssg4m-process.service';
import { SubstanceDetail, SpecifiedSubstanceG4mProcess } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-scheme-view',
  templateUrl: './ssg4m-scheme-view.component.html',
  styleUrls: ['./ssg4m-scheme-view.component.scss']
})
export class Ssg4mSchemeViewComponent implements OnInit, OnDestroy {
  imageLoc: any;
  environment: Environment;
  substance: SubstanceDetail;
  processList: Array<SpecifiedSubstanceG4mProcess>;
  subscriptions: Array<Subscription> = [];

  constructor(
    private configService: ConfigService,
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService) { }

  ngOnInit(): void {
    const processSubscription = this.substanceFormSsg4mProcessService.specifiedSubstanceG4mProcess.subscribe(process => {
      this.processList = process;
    });
    // const subscription = this.substanceFormService.substance.subscribe(substance => {
    //  this.substance = JSON.stringify(substance);
    //   this.process = JSON.stringify(this.substance);
    //   alert("JSON: " + JSON.stringify(this.substance));
    //  });
    this.subscriptions.push(processSubscription);
    this.environment = this.configService.environment;
    this.imageLoc = `${this.environment.baseHref || ''}assets/images/home/arrow.png`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  editInForm() {
    
  }
}
