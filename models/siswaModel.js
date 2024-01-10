import {Sequelize} from "sequelize"
import db from "../config/koneksi.js"
import User from "./userModel.js"
const {DataTypes} = Sequelize

const Siswa = db.define('siswa', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },nomor_induk: {
        type: DataTypes.INTEGER,
    },
    kelas: {
        type: DataTypes.STRING,
    },
    tgl_lahir: {
        type: DataTypes.DATEONLY,
    },
    alamat: {
        type: DataTypes.TEXT,
    },userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }

}, {
    freezeTableName: true
})
User.hasOne(Siswa);
Siswa.belongsTo(User, { foreignKey: 'userId' });

export default Siswa;