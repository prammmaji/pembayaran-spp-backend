
import User from "../models/userModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    try {
         
    const user = await User.findOne({
        where: { 
          email: req.body.email
        }
      })
      if (!user) return res.status(404).json({msg:'User tidak ditemukan.'})
      const match = await argon2.verify(user.password, req.body.password)
      if (!match) return res.status(400).json({msg:'Password salah.'})
      req.session.userId = user.uuid
      
      const uuid = user.uuid
      const email = user.email
      const nama  = user.nama
      const role = user.role
      res.status(200).json({uuid,nama,email,role})
    } catch (error) {
        console.log(error)
    }
      
} 

export const me = async (req,res) => {
    if(!req.session.userId) return res.status(401).json({msg:"Anda belum login"})
    const user = await User.findOne({
        attributes: ['role','uuid','nama','email'],
        where: {
            uuid : req.session.userId
        }
    })
    if(!user) return res.status(404).json({msg:"User tidak ditemukan"})
    res.status(200).json(user)
}

export const Logout = async (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(400).json({msg:"Tidak dapat Logout"})
        }
        
        res.status(200).json({msg:"Logout berhasil"})
    })
}