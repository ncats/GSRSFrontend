import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BatchStorageService, BatchSubstance } from "./batch-storage.service";
import { UtilsService } from "@gsrs-core/utils";
import { ConfigService } from "@gsrs-core/config";

describe("BatchStorageService", () => {
  let service: BatchStorageService;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    mockUtilsService = jasmine.createSpyObj("UtilsService", ["newUUID"]);
    mockUtilsService.newUUID.and.returnValue("test-uuid-12345");

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BatchStorageService,
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: ConfigService, useValue: { configData: {} } },
      ],
    });

    service = TestBed.inject(BatchStorageService);

    // Clear localStorage before each test
    Object.keys(localStorage)
      .filter((key) => key.startsWith("gsrs-batch-"))
      .forEach((key) => localStorage.removeItem(key));
  });

  afterEach(() => {
    // Clean up localStorage after tests
    Object.keys(localStorage)
      .filter((key) => key.startsWith("gsrs-batch-"))
      .forEach((key) => localStorage.removeItem(key));
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return empty batch list initially", () => {
    const items = service.getBatchList();
    expect(items.length).toBe(0);
  });

  it("should return batch count of 0 initially", () => {
    expect(service.getBatchCount()).toBe(0);
  });

  describe("saveToBatch", () => {
    it("should save substance to batch", () => {
      const substance: any = {
        substanceClass: "chemical",
        names: [{ name: "Test Substance", displayName: true }],
      };

      const result = service.saveToBatch(substance);
      expect(result.success).toBeTrue();
      expect(result.batchItem).toBeDefined();
      expect(result.batchItem?.name).toBe("Test Substance");
    });

    it("should generate UUID if not provided", () => {
      const substance: any = {
        substanceClass: "chemical",
        names: [{ name: "Test", displayName: true }],
      };

      const result = service.saveToBatch(substance);
      expect(result.success).toBeTrue();
      expect(result.batchItem?.uuid).toBe("test-uuid-12345");
    });

    it("should use existing UUID if provided", () => {
      const substance: any = {
        uuid: "existing-uuid",
        substanceClass: "chemical",
        names: [{ name: "Test", displayName: true }],
      };

      const result = service.saveToBatch(substance);
      expect(result.success).toBeTrue();
      expect(result.batchItem?.uuid).toBe("existing-uuid");
    });
  });

  describe("getBatchItemByUuid", () => {
    it("should return null for non-existent uuid", () => {
      const item = service.getBatchItemByUuid("non-existent");
      expect(item).toBeNull();
    });
  });

  describe("isInBatch", () => {
    it("should return false for non-existent uuid", () => {
      expect(service.isInBatch("non-existent")).toBeFalse();
    });
  });

  describe("clearBatch", () => {
    it("should clear all batch items", () => {
      // Add some items manually
      localStorage.setItem(
        "gsrs-batch-test1",
        JSON.stringify({ uuid: "test1" }),
      );
      localStorage.setItem(
        "gsrs-batch-test2",
        JSON.stringify({ uuid: "test2" }),
      );

      service.clearBatch();

      expect(service.getBatchCount()).toBe(0);
    });
  });
});
