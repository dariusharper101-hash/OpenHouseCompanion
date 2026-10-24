export function numericInput(value: string, max = 100_000_000): number | null {
  const clean = value.trim().replace(/,/g, "");
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(clean)) return null;
  const n = Number(clean);
  return Number.isFinite(n) && n >= 0 && n <= max ? n : null;
}
export function principalAndInterest(principal: number, annualRatePct: number, years: number): number {
  if (![principal, annualRatePct, years].every(Number.isFinite) || principal <= 0 || years <= 0 || annualRatePct < 0) return 0;
  const months = years * 12;
  const rate = annualRatePct / 1200;
  if (rate === 0) return principal / months;
  return principal * rate / (1 - Math.pow(1 + rate, -months));
}
