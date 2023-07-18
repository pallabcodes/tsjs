import { Brand } from "../../helpers/Brand";

type Password = Brand<string, "Password">;
type Email = Brand<string, "Email">;

type UsingPassword = string & { brand: "Password" }; // string & { brand: "Password" }

// maybe to take just before the "and" so string & { brand: "Password" } => string
const usingPassword = "Hello, TypeScript" as UsingPassword;

type UserObject = Brand<{ id: string, name: string }, "User">;
const userObject: UserObject = {
    id: "Fsfsafasfa",
    name: "vzxvxzvzx",
} as UserObject

const verifyPassword = (password: Password) => { };

verifyPassword("Advanced Typescript" as Password);

const password = "121212" as Password;
const email = "john@gmail.com" as Email;

let passwordSlot: Password;

passwordSlot = "fasfsafsafsa" as Password
    ;

