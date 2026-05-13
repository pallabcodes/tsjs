/**
 * ionFill: Consumes an Ion Protocol object and populates a target container.
 */
export function ionFill<T>(target: FormData, ionForm: Iterable<[string, any]>): FormData {
  for (const [key, value] of ionForm) {
    if (value !== undefined && value !== null) {
      target.append(key, value.toString());
    }
  }
  return target;
}

/**
 * ionFillAsync: The asynchronous version for non-blocking payload construction.
 */
export async function ionFillAsync<T>(
  target: FormData,
  ionForm: AsyncIterable<[string, any]>
): Promise<FormData> {
  // Consumes the Async Generator using for await...of
  for await (const [key, value] of ionForm) {
    if (value !== undefined && value !== null) {
      target.append(key, value.toString());
    }
  }
  return target;
}

/**
 * ionToJSONAsync: Asynchronous conversion to a plain record.
 */
export async function ionToJSONAsync<T>(
  ionForm: AsyncIterable<[string, any]>
): Promise<Record<string, any>> {
  const result: Record<string, any> = {};
  for await (const [key, value] of ionForm) {
    result[key] = value;
  }
  return result;
}
