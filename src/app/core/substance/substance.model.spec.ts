import { isPairedLinkageType } from './substance.model';

describe('isPairedLinkageType', () => {
  it('returns true for Cys-linker-Cys', () => {
    expect(isPairedLinkageType('Cys-linker-Cys')).toBe(true);
  });

  it('returns true for other X-linker-Y types', () => {
    expect(isPairedLinkageType('Cys-linker-Lys')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isPairedLinkageType('CYS-LINKER-CYS')).toBe(true);
  });

  it('returns false for non-linker types', () => {
    expect(isPairedLinkageType('Disulfide')).toBe(false);
  });

  it('returns false for null/undefined/empty', () => {
    expect(isPairedLinkageType(null)).toBe(false);
    expect(isPairedLinkageType(undefined)).toBe(false);
    expect(isPairedLinkageType('')).toBe(false);
  });
});
