class Door {
  constructor() {
    if (new.target === Door) throw new TypeError("Cannot construct instances of abstract Door");
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
  //..
}



class ExternalDoor extends Door {
  //...
}



class SafeDepositDoor extends Door {
  //...
}



class SlidingDoor extends Door {
  //...
}



class NonLocking {
  lock() {
    return "Door does not lock - ignoring";
  }

  unlock() {
    return "Door cannot unlock because it cannot lock";
  }
}



class KeyCard {
  lock() {
    return "Door locked using keycard!";
  }

  unlock() {
    return "Door unlocked using keycard!";
  }
}



class Password {
  lock() {
    return "Door locked using password!";
  }

  unlock() {
    return "Door unlocked using password!";
  }
}



class Revolving {
  open() {
    //...
  }

  close() {
    //...
  }
}



class Sliding {
  open() {
    return "Sliding door open";
  }

  close() {
    return "Sliding door close";
  }
}




class Standard {
  open() {
    return "Pushing door open";
  }

  close() {
    return "Pulling door closed";
  }
}



const run = () => {
  const c = new ClosetDoor();

  c.setOpenBehavior(new Standard());
  c.setLockBehavior(new NonLocking());

  console.log(c.performOpen());
  console.log(c.performClose());

  console.log(c.performLock());
  console.log(c.performUnlock());

  c.setLockBehavior(new Password());
  console.log(c.performLock());
  console.log(c.performUnlock());
}

run();