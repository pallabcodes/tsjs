enum Brightness {
  UNKNOWN = 'UNKNOWN',
  BRIGHT = 'BRIGHT',
  DIM = 'DIM',
}

enum Service {
  UNKNOWN = 'UNKNOWN',
  HULU = 'HULU',
  NETFLIX = 'NETFLIX',
  HBO = 'HBO',
}

class SmartHomeSubSystem {
  private brightness: Brightness;
  private temperature: number;
  private isSecurityArmed: boolean;
  private streamingService: Service;

  constructor() {
    this.brightness = Brightness.UNKNOWN;
    this.temperature = 19;
    this.isSecurityArmed = false;
    this.streamingService = Service.UNKNOWN;
  }

  setBrightness(brightness: Brightness): void {
    this.brightness = brightness;
  }

  setTemperature(temperature: number): void {
    this.temperature = temperature;
  }

  setIsSecurityArmed(isSecurityArmed: boolean): void {
    this.isSecurityArmed = isSecurityArmed;
  }

  setStreamingService(streamingService: Service): void {
    this.streamingService = streamingService;
  }

  enableMotionSensors(): void {
    // Implementation here
  }

  updateFirmware(): void {
    // Implementation here
  }
}

class SmartHomeFacade {
  private smartHome: SmartHomeSubSystem;

  constructor(smartHome: SmartHomeSubSystem) {
    this.smartHome = smartHome;
  }

  setMovieMode(): void {
    this.smartHome.setBrightness(Brightness.DIM);
    this.smartHome.setTemperature(21);
    this.smartHome.setIsSecurityArmed(false);
    this.smartHome.setStreamingService(Service.NETFLIX);
  }

  setFocusMode(): void {
    this.smartHome.setBrightness(Brightness.BRIGHT);
    this.smartHome.setTemperature(22);
    this.smartHome.setIsSecurityArmed(true);
    this.smartHome.setStreamingService(Service.UNKNOWN);
  }
}

// Client Code
const facade = new SmartHomeFacade(new SmartHomeSubSystem());
facade.setMovieMode();
facade.setFocusMode();
