"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getServerSideProps = async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const json = await data.json();
    return {
        props: {
            json: json,
            isJSON: true,
        },
    };
};
const parser1 = {
    parse: () => 1,
};
const parser2 = () => '123';
const parser3 = {
    extract: () => true,
};
//# sourceMappingURL=index.js.map