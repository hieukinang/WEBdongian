const express = require("express");
const {photo: Photo, comment: Comment} = require("../db/photoModel");
const verifyToken = require("../utils/verifyToken");
const router = express.Router();
const multer = require("multer")
const path = require("path");
const { log } = require("console");

const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, "images")
   },
   filename: function(req, file, cb) {
      cb(null, Date.now()+"-" + file.originalname);
   }
})

const upload = multer({storage: storage, limits:{fileSize: 10*1024*1024}})

router.get("/image/:photoId",async (req, res) => {
   const photoId=req.params.photoId;
   let photo=await Photo.findById(photoId);
   if(!photo || !photo?.url) return res.status(404).json({error:"photo not found"})
   const image = path.join("C:\\Users\\bmdin\\Downloads\\LTWproject6\\BE\\BE", photo.url);
   if(!image) return res.status(404).json({error:"no image"})
   return res.type("png").sendFile(image);
})


router.post("/new", verifyToken, upload.single('file') ,async (req, res) => {
   try{
      const user = req.user;
      const title = req.body.title;
      const imagePath = req.file.path;
      const photoSaved = await Photo.create({
         title: title,
         url: imagePath,
         file_name: req.file.filename,
         user_id: user._id,
         comments:[]
      })
      res.status(200).json({
         message: "upload success",
         data: photoSaved
      })
   }catch(error) {
      res.status(500).json("error")
   }
})

router.post("/commentsOfPhoto/:photo_id", verifyToken, async (req, res) => {
   try{
      const user = req.user;
      const photoId = req.params.photo_id;
      const comment = req.body.comment;
      
      const photoFind = await Photo.findById(photoId);
      if(!photoFind) {
         return res.status(400).json({error:"Photo not found"});
      }
   
      const commentSaved = await Comment.create({
         comment: comment,
         user_id: user._id,
      })
   
      photoFind.comments = [
         ...photoFind.comments,
         commentSaved
      ]
   
      await photoFind.save();
      const data =  await Photo.find({_id: photoFind._id}).populate({
         path:"comments",
         populate:{
            path:"user_id",
            model: "Users"
         }
        });
      res.status(201).json({
         data:data
      })
   }catch(error) {
      res.status(500).json({error:"Internal server error"})
   }

})

//get photos of user by id
router.get("/photosOfUser/:id", async (request, response) => {
  try{
     const id = request.params.id;
     var photosOfUser = await Photo.find({user_id: id}).populate({
      path:"comments",
      populate:{
         path:"user_id",
         model: "Users"
      }
     });
     response.status(200).json(photosOfUser.reverse());
  }catch(err) {
     response.status(500).json(err);
  }
});



module.exports = router;
