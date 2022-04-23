class Goku<Type> {
  isSaiyan!: Type;
}
interface Saiyan {
  level: number;
  stamina: () => void;
}
class Goten extends Goku<boolean> implements Saiyan {
  level!: number;
  stamina(): void {}
}

class Trunks implements Saiyan {
  level!: number;
  stamina(): void {}
}
