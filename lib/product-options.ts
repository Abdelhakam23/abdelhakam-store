export type ProductAttribute = { name: string; values: string[] };

export function normalizeProductAttributes(attributes: unknown): ProductAttribute[] {
  if (!Array.isArray(attributes)) return [];

  return attributes.reduce<ProductAttribute[]>((result, attribute) => {
    if (!attribute || typeof attribute !== "object") return result;
    const rawName = "name" in attribute ? attribute.name : undefined;
    const rawValues = "values" in attribute ? attribute.values : undefined;
    if (typeof rawName !== "string" || !Array.isArray(rawValues)) return result;

    const name = rawName.trim();
    const values = [...new Set(rawValues.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean))];
    if (!name || values.length === 0) return result;
    result.push({ name, values });
    return result;
  }, []);
}

export function isDisplayOnlyProductAttribute(attribute: ProductAttribute) {
  return attribute.name.trim().toLowerCase() === "material";
}

export function getSelectableProductAttributes(attributes: unknown) {
  return normalizeProductAttributes(attributes).filter(
    (attribute) => !isDisplayOnlyProductAttribute(attribute),
  );
}
