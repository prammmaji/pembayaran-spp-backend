import User from "../models/userModel.js"
import argon2 from "argon2"

export const getUser = async (req, res) => {
  try {
      const users = await User.findAll({
        attributes: ['id','role', 'uuid','nama', 'email']
      });
      res.status(200).json(users);
  } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { 
        uuid: req.params.id
      },
      attributes: ['role','uuid','nama','email']
    })
    if (!response) {
      return res.status(404).json({ msg: 'User tidak ditemukan.' })
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
  }
}


export const createUser = async (req,res) => {
    const { nama,email, password, confPassword,role } = req.body
    const existingUser = await User.findOne( {where: {email }});
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password tidak sama"})
    const passhash = await argon2.hash(password)
    
    try {
        await User.create({
            role,
            nama,
            email,
            password: passhash,
            
        })
        res.status(201).json({msg: "User berhasil ditambahkan"})
    } catch (error) {
      res.status(400).json({msg: error.message})
    }
}
export const createAdmin = async (req,res) => {
  const { nama,email, password, confPassword } = req.body
  const existingUser = await User.findOne( {where: {email }});
  if (existingUser) {
    return res.status(400).json({ msg: "Email sudah terdaftar" });
  }
  if(password !== confPassword) return res.status(400).json({msg: "Password tidak sama"})
  const passhash = await argon2.hash(password)
  const role = 'admin'
  try {
      await User.create({
          role: role,
          nama,
          email,
          password: passhash,
          
      })
      res.status(201).json({msg: "Admin berhasil ditambahkan"})
  } catch (error) {
    res.status(400).json({msg: error.message})
  }
}
export const updateUser = async (req, res) => {
    const response = await User.findOne({
      where: {
        uuid: req.params.id
      }
    });
    if (!response) return res.status(404).json({ msg: 'User tidak ditemukan.' });

    const { nama, email, password, confPassword } = req.body;
    let hashPassword;

    if (password === '' || password === null) {
      hashPassword = response.password;
    } else {
      hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword) return res.status(400).json({ msg: "Password tidak sama" });
    try {
      await User.update({
        nama,
        email,
        password: hashPassword,
      }, { where: { id: response.id } });
      res.status(201).json({ msg: "User berhasil diupdate" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { 
        uuid: req.params.id
      }
    })
    if (!response) return res.status(404).json({msg:'User tidak ditemukan.'})
    
      await User.destroy({
        where: {id: response.id
        }})
      res.status(201).json({msg: "User berhasil dihapus"})
  } catch (error) {
    res.status(400).json({msg: error.message})
  }
  };

