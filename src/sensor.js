export function Sensor() {}

Sensor.gravity2Volume = function gravity2Volume(sensorData) {
  const minVolume = 0;
  const maxVolume = 20;
  const cap = (num) => Math.min(Math.max(num, minVolume), maxVolume);

  const z = sensorData.z;

  return Math.round(cap(1.02041 * z + 10));
};
