import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoadingService } from '../loading/loading.service';
import { SubstanceSummary} from '../substance/substance.model';
import {PagingResponse} from '../utils/paging-response.model';
import {forkJoin} from 'rxjs';
import { ResolverResponse } from '../structure/structure-post-response.model';
import { SubstanceService } from '../substance/substance.service';
import { StructureService } from '../structure/structure.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-name-resolver',
  templateUrl: './name-resolver.component.html',
  styleUrls: ['./name-resolver.component.scss']
})
export class NameResolverComponent implements OnInit {
  resolverControl = new FormControl();
  resolved: string;
  errorMessage: string;
  resolvedNames: Array<ResolverResponse>;
  matchedNames: PagingResponse<SubstanceSummary>;
  @Output() structureSelected = new EventEmitter<string>();

  constructor(
    private loadingService: LoadingService,
    private substanceService: SubstanceService,
    private structureService: StructureService
  ) { }

  ngOnInit() {
  }

  resolveNameKey(event: any): void {
    if (event.keyCode === 13) {
      this.resolveName(this.resolverControl.value);
    }
  }

  resolveName(name: string): void {
    this.errorMessage = '';
    this.resolvedNames = [];
    this.matchedNames = null;
    this.loadingService.setLoading(true);
    const n = name.replace('"', '');
    const searchStr = 'root_names_name:"^${n}$" OR root_approvalID:"^${n}$" OR root_codes_BDNUM:"^${n}$"';
    forkJoin(this.substanceService.getSubstanceSummaries(searchStr),
      this.structureService.resolveName(name)).subscribe(([local, remote]) => {
        this.loadingService.setLoading(false);
        this.resolvedNames = remote;
        this.matchedNames = local;
        if (this.matchedNames.content.length === 0 && this.resolvedNames.length === 0) {
         this.errorMessage = 'no results found for \'' + name + '\'';
        }
      },
      error => {
        this.errorMessage = 'there was a problem returning your query';

        this.loadingService.setLoading(false);
      });
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.structureService.getSafeStructureImgUrl(structureId, size);
  }

  applyStructure(molfile: string) {
    this.structureSelected.emit(molfile);
  }

}
