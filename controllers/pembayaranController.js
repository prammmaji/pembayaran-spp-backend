import { Op } from "sequelize";
import Pembayaran from "../models/pembayaranModel.js";
import User from "../models/userModel.js";
import fs from 'fs';
import Tagihan from "../models/tagihanModel.js";
import midtransClient from 'midtrans-client';
import Siswa from "../models/siswaModel.js";
import db from "../config/koneksi.js";
import {QueryTypes}  from "sequelize";
const sequelize = db;

export const getAllPembayaran = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Anda belum login" });
    }
    try {
        let pembayaran
        if(req.role === "admin"){
             pembayaran = await Pembayaran.findAll({
                include: [{
                    model: User,
                    attributes:['nama','email'],
                    include:[{
                            model: Siswa,
                            attributes:['nomor_induk','kelas']
                    }]
                },  {
                    model: Tagihan,
                    attributes: ['tahun_ajaran', 'nama_tagihan', 'nominal']
                    },{
                        model: Tagihan,
                        attributes: ['tahun_ajaran', 'nama_tagihan', 'nominal']
                        }]
             });
        } else {
            pembayaran = await Pembayaran.findAll({
                where:{
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes:['nama','email'],
                    include:[{
                        model: Siswa,
                        attributes:['nomor_induk','kelas']
                }]
                }, {
                    model: Tagihan,
                    attributes: ['tahun_ajaran', 'nama_tagihan', 'nominal']
                    }]
             });
        }
        res.status(200).json(pembayaran);
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
    }

 export const getPembayaranById = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Anda belum login" });
    }
    try {
        const response = await Pembayaran.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!response) { return res.status(404).json({ msg: 'Pembayaran tidak ditemukan.' }) }
        let pembayaran
        if(req.role === "admin"){
            pembayaran = await Pembayaran.findOne({
  where: {
    id: response.id
  },
  include: [
    {
      model: User,
      attributes: ['nama','email']
    },
    {
      model: Tagihan,
      attributes: ['tahun_ajaran', 'nama_tagihan', 'nominal']
    }
  ]
});
        } else {
            pembayaran = await Pembayaran.findAll({
                where:{
                    [Op.and]: [{id: response.id},{userId: req.userId}]
                },
                include: [{
                    model: User,
                    attributes:['nama','email']
                }]
             });
        }
        res.status(200).json(pembayaran);
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
    
 }
    
export const addPembayaran = async (req, res) => {
    const { tagihanId } = req.body;
    if (!req.userId) {
        return res.status(401).json({ msg: "Anda belum login" });
    }
    const id = req.userId;
    try {
        const statusPembayaran = "Berhasil"
        const defaultTglValidasi = new Date().toLocaleDateString();; // Nilai default untuk tanggal validasi
        await Pembayaran.create({
            tagihanId,
            tgl_pembayaran:defaultTglValidasi,
            status_pembayaran: statusPembayaran,
            userId: id,
        });
        res.json({ msg: "Pembayaran berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({msg: error.message,id})
    }
}

export const updatePembayaran = async (req, res) => {
    const response = await Pembayaran.findOne({
        where: { 
          uuid: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Pembayaran tidak ditemukan.'})
      const {  status_pembayaran } = req.body;
    try {
        const defaultTglValidasi = new Date().toLocaleDateString(); // Tanggal saat ini sebagai tanggal validasi
         await Pembayaran.update(
            {

                tgl_validasi: defaultTglValidasi,
                status_pembayaran,
            },
            { where: { 
                uuid: req.params.id
              } }
        );
        res.json({ msg: "Pembayaran berhasil diupdate" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
export const deletePembayaran = async (req,res) =>{
    const response = await Pembayaran.findOne({
        where: { 
          uuid: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Pembayaran tidak ditemukan.'})
    
    try {
         await Pembayaran.destroy(
            { where: { 
                id: response.id
              } }
        );
        res.json({ msg: "Pembayaran berhasil Dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const midtrans = async (req,res) =>{
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
    const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in "YYYY-MM-DD" format
    
    const orderId = `ORD-${randomNumber}-${currentDate}`;
    const nama = req.nama;
    
    const email = req.email;
    try {
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-V_SmYG0iwwM2Rpl5dyhhnHqp',
            clientKey: 'SB-Mid-client-ChEUWR9FX2MxoH8T',
        });

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: req.body.nominal,
            },item_details: [{
                quantity: 1,
                price: req.body.nominal,
                name: req.body.nama_tagihan,
              }],
              customer_details: {
                first_name: nama + req.body.kelas,
                email: email,
                },
                kelas: req.body.kelas,
        }

        snap.createTransaction(parameter).then((transaction)=> {
            const dataPayment = { 
               response: JSON.stringify(transaction),
            }
            const token = transaction.token;
            res.status(200).json({msg : "Berhasil", dataPayment,token:token })
        })
       
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const cekSudahBayar  = async (req,res) =>{
    const response = await Pembayaran.findOne({
        where: { 
          tagihanId: req.params.id,
          userId: req.userId
        }
      })
      res.status(200).json(response)
}

export const belumBayar = async (req,res) =>{
    const tagihanId = req.params.id
    try {
        const query = `
        SELECT u.email, u.nama,s.nomor_induk, s.kelas
        FROM USER u
        JOIN siswa s ON u.id = s.userId
        WHERE u.id NOT IN (
          SELECT p.userId
          FROM pembayaran p
          WHERE p.tagihanId = "${tagihanId}"
        )`;
    
        const counts = await sequelize.query(query, { type: QueryTypes.SELECT });
        const result = counts;
    
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
      }
}



export default Pembayaran