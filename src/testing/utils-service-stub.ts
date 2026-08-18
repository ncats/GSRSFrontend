import { vi } from 'vitest';

export class UtilsServiceStub {
    private returnHash: number;

    getSafeStructureImgUrl = vi.fn().mockReturnValue('/assets/images/noimage.svg');

    handleMatSidenavOpen = vi.fn().mockReturnValue(null);

    handleMatSidenavClose = vi.fn().mockReturnValue(null);

    hashCode: ReturnType<typeof vi.fn>;

    constructor() {
        this.returnHash = Math.random();
        // mockImplementation (not mockReturnValue) so setReturnHasCode() below actually
        // takes effect on later calls, instead of the return value being frozen at
        // whatever this.returnHash was when the mock was first created.
        this.hashCode = vi.fn().mockImplementation(() => this.returnHash);
    }

    setReturnHasCode(returnHash): void {
        this.returnHash = returnHash;
    }
}
