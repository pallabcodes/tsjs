"use strict";
// 1. Interfaces for Components
// 2. Concrete Implementations of Features
class BasicSecurity {
    configure() {
        console.log('Basic security: Password protection');
    }
}
class AdvancedSecurity {
    configure() {
        console.log('Advanced security: Two-factor authentication');
    }
}
class FreeSubscription {
    configure() {
        console.log('Free subscription: Limited features');
    }
}
class PremiumSubscription {
    configure() {
        console.log('Premium subscription: Unlimited features');
    }
}
class BasicProfile {
    configure() {
        console.log('Basic profile: Default avatar');
    }
}
class CustomProfile {
    configure() {
        console.log('Custom profile: User-uploaded avatar');
    }
}
class EmailNotification {
    configure() {
        console.log('Email notification: Enabled');
    }
}
class SMSNotification {
    configure() {
        console.log('SMS notification: Enabled');
    }
}
// 3. UserAccount Class that will be constructed
class UserAccount {
    constructor() {
        this.security = null;
        this.subscription = null;
        this.profile = null;
        this.notification = null;
    }
    setSecurity(security) {
        this.security = security;
    }
    setSubscription(subscription) {
        this.subscription = subscription;
    }
    setProfile(profile) {
        this.profile = profile;
    }
    setNotification(notification) {
        this.notification = notification;
    }
    debug() {
        console.log('User Account Configuration:');
        this.security?.configure();
        this.subscription?.configure();
        this.profile?.configure();
        this.notification?.configure();
    }
}
// 5. Concrete Builder Implementations
class FreeUserAccountBuilder {
    constructor() {
        this.userAccount = new UserAccount();
    }
    setSecurity() {
        this.userAccount.setSecurity(new BasicSecurity());
    }
    setSubscription() {
        this.userAccount.setSubscription(new FreeSubscription());
    }
    setProfile() {
        this.userAccount.setProfile(new BasicProfile());
    }
    setNotification() {
        this.userAccount.setNotification(new EmailNotification());
    }
    build() {
        return this.userAccount;
    }
}
class PremiumUserAccountBuilder {
    constructor() {
        this.userAccount = new UserAccount();
    }
    setSecurity() {
        this.userAccount.setSecurity(new AdvancedSecurity());
    }
    setSubscription() {
        this.userAccount.setSubscription(new PremiumSubscription());
    }
    setProfile() {
        this.userAccount.setProfile(new CustomProfile());
    }
    setNotification() {
        this.userAccount.setNotification(new SMSNotification());
    }
    build() {
        return this.userAccount;
    }
}
// 6. The Director (Optional)
class UserAccountDirector {
    constructor(builder) {
        this.builder = builder;
    }
    constructUserAccount() {
        this.builder.setSecurity();
        this.builder.setSubscription();
        this.builder.setProfile();
        this.builder.setNotification();
        return this.builder.build();
    }
}
// 7. Usage Example
const freeUserBuilder = new FreeUserAccountBuilder();
const premiumUserBuilder = new PremiumUserAccountBuilder();
// Construct a free user account
const freeUserDirector = new UserAccountDirector(freeUserBuilder);
const freeUserAccount = freeUserDirector.constructUserAccount();
freeUserAccount.debug(); // Debugging the configuration
console.log('--------------------------');
// Construct a premium user account
const premiumUserDirector = new UserAccountDirector(premiumUserBuilder);
const premiumUserAccount = premiumUserDirector.constructUserAccount();
premiumUserAccount.debug(); // Debugging the configuration
//# sourceMappingURL=all.js.map