
import PostModel from '../models/Post.js'

export const create = async (req, res) => {
   try {
      const doc = new PostModel({
         title: req.body.title,
         text: req.body.text,
         tags: req.body.tags,
         imageUrl: req.body.imageUrl,
         user: req.userID
      })

      const post = await doc.save()

      res.json(post)
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось создать статью'
      })
   }
}