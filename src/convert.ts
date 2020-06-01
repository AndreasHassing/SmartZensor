export class Convert {
  public static gravity2Volume(
    sensorData: tizen.sensorservice.SensorGravityData
  ): number {
    const minVolume = 0;
    const maxVolume = 20;
    const cap = (num: number) => Math.min(Math.max(num, minVolume), maxVolume);

    const z = sensorData.z;

    return Math.round(cap(1.02041 * z + 10));
  }
}
