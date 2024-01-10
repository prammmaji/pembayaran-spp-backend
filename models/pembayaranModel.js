import { Sequelize } from "sequelize"
import db from "../config/koneksi.js"
import User from "./userModel.js"
import Tagihan from "./tagihanModel.js"

const { DataTypes } = Sequelize

const Pembayaran = db.define('pembayaran',{
    
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tagihanId:{
        type: DataTypes.INTEGER
    },
    tgl_pembayaran:{
        type: DataTypes.DATEONLY
    },
    status_pembayaran:{
        type: DataTypes.STRING
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName:true
})

User.hasMany(Pembayaran)
Pembayaran.belongsTo(User, {foreignKey: 'userId'})
Tagihan.hasMany(Pembayaran)
Pembayaran.belongsTo(Tagihan, {foreignKey: 'tagihanId'})

export default Pembayaran;