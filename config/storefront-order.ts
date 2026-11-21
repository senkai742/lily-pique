const priorityTitles = [
  "Single Lily Bouquet",
  "Double Lily Bouquet",
  "Trio Pink Lily Bouquet",
  "Four pink Lily Bouquet",
];

const priorityByTitle = new Map(
  priorityTitles.map((title, index) => [title.toLowerCase(), index]),
);

export function orderStorefrontProducts<T extends { name: string }>(products: T[]): T[] {
  const priority = (name: string) =>
    priorityByTitle.get(name.trim().replace(/\s+/g, " ").toLowerCase()) ?? priorityTitles.length;

  // Stable sorting preserves the incoming order for unpinned products.
  return [...products].sort((a, b) => priority(a.name) - priority(b.name));
}
