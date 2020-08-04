const express = require('express');
const router = express.Router();
const Blog = require('./model/Blog')
/* GET home page. */




router.get('/' , (req,res,next) => {
  Blog.find().then((foundBlog) => {
    if(foundBlog.length === 0 ){
      return res.status(200).json({Comfirmation: 'Success',Message: 'Blogs Are Empty'})
    }else{
      return res.status(200).json({Comfirmation: 'Success', foundBlog})
    }
  })
  .catch((err) => {
    return res.status(404).json({Comfirmation: 'Failed' ,  err})
  })
})


router.get('/id/:id' , (req,res,next) => {
Blog.findById(req.params.id).then((foundBlog) => {
  if (foundBlog){
    return res.status(200).json({Comfirmation: 'Success' , foundBlog})
  }else{
    return res.status(404).json({Comfirmation: 'Failed' , Message: 'No Blog Found'})
  }
})
.catch((err) => {
  return res.status(404).json({Comfirmation: 'Failed' , Message: 'No Blog Found' , err})
})
})



router.post('/CreatePost' , async (req,res,next) => {
  const {
    title,
    author,
    subject,
    article
} = req.body
  try{

    if (!title || !author|| !subject || !article) {
      return res.status(504).json({Comfirmation: 'Failed',Message: 'MISSING DATA'})
    }
     newBlog = await new Blog({
      title,
      author,
      subject,
      article
    })
    await newBlog.save().then((blog)=> {
      return res.status(200).json({Comfirmation: 'Success' , Message: 'Blog has been Created' , blog})
    })
    .catch((err) => {
      return res.status(504).json({Comfirmation: 'Failed',Message: 'Blog Not Created', err})
    } )

  }
catch(err){
  
  return res.status(504).json({Comfirmation: 'Failed',Message: 'Blog Not Created' , err})
}
})

router.put('/edit/:id' , async (req,res,next) => {

  try{
    let blog = await Blog.findById(req.params.id)
    if(blog){
      const {title,author,subject,article} = req.body
      blog.title = title ? title : blog.title
      blog.author = author ? author : blog.author
      blog.subject = subject ? subject : blog.subject
      blog.article = article ? article : blog.article

      // let newBlog = await new Blog({
      //   title,
      //   author,
      //   subject,
      //   article
      // })
      // let blogs = {...blog , ...newBlog}
      // console.log(blogs)
      
      await blog.save().then((blog) => {
        return res.status(200).json({Comfirmation: 'Success' , Message: 'Blog has been Edit' , blog})
      })
      .catch((err) => {
        return res.status(504).json({Comfirmation: 'Failed',Message: 'Blog Didnt Update'})
      })
    }

  }
  catch(err){
    return res.status(504).json({Comfirmation: 'Failed', err: err})
  }
})

router.delete('/delete/:id' ,(req,res,next) => {
     Blog.findById(req.params.id).then((foundblog)=> {
    if(foundblog){
      Blog.findByIdAndDelete(foundblog.id).then(()=> {
        return res.status(200).json({Comfirmation: 'Success' , Message: `Blog has been Delete` , foundblog})
      })
      .catch((err) => {
        return res.status(504).json({Comfirmation: 'Failed',Message: 'Blog Didnt Delete' , err})
      })
    }else{
      return res.status(404).json({Comfirmation: 'Failed' , Message: 'No Blog Found'})
    }
  }).catch((err) => {
    return res.status(504).json({Comfirmation: 'Failed',Message: 'err' , err})
  })

})




module.exports = router;
