import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BatchSelectorDialogComponent } from "./batch-selector-dialog.component";
import { BatchStorageService } from "../batch-storage.service";

describe("BatchSelectorDialogComponent", () => {
  let component: BatchSelectorDialogComponent;
  let fixture: ComponentFixture<BatchSelectorDialogComponent>;
  let mockBatchStorageService: jasmine.SpyObj<BatchStorageService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<BatchSelectorDialogComponent>>;

  beforeEach(async () => {
    mockBatchStorageService = jasmine.createSpyObj("BatchStorageService", [
      "getBatchList",
      "toSubstanceSummary",
    ]);
    mockBatchStorageService.getBatchList.and.returnValue([]);

    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["close"]);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
      ],
      declarations: [BatchSelectorDialogComponent],
      providers: [
        { provide: BatchStorageService, useValue: mockBatchStorageService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load batch items on init", () => {
    expect(mockBatchStorageService.getBatchList).toHaveBeenCalled();
  });

  it("should filter items based on search term", () => {
    component.batchItems = [
      {
        key: "1",
        uuid: "uuid1",
        name: "Test Chemical",
        type: "chemical",
        date: Date.now(),
        isValidated: true,
        substance: {} as any,
      },
      {
        key: "2",
        uuid: "uuid2",
        name: "Protein Sample",
        type: "protein",
        date: Date.now(),
        isValidated: true,
        substance: {} as any,
      },
    ];
    component.filteredItems = [...component.batchItems];

    component.searchTerm = "chemical";
    component.filterItems();
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].name).toBe("Test Chemical");
  });

  it("should close dialog on cancel", () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it("should not confirm selection without selected item", () => {
    component.selectedItem = null;
    component.confirmSelection();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it("should get correct type labels", () => {
    expect(component.getTypeLabel("chemical")).toBe("Chemical");
    expect(component.getTypeLabel("mixture")).toBe("Mixture");
    expect(component.getTypeLabel("unknown")).toBe("unknown");
  });
});
