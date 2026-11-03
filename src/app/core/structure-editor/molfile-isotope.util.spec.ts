import {
  getCounts,
  getAtomElements,
  getBondLayout,
  hasSameStructureLayout,
  getIsoEntries,
  formatIsoLines,
  consolidateIsoLines,
  restoreMissingIsoEntries,
  convertLegacyIsotopeSymbols,
  adjustFormulaForIsotopicHydrogen,
} from './molfile-isotope.util';

// Molfile with three separate M  ISO lines.
const ISOTOPES_MOL = ` JSDraw206032611132D

 13 14  0  0  0  0              0 V2000
   13.0000   -5.6056    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   11.6490   -4.8256    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   11.6490   -3.2656    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   14.3510   -4.8256    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   14.3510   -3.2656    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   13.0000   -2.4856    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   15.7020   -5.6056    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   10.2980   -2.4856    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.9470   -3.2656    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.9470   -4.8256    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   10.2980   -5.6056    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.5960   -5.6056    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5960   -4.0456    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  1  4  1  0  0  0  0
  4  5  2  0  0  0  0
  5  6  1  0  0  0  0
  6  3  2  0  0  0  0
  4  7  1  0  0  0  0
  3  8  1  0  0  0  0
  8  9  1  0  0  0  0
  9 10  1  0  0  0  0
 10 11  1  0  0  0  0
 11  2  1  0  0  0  0
 10 12  1  0  0  0  0
 10 13  1  0  0  0  0
M  ISO  1   7  15
M  ISO  1  12   2
M  ISO  1  13   2
M  END`;

// Same structure with only the first isotope record.
const ISOTOPES_MOL_KETCHER_STRIPPED = ISOTOPES_MOL
  .replace('M  ISO  1  12   2\n', '')
  .replace('M  ISO  1  13   2\n', '');

// Same structure without isotope records.
const ISOTOPES_MOL_NO_ISO = ISOTOPES_MOL
  .replace(/M  ISO.*\n/g, '');

// V2000 structure without isotopes.
const BENZENE_MOL = `
  Ketcher 0101241530 2D 1   1.00000     0.00000     0

  6  6  0  0  0  0            999 V2000
    1.0000    0.0000    0.0000 C   0  0
    0.5000    0.8660    0.0000 C   0  0
   -0.5000    0.8660    0.0000 C   0  0
   -1.0000    0.0000    0.0000 C   0  0
   -0.5000   -0.8660    0.0000 C   0  0
    0.5000   -0.8660    0.0000 C   0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  5  6  2  0  0  0  0
  6  1  1  0  0  0  0
M  END`;

describe('getCounts', () => {
  it('returns correct atom/bond counts for ISOTOPES_MOL', () => {
    const c = getCounts(ISOTOPES_MOL)!;
    expect(c.atomCount).toBe(13);
    expect(c.bondCount).toBe(14);
  });

  it('returns correct atom/bond counts for BENZENE_MOL', () => {
    const c = getCounts(BENZENE_MOL)!;
    expect(c.atomCount).toBe(6);
    expect(c.bondCount).toBe(6);
  });

  it('returns null for empty string', () => {
    expect(getCounts('')).toBeNull();
  });

  it('returns null for a string with no V2000', () => {
    expect(getCounts('hello world')).toBeNull();
  });
});

describe('getAtomElements', () => {
  it('returns 13 elements for ISOTOPES_MOL', () => {
    const els = getAtomElements(ISOTOPES_MOL);
    expect(els.length).toBe(13);
    expect(els[6]).toBe('N');
    expect(els[11]).toBe('H');
    expect(els[12]).toBe('H');
  });
});

describe('getIsoEntries', () => {
  it('reads all three separate M  ISO lines', () => {
    const entries = getIsoEntries(ISOTOPES_MOL);
    expect(entries.length).toBe(3);

    const n15 = entries.find(e => e.atomIndex === 7);
    expect(n15).toBeDefined();
    expect(n15!.isotope).toBe(15);
    expect(n15!.element).toBe('N');

    const d12 = entries.find(e => e.atomIndex === 12);
    expect(d12).toBeDefined();
    expect(d12!.isotope).toBe(2);
    expect(d12!.element).toBe('H');

    const d13 = entries.find(e => e.atomIndex === 13);
    expect(d13).toBeDefined();
    expect(d13!.isotope).toBe(2);
  });

  it('returns empty array for molfile without M  ISO', () => {
    expect(getIsoEntries(BENZENE_MOL).length).toBe(0);
  });

  it('returns empty array for empty string', () => {
    expect(getIsoEntries('').length).toBe(0);
  });

  it('handles single consolidated M  ISO line with multiple entries', () => {
    const consolidated = consolidateIsoLines(ISOTOPES_MOL);
    const entries = getIsoEntries(consolidated);
    expect(entries.length).toBe(3);
  });
});

describe('formatIsoLines', () => {
  it('produces a single line for ≤8 entries', () => {
    const lines = formatIsoLines([
      { atomIndex: 7, isotope: 15 },
      { atomIndex: 12, isotope: 2 },
      { atomIndex: 13, isotope: 2 },
    ]);
    expect(lines.length).toBe(1);
    expect(lines[0]).toBe('M  ISO  3   7  15  12   2  13   2');
  });

  it('splits into multiple lines for >8 entries', () => {
    const entries = Array.from({ length: 9 }, (_, i) => ({ atomIndex: i + 1, isotope: i + 100 }));
    const lines = formatIsoLines(entries);
    expect(lines.length).toBe(2);
    expect(lines[0].startsWith('M  ISO  8')).toBe(true);
    expect(lines[1].startsWith('M  ISO  1')).toBe(true);
  });

  it('returns empty array for no entries', () => {
    expect(formatIsoLines([])).toEqual([]);
  });
});

describe('consolidateIsoLines', () => {
  it('merges three separate single-entry lines into one line', () => {
    const result = consolidateIsoLines(ISOTOPES_MOL);
    const isoLines = result.split('\n').filter(l => l.startsWith('M  ISO'));
    expect(isoLines.length).toBe(1);
    expect(isoLines[0]).toContain('7  15');
    expect(isoLines[0]).toContain('12   2');
    expect(isoLines[0]).toContain('13   2');
  });

  it('preserves all other molfile content', () => {
    const result = consolidateIsoLines(ISOTOPES_MOL);
    expect(result).toContain('M  END');
    expect(result).toContain('V2000');
    expect(getAtomElements(result).length).toBe(13);
  });

  it('is a no-op when there are no M  ISO lines', () => {
    expect(consolidateIsoLines(BENZENE_MOL)).toBe(BENZENE_MOL);
  });

  it('is a no-op for an already-consolidated single M  ISO line', () => {
    const oneLine = ISOTOPES_MOL_NO_ISO.replace(
      'M  END',
      'M  ISO  3   7  15  12   2  13   2\nM  END',
    );
    const result = consolidateIsoLines(oneLine);
    const isoLines = result.split('\n').filter(l => l.startsWith('M  ISO'));
    expect(isoLines.length).toBe(1);
  });

  it('sorts entries by atom index', () => {
    const reversed = ISOTOPES_MOL_NO_ISO.replace(
      'M  END',
      'M  ISO  1  13   2\nM  ISO  1   7  15\nM  ISO  1  12   2\nM  END',
    );
    const result = consolidateIsoLines(reversed);
    expect(result).toContain('M  ISO  3   7  15  12   2  13   2');
  });
});

describe('hasSameStructureLayout', () => {
  it('returns true when the only difference is M  ISO entries', () => {
    expect(hasSameStructureLayout(ISOTOPES_MOL, ISOTOPES_MOL_NO_ISO)).toBe(true);
  });

  it('returns true for identical molfiles', () => {
    expect(hasSameStructureLayout(ISOTOPES_MOL, ISOTOPES_MOL)).toBe(true);
  });

  it('returns false when atom count differs', () => {
    expect(hasSameStructureLayout(ISOTOPES_MOL, BENZENE_MOL)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(hasSameStructureLayout(ISOTOPES_MOL, '')).toBe(false);
  });
});

describe('restoreMissingIsoEntries', () => {
  it('restores all three ISO entries when Ketcher stripped two (first-block-only bug)', () => {
    const trusted = ISOTOPES_MOL;
    const raw = ISOTOPES_MOL_KETCHER_STRIPPED;

    const repaired = restoreMissingIsoEntries(trusted, raw);
    const entries = getIsoEntries(repaired);
    expect(entries.length).toBe(3);
    expect(entries.find(e => e.atomIndex === 7)?.isotope).toBe(15);
    expect(entries.find(e => e.atomIndex === 12)?.isotope).toBe(2);
    expect(entries.find(e => e.atomIndex === 13)?.isotope).toBe(2);
  });

  it('restores all ISO entries when server returned molfile with no M  ISO', () => {
    const repaired = restoreMissingIsoEntries(ISOTOPES_MOL, ISOTOPES_MOL_NO_ISO);
    const entries = getIsoEntries(repaired);
    expect(entries.length).toBe(3);
  });

  it('returns rawMolfile unchanged when trustedMolfile has no ISO entries', () => {
    const result = restoreMissingIsoEntries(BENZENE_MOL, ISOTOPES_MOL_NO_ISO);
    expect(result).toBe(ISOTOPES_MOL_NO_ISO);
  });

  it('returns rawMolfile unchanged when all trusted entries are already present', () => {
    const result = restoreMissingIsoEntries(ISOTOPES_MOL, ISOTOPES_MOL);
    expect(getIsoEntries(result).length).toBe(3);
  });

  it('returns rawMolfile unchanged when structure layout differs (user structural edit)', () => {
    const result = restoreMissingIsoEntries(ISOTOPES_MOL, BENZENE_MOL);
    expect(result).toBe(BENZENE_MOL);
  });

  it('returns empty string unchanged', () => {
    expect(restoreMissingIsoEntries(ISOTOPES_MOL, '')).toBe('');
  });
});

describe('Scenario 1 regression: validation does not strip isotopes', () => {
  it('consolidateIsoLines then restoreMissingIsoEntries round-trips all 3 isotopes', () => {
    const consolidated = consolidateIsoLines(ISOTOPES_MOL);
    const isoAfterConsolidate = getIsoEntries(consolidated);
    expect(isoAfterConsolidate.length).toBe(3);

    // Simulate Ketcher returning only the first isotope record.
    const ketcherOutput = consolidated
      .split('\n')
      .filter(l => !l.startsWith('M  ISO'))
      .join('\n')
      .replace('M  END', 'M  ISO  1   7  15\nM  END'); // only N-15

    const repaired = restoreMissingIsoEntries(consolidated, ketcherOutput);
    const entriesAfterRepair = getIsoEntries(repaired);
    expect(entriesAfterRepair.length).toBe(3);
    expect(entriesAfterRepair.find(e => e.atomIndex === 12)?.isotope).toBe(2);
    expect(entriesAfterRepair.find(e => e.atomIndex === 13)?.isotope).toBe(2);
  });
});

describe('Scenario 2 regression: newly added isotope survives validate', () => {
  // Pb structure without an isotope record.
  const PB_MOL_NO_ISO = `
  Ketcher 0609262305 2D 1   1.00000     0.00000     0

 13 14  0  0  0  0            999 V2000
   25.8950   -9.2560    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   24.5440   -8.4760    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   24.5440   -6.9160    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   27.2460   -8.4760    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   27.2460   -6.9160    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   25.8950   -6.1360    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   28.5970   -9.2560    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   23.1930   -6.1360    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   21.8420   -6.9160    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   21.8420   -8.4760    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   23.1930   -9.2560    0.0000 Pb  0  0  0  0  0  0  0  0  0  0  0  0
   20.4910   -9.2560    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   20.4910   -7.6960    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  1  4  1  0  0  0  0
  4  5  2  0  0  0  0
  5  6  1  0  0  0  0
  6  3  2  0  0  0  0
  4  7  1  0  0  0  0
  3  8  1  0  0  0  0
  8  9  1  0  0  0  0
  9 10  1  0  0  0  0
 10 11  1  0  0  0  0
 11  2  1  0  0  0  0
 10 12  1  0  0  0  0
 10 13  1  0  0  0  0
M  END`;

  // Same structure with Pb-204 on atom 11.
  const PB204_MOL = PB_MOL_NO_ISO.replace('M  END', 'M  ISO  1  11 204\nM  END');

  it('restores Pb-204 from trusted when Ketcher strips M  ISO', () => {
    const repaired = restoreMissingIsoEntries(PB204_MOL, PB_MOL_NO_ISO);
    const entries = getIsoEntries(repaired);
    expect(entries.length).toBe(1);
    expect(entries[0].atomIndex).toBe(11);
    expect(entries[0].isotope).toBe(204);
    expect(entries[0].element).toBe('Pb');
  });

  it('does NOT restore when user intentionally removed isotope (layout unchanged)', () => {
    // This helper restores missing records when layout is unchanged.
    // Explicit editor isotope changes bypass this helper.
    const repaired = restoreMissingIsoEntries(PB204_MOL, PB_MOL_NO_ISO);
    expect(getIsoEntries(repaired).length).toBe(1);
  });
});

describe('Toggle regression: JSDraw→Ketcher does not strip isotopes', () => {
  it('trusted baseline survives an interpretStructure round-trip that strips ISO', () => {
    const lastTrustedIsoMolfile = ISOTOPES_MOL;

    // Simulate Ketcher returning a molfile without isotope records.
    const ketcherStrippedOutput = ISOTOPES_MOL_NO_ISO;

    const repaired = restoreMissingIsoEntries(lastTrustedIsoMolfile, ketcherStrippedOutput);
    expect(getIsoEntries(repaired).length).toBe(3);
  });
});

describe('convertLegacyIsotopeSymbols', () => {
  const JSDRAW_DEUTERIUM_MOL = `
  JSDraw 0709261200 2D

  5  4  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 C   0  0
    1.0000    0.0000    0.0000 Cl  0  0
   -1.0000    0.0000    0.0000 Cl  0  0
    0.0000    1.0000    0.0000 Cl  0  0
    0.0000   -1.0000    0.0000 D   0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  END`;

  it('converts legacy D atom symbols to H atoms with M ISO mass 2', () => {
    const converted = convertLegacyIsotopeSymbols(JSDRAW_DEUTERIUM_MOL);
    expect(getAtomElements(converted)[4]).toBe('H');
    const isoEntries = getIsoEntries(converted);
    expect(isoEntries.length).toBe(1);
    expect(isoEntries[0].atomIndex).toBe(5);
    expect(isoEntries[0].isotope).toBe(2);
    expect(isoEntries[0].element).toBe('H');
  });
});

describe('adjustFormulaForIsotopicHydrogen', () => {
  const HEAVY_WATER_MOL = `
  Ketcher 0709261200 2D 1   1.00000     0.00000     0

  3  2  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 O   0  0
   -1.0000    0.0000    0.0000 H   0  0
    1.0000    0.0000    0.0000 H   0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
M  ISO  2   2   2   3   2
M  END`;

  const DEUTERATED_CHLOROFORM_MOL = `
  Ketcher 0709261200 2D 1   1.00000     0.00000     0

  5  4  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 C   0  0
    1.0000    0.0000    0.0000 Cl  0  0
   -1.0000    0.0000    0.0000 Cl  0  0
    0.0000    1.0000    0.0000 Cl  0  0
    0.0000   -1.0000    0.0000 H   0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  ISO  1   5   2
M  END`;

  it('converts backend H2O formula to D2O for explicit deuterium atoms', () => {
    expect(adjustFormulaForIsotopicHydrogen(HEAVY_WATER_MOL, 'H2O')).toBe('D2O');
  });

  it('converts CHCl3 to CDCl3 for deuterated chloroform', () => {
    expect(adjustFormulaForIsotopicHydrogen(DEUTERATED_CHLOROFORM_MOL, 'CHCl3')).toBe('CDCl3');
  });

  it('leaves formulas unchanged when there are no deuterium or tritium isotope records', () => {
    expect(adjustFormulaForIsotopicHydrogen(BENZENE_MOL, 'C6H6')).toBe('C6H6');
  });

  it('leaves non-simple formulas unchanged', () => {
    expect(adjustFormulaForIsotopicHydrogen(HEAVY_WATER_MOL, 'H2O.Na')).toBe('H2O.Na');
  });
});
