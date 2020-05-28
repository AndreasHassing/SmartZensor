export function SonosResponseCache() {}

SonosResponseCache.getOrAddPrimaryHouseholdId = function getOrAddPrimaryHouseholdId(
  asyncValueFactory
) {
  return getOrAdd("primaryHouseholdId", asyncValueFactory);
};

SonosResponseCache.getOrAddPrimarySpeakerId = function getOrAddPrimarySpeakerId(
  asyncValueFactory
) {
  return getOrAdd("primarySpeakerId", asyncValueFactory);
};

async function getOrAdd(key, asyncValueFactory) {
  key = `sonosCache_${key}`;

  if (tizen.preference.exists(key)) {
    return tizen.preference.getValue(key);
  }

  const value = await asyncValueFactory();

  tizen.preference.setValue(key, value);

  return value;
}
