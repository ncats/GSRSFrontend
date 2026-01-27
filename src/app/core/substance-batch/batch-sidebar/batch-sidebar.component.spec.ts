import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BatchSidebarComponent } from "./batch-sidebar.component";
import { BatchStorageService } from "../batch-storage.service";
import { of } from "rxjs";

describe("BatchSidebarComponent", () => {
  let component: BatchSidebarComponent;
  let fixture: ComponentFixture<BatchSidebarComponent>;
  let mockBatchStorageService: jasmine.SpyObj<BatchStorageService>;

  beforeEach(async () => {
    mockBatchStorageService = jasmine.createSpyObj(
      "BatchStorageService",
      ["toSubstanceSummary", "removeBatchItem", "clearBatch"],
      { batchSubstances$: of([]) },
    );

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
      ],
      declarations: [BatchSidebarComponent],
      providers: [
        { provide: BatchStorageService, useValue: mockBatchStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start closed by default", () => {
    expect(component.isOpen).toBeFalse();
  });

  it("should toggle open state", () => {
    expect(component.isOpen).toBeFalse();
    component.toggle();
    expect(component.isOpen).toBeTrue();
    component.toggle();
    expect(component.isOpen).toBeFalse();
  });

  it("should emit closed event when closing", () => {
    spyOn(component.closed, "emit");
    component.isOpen = true;
    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it("should return correct animation state", () => {
    component.isOpen = false;
    expect(component.animationState).toBe("out");
    component.isOpen = true;
    expect(component.animationState).toBe("in");
  });

  it("should get correct type labels", () => {
    expect(component.getTypeLabel("chemical")).toBe("Chemical");
    expect(component.getTypeLabel("protein")).toBe("Protein");
    expect(component.getTypeLabel("unknown")).toBe("unknown");
  });
});
