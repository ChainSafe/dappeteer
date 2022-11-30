export async function retry<R>(
  fn: () => Promise<R>,
  count: number
): Promise<R> {
  let error;
  for (let i = 0; i < count; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      error = e;
    }
  }
  throw error;
}
