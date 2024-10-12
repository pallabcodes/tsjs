class Door {
  constructor() {
    if (new.target === Door) {
      throw new TypeError('Cannot construct instances of abstract Door');
    }
    this.lockBehavior = null;
    this.openBehavior = null;
  }

  setLockBehavior(strategy) {
    this.lockBehavior = strategy;
  }

  setOpenBehavior(strategy) {
    this.openBehavior = strategy;
  }

  performLock() {
    return this.lockBehavior.lock();
  }

  performUnlock() {
    return this.lockBehavior.unlock();
  }

  performOpen() {
    return this.openBehavior.open();
  }

  performClose() {
    return this.openBehavior.close();
  }
}

class ClosetDoor extends Door {
  constructor() {
    super();
    // Closet door might have specific behaviors
  }
}

class ExternalDoor extends Door {
  constructor() {
    super();
    // External door might have specific behaviors
  }
}

class SafeDepositDoor extends Door {
  constructor() {
    super();
    // Safe deposit door might have specific behaviors
  }
}

class SlidingDoor extends Door {
  constructor() {
    super();
    // Sliding door might have specific behaviors
  }
}

class NonLocking {
  lock() {
    return 'Door does not lock - ignoring';
  }

  unlock() {
    return 'Door cannot unlock because it cannot lock';
  }
}

class KeyCard {
  lock() {
    return 'Door locked using keycard!';
  }

  unlock() {
    return 'Door unlocked using keycard!';
  }
}

class Password {
  lock() {
    return 'Door locked using password!';
  }

  unlock() {
    return 'Door unlocked using password!';
  }
}

class Revolving {
  open() {
    return 'Revolving door is spinning open';
  }

  close() {
    return 'Revolving door is spinning closed';
  }
}

class Sliding {
  open() {
    return 'Sliding door open';
  }

  close() {
    return 'Sliding door close';
  }
}

class Standard {
  open() {
    return 'Pushing door open';
  }

  close() {
    return 'Pulling door closed';
  }
}

// Run example
const run = () => {
  const c = new ClosetDoor();

  c.setOpenBehavior(new Standard());
  c.setLockBehavior(new NonLocking());

  console.log(c.performOpen()); // Output: Pushing door open
  console.log(c.performClose()); // Output: Pulling door closed

  console.log(c.performLock()); // Output: Door does not lock - ignoring
  console.log(c.performUnlock()); // Output: Door cannot unlock because it cannot lock

  // Changing lock behavior to Password
  c.setLockBehavior(new Password());
  console.log(c.performLock()); // Output: Door locked using password!
  console.log(c.performUnlock()); // Output: Door unlocked using password!
};

// Call the run function to demonstrate behavior
run();
