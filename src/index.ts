import config from "./config";
import { AppErrorLogger } from "./app-error-logger";
import { Convert } from "./convert";
import { HttpApiClient } from "./http-api-client";
import { ResponseCache } from "./response-cache";
import { SonosClient } from "./sonos-client";
import { TokenRepository } from "./tokens";

async function initializeSonosClient() {
  const sonosClientId = config.sonosClientId;
  const sonosClientSecret = config.sonosClientSecret;
  const sonosApiToken =
    TokenRepository.getSonosApiToken() || config.bootstrappedSonosApiToken;

  const sonosHttpApiClient = new HttpApiClient(
    "https://api.ws.sonos.com/control/api/v1/",
    sonosApiToken,
    "https://api.sonos.com/login/v3/oauth/access"
  );

  // TODO this slows down startup quite a bit, can optimize by checking
  // the remaining TTL on the token and reuse whatever is in the tizen keymanager.
  const newSonosApiToken = await sonosHttpApiClient.refreshToken(
    sonosClientId,
    sonosClientSecret
  );

  TokenRepository.setSonosApiToken(newSonosApiToken);

  const sonosClient = new SonosClient(sonosHttpApiClient);

  return sonosClient;
}

window.onload = async function () {
  const textbox = document.getElementById("textbox");
  const errorLogger = new AppErrorLogger(textbox);

  const sonosClient = await initializeSonosClient();

  let sensorPollingIntervalId: NodeJS.Timeout;

  // listen for hardware button events (clicking Home or Back buttons)
  document.addEventListener("tizenhwkey", function (e: any) {
    if (e.keyName === "back") {
      try {
        clearInterval(sensorPollingIntervalId);
        tizen.power.release("CPU");
        tizen.power.release("SCREEN");
        tizen.application.getCurrentApplication().exit();
      } catch (ignore) {}
    }
  });

  const gravityCapability = tizen.systeminfo.getCapability(
    "http://tizen.org/feature/sensor.gravity"
  );

  if (gravityCapability) {
    tizen.power.request("CPU", "CPU_AWAKE");
    tizen.power.request("SCREEN", "SCREEN_NORMAL");

    const gravitySensor = tizen.sensorservice.getDefaultSensor(
      "GRAVITY"
    ) as tizen.sensorservice.GravitySensor;

    const householdId = (await ResponseCache.getOrAdd(
      "primaryHouseholdId",
      async () => (await sonosClient.getHouseholds())[0].id
    )) as string;

    const playerId = (await ResponseCache.getOrAdd(
      "primaryPlayerId",
      async () => (await sonosClient.getPlayer(householdId, "Beam")).id
    )) as string;

    gravitySensor.start(() => {
      console.log("Sensor start");

      const sensorPollingRate = config.sensorPollingRateMilliseconds;

      sensorPollingIntervalId = setInterval(
        () =>
          gravitySensor.getGravitySensorData(
            async (sensorData: tizen.sensorservice.SensorGravityData) => {
              const newVolume = Convert.gravity2Volume(sensorData);

              await sonosClient.setPlayerVolume(
                householdId,
                playerId,
                newVolume
              );

              textbox.innerHTML = `Setting the volume to: ${newVolume}<br>Press "Back" to finish.`;
            },
            errorLogger.log
          ),
        sensorPollingRate
      );
    });
  } else {
    errorLogger.log("Gravity sensor not supported!");
  }
};
