// Helpers for reading and preserving V2000 M  ISO records.

export interface MolfileIsoEntry {
  atomIndex: number; // 1-based atom index as used in the molfile
  isotope:   number; // absolute mass number
  element:   string; // element symbol from the atom block
}

export interface MolfileCounts {
  lineIndex:  number; // 0-based index of the counts line in the split-line array
  atomCount:  number;
  bondCount:  number;
}

export function getCounts(molfile: string): MolfileCounts | null {
  if (!molfile) { return null; }

  const lines     = molfile.split('\n');
  const lineIndex = lines.findIndex(l => l.includes('V2000'));
  if (lineIndex === -1) { return null; }

  const parts     = lines[lineIndex].trim().split(/\s+/);
  const atomCount = parseInt(parts[0], 10);
  const bondCount = parseInt(parts[1], 10);
  if (isNaN(atomCount) || isNaN(bondCount) || atomCount <= 0 || bondCount < 0) {
    return null;
  }
  return { lineIndex, atomCount, bondCount };
}

export function getAtomElements(molfile: string): string[] {
  const counts = getCounts(molfile);
  if (!counts) { return []; }

  return molfile.split('\n')
    .slice(counts.lineIndex + 1, counts.lineIndex + 1 + counts.atomCount)
    .map(line => line.trim().split(/\s+/)[3])
    .filter(Boolean);
}

export function getBondLayout(molfile: string): string[] {
  const counts = getCounts(molfile);
  if (!counts) { return []; }

  return molfile.split('\n')
    .slice(
      counts.lineIndex + 1 + counts.atomCount,
      counts.lineIndex + 1 + counts.atomCount + counts.bondCount,
    )
    .map(line => {
      const p = line.trim().split(/\s+/);
      const a = parseInt(p[0], 10);
      const b = parseInt(p[1], 10);
      return `${Math.min(a, b)}-${Math.max(a, b)}-${p[2]}`;
    })
    .sort();
}

/** Checks atom order and bond topology without comparing isotope properties. */
export function hasSameStructureLayout(trusted: string, incoming: string): boolean {
  const te = getAtomElements(trusted);
  const ie = getAtomElements(incoming);
  if (te.length === 0 || te.length !== ie.length) { return false; }
  if (!te.every((el, i) => el === ie[i])) { return false; }

  const tb = getBondLayout(trusted);
  const ib = getBondLayout(incoming);
  return tb.length === ib.length && tb.every((b, i) => b === ib[i]);
}

/** Reads isotope entries from all M  ISO lines. */
export function getIsoEntries(molfile: string): MolfileIsoEntry[] {
  if (!molfile) { return []; }

  const atomElements = getAtomElements(molfile);
  const entries: MolfileIsoEntry[] = [];

  for (const line of molfile.split('\n')) {
    if (!line.startsWith('M  ISO')) { continue; }

    const parts = line.trim().split(/\s+/);
    const count = parseInt(parts[2], 10);
    if (isNaN(count)) { continue; }

    for (let i = 0; i < count; i++) {
      const atomIndex = parseInt(parts[3 + i * 2], 10);
      const isotope   = parseInt(parts[4 + i * 2], 10);
      const element   = atomElements[atomIndex - 1];
      if (!isNaN(atomIndex) && !isNaN(isotope) && element) {
        entries.push({ atomIndex, isotope, element });
      }
    }
  }

  return entries;
}

export function formatIsoLines(entries: Array<{ atomIndex: number; isotope: number }>): string[] {
  const lines: string[] = [];
  for (let i = 0; i < entries.length; i += 8) {
    const chunk = entries.slice(i, i + 8);
    let line = `M  ISO${String(chunk.length).padStart(3)}`;
    for (const e of chunk) {
      line += `${String(e.atomIndex).padStart(4)}${String(e.isotope).padStart(4)}`;
    }
    lines.push(line);
  }
  return lines;
}

export function addIsoLines(
  linesWithoutIso: string[],
  entries: Array<{ atomIndex: number; isotope: number }>,
): string {
  if (entries.length === 0) { return linesWithoutIso.join('\n'); }
  const isoLines = formatIsoLines(entries);
  const endIdx   = linesWithoutIso.findIndex(l => l.startsWith('M  END'));
  const result   = [...linesWithoutIso];
  result.splice(endIdx === -1 ? result.length : endIdx, 0, ...isoLines);
  return result.join('\n');
}

/** Combines M  ISO entries into blocks of up to eight atom/isotope pairs. */
export function consolidateIsoLines(molfile: string): string {
  if (!molfile || !molfile.includes('M  ISO')) { return molfile; }

  const entries: Array<{ atomIndex: number; isotope: number }> = [];
  const filteredLines: string[] = [];

  for (const line of molfile.split('\n')) {
    if (line.startsWith('M  ISO')) {
      const parts = line.trim().split(/\s+/);
      const count = parseInt(parts[2], 10);
      if (isNaN(count)) { continue; }
      for (let i = 0; i < count; i++) {
        const atomIndex = parseInt(parts[3 + i * 2], 10);
        const isotope   = parseInt(parts[4 + i * 2], 10);
        if (!isNaN(atomIndex) && !isNaN(isotope)) {
          entries.push({ atomIndex, isotope });
        }
      }
    } else {
      filteredLines.push(line);
    }
  }

  if (entries.length === 0) { return molfile; }
  // Keep output stable for comparisons and tests.
  entries.sort((a, b) => a.atomIndex - b.atomIndex);
  return addIsoLines(filteredLines, entries);
}

// Fixed column offsets of the atom symbol field in a V2000 atom line.
const ATOM_SYMBOL_START = 31;
const ATOM_SYMBOL_LEN   = 3;

// Legacy MDL shorthand atom symbols for hydrogen isotopes and their mass numbers.
const LEGACY_ISOTOPE_MASS: Record<string, number> = { D: 2, T: 3 };

// JSDraw may serialize deuterium/tritium as D/T atom symbols.
// Normalize to H + M ISO so isotope data survives editor/server round-trips.
export function convertLegacyIsotopeSymbols(molfile: string): string {
  const counts = getCounts(molfile);
  if (!counts) { return molfile; }

  const lines = molfile.split('\n');
  const newEntries: Array<{ atomIndex: number; isotope: number }> = [];

  for (let i = 0; i < counts.atomCount; i++) {
    const lineIdx = counts.lineIndex + 1 + i;
    const line = lines[lineIdx];
    if (line == null || line.length < ATOM_SYMBOL_START + ATOM_SYMBOL_LEN) { continue; }

    const symbol = line.substring(ATOM_SYMBOL_START, ATOM_SYMBOL_START + ATOM_SYMBOL_LEN).trim();
    const isotope = LEGACY_ISOTOPE_MASS[symbol];
    if (isotope == null) { continue; }

    lines[lineIdx] = line.substring(0, ATOM_SYMBOL_START) + 'H  '
      + line.substring(ATOM_SYMBOL_START + ATOM_SYMBOL_LEN);
    newEntries.push({ atomIndex: i + 1, isotope });
  }

  if (newEntries.length === 0) { return molfile; }

  const existingEntries = getIsoEntries(molfile)
    .filter(e => !newEntries.some(n => n.atomIndex === e.atomIndex));
  const withoutIso = lines.filter(l => !l.startsWith('M  ISO'));
  const combined   = [...existingEntries, ...newEntries].sort((a, b) => a.atomIndex - b.atomIndex);
  return addIsoLines(withoutIso, combined);
}

/**
 * Restores isotope entries missing from editor output.
 * A changed atom or bond layout is treated as a user edit and is not repaired.
 */
export function restoreMissingIsoEntries(trustedMolfile: string, rawMolfile: string): string {
  const trustedEntries = getIsoEntries(trustedMolfile);
  if (trustedEntries.length === 0) { return rawMolfile; }

  const rawEntries     = getIsoEntries(rawMolfile);
  const missingEntries = trustedEntries.filter(
    t => !rawEntries.some(r => r.atomIndex === t.atomIndex),
  );

  if (missingEntries.length === 0) { return rawMolfile; }
  if (!hasSameStructureLayout(trustedMolfile, rawMolfile)) { return rawMolfile; }

  // Add missing entries and normalize the ISO blocks.
  const withMissing = addIsoLines(
    rawMolfile.split('\n').filter(l => !l.startsWith('M  ISO')),
    [...rawEntries, ...missingEntries].sort((a, b) => a.atomIndex - b.atomIndex),
  );
  return withMissing;
}

export function adjustFormulaForIsotopicHydrogen(
  molfile: string | null | undefined,
  formula: string | null | undefined,
): string | null | undefined {
  if (!molfile || !formula) { return formula; }

  const isotopeCounts = getIsoEntries(molfile).reduce((counts, entry) => {
    if (entry.element === 'H' && (entry.isotope === 2 || entry.isotope === 3)) {
      counts[entry.isotope === 2 ? 'D' : 'T']++;
    }
    return counts;
  }, { D: 0, T: 0 });

  if (isotopeCounts.D === 0 && isotopeCounts.T === 0) { return formula; }

  const tokens = formula.match(/[A-Z][a-z]?\d*/g);
  if (!tokens || tokens.join('') !== formula) { return formula; }

  const parsed = tokens.map(token => {
    const match = token.match(/^([A-Z][a-z]?)(\d*)$/);
    return {
      element: match![1],
      count: match![2] ? parseInt(match![2], 10) : 1,
    };
  });

  const hydrogenIndex = parsed.findIndex(token => token.element === 'H');
  if (hydrogenIndex === -1) { return formula; }

  const hydrogen = parsed[hydrogenIndex];
  hydrogen.count = Math.max(0, hydrogen.count - isotopeCounts.D - isotopeCounts.T);

  const adjusted = parsed
    .filter(token => token.element !== 'H' || token.count > 0)
    .map(token => `${token.element}${token.count === 1 ? '' : token.count}`);

  // Insert D/T where the original H token appeared.
  const insertIndex = hydrogenIndex;
  const isotopeTokens = [
    isotopeCounts.D > 0 ? `D${isotopeCounts.D === 1 ? '' : isotopeCounts.D}` : '',
    isotopeCounts.T > 0 ? `T${isotopeCounts.T === 1 ? '' : isotopeCounts.T}` : '',
  ].filter(Boolean);

  adjusted.splice(insertIndex, 0, ...isotopeTokens);
  return adjusted.join('');
}
