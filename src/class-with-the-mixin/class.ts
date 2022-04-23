class Visibility {
  visible = true;
  setVisible(visible: boolean) {
    this.visible = visible;
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
