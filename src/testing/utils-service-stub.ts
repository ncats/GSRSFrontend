export class UtilsServiceStub {
    private returnHash: number;

    constructor() {
        this.returnHash = Math.random();
    }

    getSafeStructureImgUrl = jasmine.createSpy('getSafeStructureImgUrl')
        .and.returnValue('/assets/images/noimage.svg');

    handleMatSidenavOpen = jasmine.createSpy('handleMatSidenavOpen').and.returnValue(null);

    handleMatSidenavClose = jasmine.createSpy('handleMatSidenavClose').and.returnValue(null);

    hashCode = jasmine.createSpy('hashCode').and.returnValue(this.returnHash);

    setReturnHasCode(returnHash): void {
        this.returnHash = returnHash;
    }
}
