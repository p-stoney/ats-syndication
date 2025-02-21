export function capitalize(name: string) {
  if (!name) return '';
  return name[0].toUpperCase() + name.slice(1);
}
