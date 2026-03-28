/**
 * 3. Relations Deconstruction
 */
export declare const posts: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "posts";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "posts";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorId: import("drizzle-orm/pg-core").PgColumn<{
            name: "author_id";
            tableName: "posts";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const usersRelations: import("drizzle-orm").Relations<"users", {
    posts: import("drizzle-orm").Many<"posts">;
}>;
export type PostRelation = ReturnType<typeof usersRelations['config']>['posts'];
