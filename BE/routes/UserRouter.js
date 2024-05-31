const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken");

router.use(express.json()); 

router.post("/login", async(req, res) => {
   try {
      const user = req.body;
      if(!user.name || !user.password) {
         return res.status(400).status("bad request");
      }

      const userFind = await User.findOne({name: user.name, password: user.password});
      if(!userFind) {
         return res.status(401).json({error:"Authenticate fail"});
      }
      // if(userFind.is_login) {
      //    return res.status(401).json({error: "User have already logined"});
      // }
      await User.updateOne({_id: userFind._id}, {$set:{is_login: true}})

      jwt.sign({userFind}, "KEY", {expiresIn: "1h"}, (err, token) => {
         if(err) {
            res.status(500).json({error: "parse to jwt fail"});
         } else {
            res.status(200).json({
               message: "login success",
               token: token,
               user: userFind
            })
         }
      })

   } catch(err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
   }
});

router.post("/register", async(req, res) => {
   try {
      const user = req.body;
      if(!user.name || !user.password) {
         return res.status(400).status("bad request");
      }

      const userFind =await User.findOne({name: user.name});
      if(userFind) {
         return res.status(400).json({error: "user_name have already created"});
      }

      const userSaved =await User.create({
         name: user.name,
         password: user.password,
         is_login: false, 
         first_name: user?.first_name, 
         last_name: user?.last_name,
         location: user?.location,
         description: user?.description,
         occupation:user?.occupation
         
      });
      return res.status(201).json(userSaved);
   } catch(err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
   }
});

router.post("/logout", verifyToken, async(req, res) => {
   const user = req.user;
   try {
      const userFind = await User.findOne({_id: user._id});
      if (!userFind) {
         return res.status(404).json({error: "User not found!"});
      }
      if (!userFind.is_login) {
         return res.status(403).json({error: "You are already logged out."});
      }
      userFind.is_login = false;
      await userFind.save(); // Sử dụng phương thức save() để lưu thay đổi của userFind
      res.status(200).json({
         message: "Logout successfully"
      });
   } catch (error) {
      // Xử lý lỗi nếu có
      console.error(error);
      res.status(500).json({error: "Internal server error"});
   }
   
})

router.get("/list", async (req, res) => {
   try {
      const allUser = await User.find({is_login: true});
      res.status(200).json(allUser);
   } catch(err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
   }
});

router.get("/:id", async (request, response) => {
   try {
      const id = request.params.id;
      const user = await User.findById(id);
      if (!user) {
         return response.status(404).json({ error: "User not found" });
      }
      response.status(200).json(user);
   } catch(err) {
      console.error(err);
      response.status(500).json({ error: "Internal server error" });
   }
});

module.exports = router;
