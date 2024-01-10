import express from "express"
import db from "./config/koneksi.js"
// import router from "./routes/index.js"
import dotenv from "dotenv"
import cookieParse from "cookie-parser"
import cors from "cors"
import session from "express-session"
import bodyParser from "body-parser"
import userRoute from "./routes/userRoute.js"
import pembayaranRoute from "./routes/pembayaranRoute.js"
import tagihanRoute from "./routes/tagihanRoute.js"
import siswaRoute from "./routes/SiswaRoute.js"
import authRoute from "./routes/authRoute.js"
import laporanRoute from "./routes/laporanRoute.js"
import SequelizeStore from "connect-session-sequelize"
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagePath = join(__dirname, 'public', 'images');

// ... kode lainnya ...

// Menentukan middleware untuk memberikan akses ke gambar


dotenv.config()
const app = express()
try {
    await db.authenticate()
    console.log("Database connected...")    
    db.sync()
}
 catch (error) {
    console.log(error)    
}
app.use('/public/images', express.static(imagePath));

const sessionStore = SequelizeStore(session.Store)

const store = new sessionStore({
    db:db,
})

app.use(bodyParser.urlencoded({extended:true})) 

app.use(session({
    secret:process.env.SESS_SECRET,
    resave:false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
}))
app.use(cookieParse())
app.use(express.json())
app.use(userRoute)
app.use(pembayaranRoute)
app.use(tagihanRoute)
app.use(siswaRoute)
app.use(authRoute)
app.use(laporanRoute)

// store.sync()

app.listen(process.env.APP_PORT,() => console.log("Server running on port 5000"))