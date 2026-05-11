export const formatStyleName = (name: string | null | undefined): string => {
  if (!name) return "—";
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
