export function serializeDocument<T>(document: T): T {
  return JSON.parse(JSON.stringify(document)) as T;
}
