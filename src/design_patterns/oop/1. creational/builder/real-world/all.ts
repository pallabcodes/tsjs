// 1. Interfaces for Components

interface Security {
  configure(): void;
}

interface Subscription {
  configure(): void;
}

interface Profile {
  configure(): void;
}

interface Notification {
  configure(): void;
}

// 2. Concrete Implementations of Features

class BasicSecurity implements Security {
  configure(): void {
    console.log('Basic security: Password protection');
  }
}

class AdvancedSecurity implements Security {
  configure(): void {
    console.log('Advanced security: Two-factor authentication');
  }
}

class FreeSubscription implements Subscription {
  configure(): void {
    console.log('Free subscription: Limited features');
  }
}

class PremiumSubscription implements Subscription {
  configure(): void {
    console.log('Premium subscription: Unlimited features');
  }
}

class BasicProfile implements Profile {
  configure(): void {
    console.log('Basic profile: Default avatar');
  }
}

class CustomProfile implements Profile {
  configure(): void {
    console.log('Custom profile: User-uploaded avatar');
  }
}

class EmailNotification implements Notification {
  configure(): void {
    console.log('Email notification: Enabled');
  }
}

class SMSNotification implements Notification {
  configure(): void {
    console.log('SMS notification: Enabled');
  }
}

// 3. UserAccount Class that will be constructed

class UserAccount {
  private security: Security | null = null;
  private subscription: Subscription | null = null;
  private profile: Profile | null = null;
  private notification: Notification | null = null;

  setSecurity(security: Security): void {
    this.security = security;
  }

  setSubscription(subscription: Subscription): void {
    this.subscription = subscription;
  }

  setProfile(profile: Profile): void {
    this.profile = profile;
  }

  setNotification(notification: Notification): void {
    this.notification = notification;
  }

  debug(): void {
    console.log('User Account Configuration:');
    this.security?.configure();
    this.subscription?.configure();
    this.profile?.configure();
    this.notification?.configure();
  }
}

// 4. The Builder Interface

interface UserAccountBuilder {
  setSecurity(): void;
  setSubscription(): void;
  setProfile(): void;
  setNotification(): void;
  build(): UserAccount;
}

// 5. Concrete Builder Implementations

class FreeUserAccountBuilder implements UserAccountBuilder {
  private userAccount: UserAccount = new UserAccount();

  setSecurity(): void {
    this.userAccount.setSecurity(new BasicSecurity());
  }

  setSubscription(): void {
    this.userAccount.setSubscription(new FreeSubscription());
  }

  setProfile(): void {
    this.userAccount.setProfile(new BasicProfile());
  }

  setNotification(): void {
    this.userAccount.setNotification(new EmailNotification());
  }

  build(): UserAccount {
    return this.userAccount;
  }
}

class PremiumUserAccountBuilder implements UserAccountBuilder {
  private userAccount: UserAccount = new UserAccount();

  setSecurity(): void {
    this.userAccount.setSecurity(new AdvancedSecurity());
  }

  setSubscription(): void {
    this.userAccount.setSubscription(new PremiumSubscription());
  }

  setProfile(): void {
    this.userAccount.setProfile(new CustomProfile());
  }

  setNotification(): void {
    this.userAccount.setNotification(new SMSNotification());
  }

  build(): UserAccount {
    return this.userAccount;
  }
}

// 6. The Director (Optional)

class UserAccountDirector {
  private builder: UserAccountBuilder;

  constructor(builder: UserAccountBuilder) {
    this.builder = builder;
  }

  constructUserAccount(): UserAccount {
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
