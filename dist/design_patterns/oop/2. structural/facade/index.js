"use strict";
// The Facade Pattern is used to provide a unified interface to a set of interfaces in a subsystem. This makes the subsystem easier to use by hiding its complexity from the client. It simplifies interactions with multiple subsystems by providing a single entry point.
var Brightness;
(function (Brightness) {
    Brightness["UNKNOWN"] = "UNKNOWN";
    Brightness["BRIGHT"] = "BRIGHT";
    Brightness["DIM"] = "DIM";
})(Brightness || (Brightness = {}));
var Service;
(function (Service) {
    Service["UNKNOWN"] = "UNKNOWN";
    Service["HULU"] = "HULU";
    Service["NETFLIX"] = "NETFLIX";
    Service["HBO"] = "HBO";
})(Service || (Service = {}));
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
// Client Code
const index = new SmartHomeFacade(new SmartHomeSubSystem());
index.setMovieMode();
index.setFocusMode();
//# sourceMappingURL=index.js.map