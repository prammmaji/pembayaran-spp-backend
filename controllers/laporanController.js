import User from "../models/userModel.js";
import Tagihan from "../models/tagihanModel.js";
import Pembayaran from "../models/pembayaranModel.js";
import Siswa from "../models/siswaModel.js";
import {Sequelize,QueryTypes}  from "sequelize";
import db from "../config/koneksi.js";

const sequelize = db;

export const hitung = async (req, res) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM tagihan WHERE STATUS='Aktif') AS jumlahTagihan,
        (SELECT COUNT(*) FROM siswa) AS jumlahSiswa,
        (SELECT COUNT(*) FROM USER) AS jumlahUser,
        (SELECT COUNT(*) FROM pembayaran WHERE status_pembayaran='Berhasil') AS jumlahPembayaran
      FROM
        tagihan, siswa, USER, pembayaran
      LIMIT 1;
    `;

    const counts = await sequelize.query(query, { type: QueryTypes.SELECT });
    const result = counts[0];

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};