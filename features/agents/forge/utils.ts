export function disabledReasonFor(
  frameName: string,
  label: string,
  count: number,
): string {
  return `${frameName} only supports ${label}${count !== 1 ? "s" : ""}.`;
}
