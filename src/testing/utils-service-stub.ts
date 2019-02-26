export class UtilsServiceStub {

    constructor() {}

    getSafeStructureImgUrl = jasmine.createSpy('getSafeStructureImgUrl')
        .and.returnValue('/assets/images/noimage.svg');

    handleMatSidenavOpen = jasmine.createSpy('handleMatSidenavOpen');

    handleMatSidenavClose = jasmine.createSpy('handleMatSidenavClose');

    hashCode = jasmine.createSpy('hashCode').and.returnValue(11111);
}
