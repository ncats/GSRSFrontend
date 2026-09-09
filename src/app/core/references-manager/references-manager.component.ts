import { ChangeDetectionStrategy, Component, OnInit, OnChanges, Input, SimpleChanges } from "@angular/core";
import {
  SubstanceDetail,
  SubstanceReference,
} from "../substance/substance.model";
import { SubstanceService } from "../substance/substance.service";
import { DatePipe } from "@angular/common";
import { take } from "rxjs/operators";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TrackLinkEventDirective } from "@gsrs-core/google-analytics/track-link-event/track-link-event.directive";

@Component({
  selector: "app-references-manager",
  templateUrl: "./references-manager.component.html",
  styleUrls: ["./references-manager.component.scss"],
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatTooltipModule, TrackLinkEventDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesManagerComponent implements OnInit, OnChanges {
  @Input() substance?: SubstanceDetail;
  @Input() subUUID?: string;
  @Input() references: Array<String>;
  subRef: Array<SubstanceReference>;
  matchedRef: SubstanceReference[] = [];
  showmore = false;
  displayedColumns: string[] = [
    "index",
    "citation",
    "docType",
    "tags",
    "files",
    "lastEdited",
    "access",
  ];

  constructor(private substanceService: SubstanceService) {}

  ngOnChanges(_changes: SimpleChanges) {
    if (this.substance && this.references) {
      this.subRef = this.substance.references;
      this.compileReferences();
    }
  }

  ngOnInit() {
    if (this.substance) {
      this.subRef = this.substance.references;
      this.compileReferences();
    } else if (this.subUUID) {
      const subscription = this.substanceService
        .getSubstanceDetails(this.subUUID)
        .pipe(take(1))
        .subscribe(
          (response) => {
            if (response) {
              this.substance = response;
              this.subRef = this.substance.references;
              this.compileReferences();
            }
            subscription.unsubscribe();
          },
          (error) => {
            subscription.unsubscribe();
          },
        );
    }
  }

  compileReferences() {
    if (this.substance.references && this.references) {
      this.matchedRef = this.substance.references.filter((ref) =>
        this.references.indexOf(ref.uuid) > -1
      );
    }
  }

  convertTimestamp(time: number) {
    const datePipe = new DatePipe("en-US");
    return datePipe.transform(time, "MMM dd, yyyy");
  }

  getParentIndex(uuid: SubstanceReference) {
    return this.subRef.indexOf(uuid) + 1;
  }
}
