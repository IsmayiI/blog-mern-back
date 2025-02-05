
import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
   try {
      const posts = await PostModel.find().limit(5).exec()

      const tags = posts.map(post => post.tags).flat().slice(0, 5)

      res.json(tags)
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось получить статьи'
      })
   }
}

export const getAll = async (req, res) => {
   try {
      const posts = await PostModel.find().populate('user').exec()

      res.json(posts)
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось получить статьи'
      })
   }
}

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id


      const post = await PostModel.findByIdAndUpdate(
         postId,
         { $inc: { viewsCount: 1 } },
         { returnDocument: 'after' }
      ).populate('user')

      if (!post) {
         return res.status(404).json({
            message: 'Статья не найдена'
         })
      }

      res.json(post)

   } catch (err) {
      res.status(500).json({
         message: 'Не удалось получить статью'
      })
   }
}

export const remove = async (req, res) => {
   try {
      const postId = req.params.id

      const post = await PostModel.findByIdAndDelete(postId)

      if (!post) {
         return res.status(404).json({
            message: 'Статья не найдена'
         })
      }

      res.json({
         success: true
      })

   } catch (err) {
      res.status(500).json({
         message: 'Не удалось удалить статью'
      })
   }
}

export const create = async (req, res) => {
   try {
      const doc = new PostModel({
         title: req.body.title,
         text: req.body.text,
         tags: req.body.tags,
         imageUrl: req.body.imageUrl,
         user: req.userId
      })

      const post = await doc.save()

      res.json(post)
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось создать статью'
      })
   }
}

export const update = async (req, res) => {
   try {
      const postId = req.params.id

      const post = await PostModel.updateOne({ _id: postId }, {
         title: req.body.title,
         text: req.body.text,
         tags: req.body.tags,
         imageUrl: req.body.imageUrl,
         user: req.userId
      })

      if (!post) {
         return res.status(404).json({
            message: 'Статья не найдена'
         })
      }

      res.json({
         success: true
      })

   } catch (err) {
      res.status(500).json({
         message: 'Не удалось обновить статью'
      })
   }
}


export const updateCommentsCount = async (req, res, next) => {
   try {
      const postId = req.body.postId


      const post = await PostModel.findByIdAndUpdate(
         postId,
         { $inc: { commentsCount: 1 } },
         { returnDocument: 'after' }
      )

      if (!post) {
         return res.status(404).json({
            message: 'Статья не найдена'
         })
      }

      next()
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось обновить счетчик комментариев'
      })
   }
}
