export function createLiteralSearchRegex(value: string) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
}

export function createProductSearchFilter(search: string) {
  const terms = search.trim().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return {};

  return {
    $and: terms.map((term) => {
      const regex = createLiteralSearchRegex(term);
      return {
        $or: [{ title: regex }, { description: regex }],
      };
    }),
  };
}
