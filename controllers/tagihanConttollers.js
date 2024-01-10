import Tagihan from "../models/tagihanModel.js"
import User from "../models/userModel.js"
import Pembayaran from "../models/pembayaranModel.js"
import { Sequelize,Op } from "sequelize"
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql' // Replace with the appropriate database dialect
  });

export const getTagihan = async (req,res) => {
    try {
        const tagihan = await Tagihan.findAll({
            attributes:['id','tahun_ajaran','nama_tagihan','nominal','status']
        })
        res.json(tagihan)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
export const getTagihanAktif = async (req,res) => {
    try {
        const tagihan =  await Tagihan.findAll({
            attributes: ['id','tahun_ajaran', 'nama_tagihan','nominal'],
            include: [
              {
                model: Pembayaran,
                as: 'pembayarans', // Menggunakan alias "pembayarans" yang sesuai dengan asosiasi
                attributes: [],
                include: [
                  {
                    model: User,
                    as: 'user', // Menggunakan alias "user" yang sesuai dengan asosiasi
                    where: {
                      uuid: req.session.userId,
                    },
                    attributes: [],
                  },
                ],
              },
            ],
            where: {
              status: 'aktif',
              id: {
                [Op.notIn]: sequelize.literal(`(SELECT tagihanId FROM pembayaran WHERE userId = ${req.userId})`),
              },
            },
            raw: true
          });
        res.json(tagihan)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const getTagihanById = async (req,res) => {
    try {
        const tagihan = await Tagihan.findOne({
            where:{
                id: req.params.id
            },
            attributes:['tahun_ajaran','nama_tagihan','nominal','status']
        })
        res.json(tagihan)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const createTagihan = async (req,res) => {
    const {tahun_ajaran,nama_tagihan,nominal,status} = req.body

    try {
        await Tagihan.create({
            tahun_ajaran,
            nama_tagihan,
            nominal,
            status
        })
        res.json({msg:"Tagihan berhasil ditambahkan."})
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
export const updateTagihan = async (req, res) => {
    const response = await Tagihan.findOne({
        where: { 
          id: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Pembayaran tidak ditemukan.'})
      const {tahun_ajaran,nama_tagihan,nominal,status} = req.body
    try {
         await Tagihan.update(
            {
                tahun_ajaran,
                nama_tagihan,
                nominal,
                status
            },
            { where: { 
                id: req.params.id
              } }
        );
        res.json({ msg: "Pembayaran berhasil diupdate" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteTagihan = async (req,res) =>{
    const response = await Tagihan.findOne({
        where: { 
          id: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Tagihan tidak ditemukan.'})
    
    try {
         await Tagihan.destroy(
            { where: { 
                id: response.id
              } }
        );
        res.json({ msg: "Tagihan berhasil Dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
