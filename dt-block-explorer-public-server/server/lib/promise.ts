export function handle<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null] | (T | null)[]> {
  return promise
    .then(data => [data, null])
    .catch((error: Error) => Promise.resolve([null, error]));
}
