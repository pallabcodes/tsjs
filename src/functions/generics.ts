// when no type found , then type would be this = "default"
const printValue = <Type extends number | string | object = "default">(value: Type): Type => {
  console.log(value);
  return value;
};

printValue("default");
printValue(1);
printValue("Hello");
printValue({ greet: "Hello" });


