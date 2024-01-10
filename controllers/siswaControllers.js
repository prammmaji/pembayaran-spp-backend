import Siswa from "../models/siswaModel.js";
import User from "../models/userModel.js";
export const getSiswa = async (req, res) => {
    try {
        if(req.role === "admin"){
        const siswa = await Siswa.findAll({
            include: [{
                    model: User,
                    attributes:['nama','email']
                }]
        })
        res.json(siswa)
    }else {
        const siswa = await Siswa.findOne({
            where: { userId: req.userId },
            include: [{
                    model: User,
                    attributes:['nama','email']
                }]
        })
        
        res.json(siswa)
    }
    } catch (error) {
         res.status(400).json({ msg: error.message });
    }
}

export const findSiswa = async (req, res) => {
    const response = await Siswa.findOne({
        where: { 
          id: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Siswa tidak ditemukan.'})
    try {
        const siswa = await Siswa.findAll({
            where: { id: req.params.id },
            include: [{
                    model: User,
                    attributes:['nama','email']
                }]
        })       
        res.json(siswa)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const addSiswa = async (req, res) => {
    const { nomor_induk, kelas, tgl_lahir, alamat } = req.body
    if (!req.userId) {
        return res.status(401).json({ msg: "Anda belum login" });
    }
    const id = req.userId;
    try {
        await Siswa.create({
            nomor_induk,
            kelas,
            tgl_lahir,
            alamat,
            userId:id
        })
        res.json({ msg: "Siswa berhasil ditambahkan" })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateSiswa = async (req, res) => { 
    const response = await Siswa.findOne({
        where: { 
          id: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Siswa tidak ditemukan.'})
    const { nomor_induk, kelas, tgl_lahir, alamat } = req.body
    try {
        await Siswa.update(
            {
                nomor_induk,
                kelas,
                tgl_lahir,
                alamat
            },
            { where: { 
                id: req.params.id
              } }
        );
        res.json({ msg: "Siswa berhasil diupdate" })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteSiswa = async (req, res) => {
    const response = await Siswa.findOne({
        where: { 
          id: req.params.id
        }
      })
      if (!response) return res.status(404).json({msg:'Siswa tidak ditemukan.'})
    
    try {
        await Siswa.destroy({ where: { id: req.params.id } })
        res.json({ msg: "Siswa berhasil dihapus" })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}