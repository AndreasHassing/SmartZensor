/**
 * Makeshift conversion of the types needed for this project
 * from WebIDL to TypeScript type definitions.
 *
 * WebIDL found in various locations in Tizen Docs, like:
 * https://docs.tizen.org/application/web/api/4.0/device_api/wearable/tizen/sensor.html#full-webidl
 */
declare namespace tizen {
  namespace application {
    interface IApplication {
      exit(): void;
    }

    function getCurrentApplication(): IApplication;
  }

  namespace keymanager {
    type KeyManagerAlias = {
      name: string;
    };

    function saveData(name: string, data: string, password?: string): void;
    function getData(dataAlias: KeyManagerAlias, password?: string): string;
  }

  namespace power {
    type PowerResource = "SCREEN" | "CPU";

    type PowerScreenState = "SCREEN_OFF" | "SCREEN_DIM" | "SCREEN_NORMAL";

    type PowerCpuState = "CPU_AWAKE";

    type PowerState = PowerScreenState | PowerCpuState;

    function request(resource: PowerResource, state: PowerState): void;
    function release(resource: PowerResource): void;
  }

  namespace preference {
    type PreferenceValueType = string | number | boolean;

    function getValue(key: string): PreferenceValueType;
    function setValue(key: string, value: PreferenceValueType): void;
    function exists(key: string): boolean;
  }

  namespace sensorservice {
    type SensorType =
      | "ACCELERATION"
      | "GRAVITY"
      | "GYROSCOPE"
      | "LINEAR_ACCELERATION";

    interface Sensor {
      start(
        successCallback: CallableFunction,
        errorCallback?: CallableFunction
      ): void;
      stop(): void;
    }

    interface SensorData {}

    interface SensorGravityData extends SensorData {
      readonly x: number;
      readonly y: number;
      readonly z: number;
    }

    interface GravitySensor extends Sensor {
      getGravitySensorData(
        successCallback: CallableFunction,
        errorCallback?: CallableFunction
      ): void;
    }

    function getDefaultSensor(sensorType: SensorType): Sensor;
  }

  namespace systeminfo {
    function getCapability(key: string): boolean;
  }
}
