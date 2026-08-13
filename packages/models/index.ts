require("dotenv").config();
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

export default new Sequelize({
    dialect: "mysql",
    database: process.env['DB_DATABASE'] || "rdc",
    host: process.env['DB_HOST'],
    port: 3306,
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    logging: false,
    models: [
        __dirname + `/src/db-models/*${__filename.endsWith(".ts") ? ".ts" : ".js"}`,
    ],
    pool: {
        max: 20,
    },
    dialectOptions: {
        decimalNumbers: true,
    },
} as SequelizeOptions);

export {
    Op,
    Transaction,
    QueryTypes,
    Utils,
    fn,
    where,
    col,
    literal,
    Sequelize
} from "sequelize";

export { default as User} from "./src/db-models/user";
export { default as GivingService} from "./src/db-models/giving.service";