const Brightness = Object.freeze({
  UNKNOWN: "UNKNOWN",
  BRIGHT: "BRIGHT",
  DIM: "DIM"
});

const Service = Object.freeze({
  UNKNOWN: "UNKNOWN",
  HULU: "HULU",
  NETFLIX: "NETFLIX",
  HBO: "HBO"
});

class SmartHomeSubSystem {
  constructor() {
    this.brightness = Brightness.UNKNOWN;
    this.temperature = 19;
    this.isSecurityArmed = false;
    this.streamingService = Service.UNKNOWN;
  }

  setBrightness(brightness) {
    this.brightness = brightness;
  }

  setTemperature(temperature) {
    this.temperature = temperature;
  }

  setIsSecurityArmed(isSecurityArmed) {
    this.isSecurityArmed = isSecurityArmed;
  }

  setStreamingService(streamingService) {
    this.streamingService = streamingService;
  }

  enableMotionSensors() {
    // Implementation here
  }

  updateFirmware() {
    // Implementation here
  }
}

class SmartHomeFacade {
  constructor(smartHome) {
    this.smartHome = smartHome;
  }

  setMovieMode() {
    this.smartHome.setBrightness(Brightness.DIM);
    this.smartHome.setTemperature(21);
    this.smartHome.setIsSecurityArmed(false);
    this.smartHome.setStreamingService(Service.NETFLIX);
  }

  setFocusMode() {
    this.smartHome.setBrightness(Brightness.BRIGHT);
    this.smartHome.setTemperature(22);
    this.smartHome.setIsSecurityArmed(true);
    this.smartHome.setStreamingService(Service.UNKNOWN);
  }
}

const facade = new SmartHomeFacade(new SmartHomeSubSystem());
facade.setMovieMode();
facade.setFocusMode();