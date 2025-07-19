"use strict";
// import { Expect, Equal } from '../../../helpers/type-utils';
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatenateFirstNameAndLastName = void 0;
// These T1, T2 are Generic type and solely belongs to this function below
const returnOfBothWhatIPassIn = (params) => {
    return {
        first: params.a,
        second: params.b,
    };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const result = returnOfBothWhatIPassIn({ a: 1, b: 2 });
class Component {
    // private readonly props: TProps; // diff
    constructor(props) {
        this.props = props;
    }
    // getPropsArrowFn = () => this.props;
    getProps() {
        return this.props;
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const component = new Component({ a: 1, b: 2 });
// prettier-ignore
const concatenateFirstNameAndLastName = (user) => {
    return {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
    };
};
exports.concatenateFirstNameAndLastName = concatenateFirstNameAndLastName;
const users = [
    {
        id: 1,
        firstName: 'Matt',
        lastName: 'Johnson',
    },
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const newUsers = users.map(exports.concatenateFirstNameAndLastName);
//# sourceMappingURL=index.js.map