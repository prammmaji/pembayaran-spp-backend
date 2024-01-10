import { Sequelize } from "sequelize"

import db from "../config/koneksi.js"

const {DataTypes} = Sequelize

const Tagihan = db.define('tagihan',{
    tahun_ajaran:{
        type: DataTypes.DATEONLY,
    },
    nama_tagihan:{
        type: DataTypes.STRING,
    },
    nominal:{
        type: DataTypes.INTEGER,
    },
    status:{
        type: DataTypes.STRING,
    }
},{
    freezeTableName: true
})

export default Tagihan;