export const formatPct = (
  value: string | number | null | undefined,
): string => {
  if (value == null) return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `${(num * 100).toFixed(0)}%`;
};
