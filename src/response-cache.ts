export class ResponseCache {
  public static async getOrAdd(
    key: string,
    asyncValueFactory: () => Promise<tizen.preference.PreferenceValueType>
  ) {
    const preferenceCacheKey = `_cache_${key}`;

    if (tizen.preference.exists(preferenceCacheKey)) {
      return tizen.preference.getValue(key);
    }

    const value = await asyncValueFactory();

    tizen.preference.setValue(preferenceCacheKey, value);

    return value;
  }
}
