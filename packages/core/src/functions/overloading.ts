// function overload: same parameter but different types and return types different
function addData(data1 : string, data2 : string) : string;
function addData(data1 : number, data2 : number): number;
function addData(data1 : any, data2 : any){
  return data1 + data2;
}

console.log(addData("Hello ", "GeeksForGeeks"));
console.log(addData(20, 30));

// function overloading within class

class Data {
  public displayData(data:string) : number;
  public displayData(data: number) : string;
  public displayData(data:any) : any {
    if(typeof(data) === 'number' ) return data.toString();
    if(typeof(data) === 'string' ) return data.length;
  };
}

let object = new Data();
console.log(`The result is  ${object.displayData(124456)} `);
let stringData = "GeeksForGeeks";
console.log(`string length is ${stringData} is ${object.displayData(stringData)}`);
