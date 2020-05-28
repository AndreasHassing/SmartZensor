import { AppError } from "./app-error";
import { HttpClient } from "./http-client";
import { Sensor } from "./sensor";
import { Sonos } from "./sonos";
import { SonosResponseCache } from "./sonos-response-cache";
import { TokenRepository } from "./tokens";

async function initializeSonosClient() {
  const sonosApiToken = TokenRepository.getSonosApiToken();

  const sonosHttpClient = new HttpClient(
    sonosApiToken,
    "https://api.sonos.com/login/v3/oauth/access"
  );

  const sonosClientId = tizen.preference.getValue("sonosClientId");
  const sonosClientSecret = tizen.preference.getValue("sonosClientSecret");

  // TODO this slows down startup quite a bit, can optimize by checking
  // the remaining TTL on the token and reuse whatever is in the tizen keymanager.
  const newSonosApiToken = await sonosHttpClient.refreshToken(
    sonosClientId,
    sonosClientSecret
  );

  TokenRepository.setSonosApiToken(newSonosApiToken);

  const sonosClient = new Sonos(sonosHttpClient);

  return sonosClient;
}

window.onload = async function () {
  const error = new AppError(document.getElementById("textbox"));

  const sonosClient = await initializeSonosClient();

  let sensorPollingIntervalId;

  // listen for hardware button events (clicking Home or Back buttons)
  document.addEventListener("tizenhwkey", function (e) {
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

    const gravitySensor = tizen.sensorservice.getDefaultSensor("GRAVITY");

    const householdId = await SonosResponseCache.getOrAddPrimaryHouseholdId(
      async () => (await sonos.getHouseholds())[0].id
    );

    const playerId = await SonosResponseCache.getOrAddPrimarySpeakerId(
      async () => (await sonos.getPlayer(householdId, "Beam")).id
    );

    async function onGravitySensorData(sensorData) {
      const newVolume = Sensor.gravity2Volume(sensorData);

      await sonosClient.setPlayerVolume(householdId, playerId, newVolume);

      textbox.innerHTML = `Setting the volume to: ${newVolume}<br>Press "Back" to finish.`;
    }

    function onSensorStart() {
      console.log("Sensor start");
      sensorPollingIntervalId = setInterval(
        () =>
          gravitySensor.getGravitySensorData(onGravitySensorData, error.log),
        tizen.preference.getValue("sensorPollingRateMilliseconds")
      );
    }

    gravitySensor.start(onSensorStart);
  } else {
    error.log("Gravity sensor not supported!");
  }
};
