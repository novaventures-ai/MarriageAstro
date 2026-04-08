
/**
 * Generates a consistent, normalized key for a report pairing.
 * Used for report-specific granular access control.
 */
export function calculateReportKey(
  nameA: string, 
  dobA: string, 
  nameB: string, 
  dobB: string
): string {
  const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const keyA = `${norm(nameA)}_${norm(dobA)}`;
  const keyB = `${norm(nameB)}_${norm(dobB)}`;
  
  // Sort alphabetically so that A+B and B+A result in the same key
  return [keyA, keyB].sort().join('__');
}
