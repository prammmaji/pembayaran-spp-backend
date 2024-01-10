import { Sequelize } from "sequelize"

const db = new Sequelize('node_jwt', 'root', '' , {
    host: 'localhost',
    dialect: 'mysql'    
})

export default db;

