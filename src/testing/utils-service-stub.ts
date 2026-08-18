import { vi } from 'vitest';

export class UtilsServiceStub {
    private returnHash: number;

    getSafeStructureImgUrl = vi.fn().mockReturnValue('/assets/images/noimage.svg');

    handleMatSidenavOpen = vi.fn().mockReturnValue(null);

    handleMatSidenavClose = vi.fn().mockReturnValue(null);

    hashCode: ReturnType<typeof vi.fn>;

    constructor() {
        this.returnHash = Math.random();
        this.hashCode = vi.fn().mockReturnValue(this.returnHash);
    }

    setReturnHasCode(returnHash): void {
        this.returnHash = returnHash;
    }
}
