class Visibility {
  private static digit: number = 0;
  private visible: boolean = true;
  constructor() {
    Visibility.digit++;
  }
  setVisible(visible: boolean): void {
    this.visible = visible;
  }
  public static getDigit() {
    return Visibility.digit;
  }
}

class MockVisibility extends Visibility {
  override setVisible(visible: boolean): void {
    console.log(visible ? "show" : "hide");
  }
}

// for app
const real = new Visibility();
real.setVisible(true);
real.setVisible(false);

// for test
const mock = new MockVisibility();

mock.setVisible(true);
mock.setVisible(false);
