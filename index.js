
import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import cors from "cors"

import { registerValidation, loginValidation, postCreateValidation, postUpdateValidation } from './validations.js'
import { PostController, UserController } from "./controllers/index.js"
import { checkAuth, handleValidationErrors } from "./utils/index.js"

mongoose.connect('mongodb+srv://admin:12345@cluster0.dzsrkfs.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
   .then(() => console.log('db ok'))
   .catch((err) => console.log('db error', err))


const app = express()

const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, 'uploads')
   },
   filename: (_, file, cb) => {
      cb(null, file.originalname)
   },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`
   })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postUpdateValidation, handleValidationErrors, PostController.update)


app.listen(4444, (err) => {
   if (err) {
      console.log(err);
   }
   console.log('server ok');
})