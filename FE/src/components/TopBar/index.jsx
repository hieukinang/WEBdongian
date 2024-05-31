import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Modal, TextField } from "@mui/material";
import {useParams, Link, useNavigate} from "react-router-dom";
import "./styles.css";
import Toast from "../Toast";
import { URL } from "../../utils/URL";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({title, setIsLogin, setError}) {
  const naviagate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [openModalUpload, setOpenModelUpload] = useState(false);
  const [photoUpload, setPhotoUpload] = useState({
    title:"",
    file:null
  })

  const [uploadStatus, setUploadStatus] = useState({
    open: false,
    message: "",
    statusToast:"success"
  })

  const openModelUpLoadImage = () => {
    setOpenModelUpload(true);
  }

  const closeUploadStatus = () =>{
    setUploadStatus({
      open: false,
      message:"",
      statusToast:"success"
    })
  }

  const logOut = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if(!token || !userId) {
      setIsLogin(false)
      return;
    };

    const response = await fetch(URL+"/api/user/logout", {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization":`Bearer ${token}`
      }
    })

    if(response.status === 200) {
      localStorage.clear();
      setIsLogin(false);
      naviagate("/")
    } else {


        const res = await response.json();
        if(res.error === "Token expired")  {
          setError({
            open: true,
            message:"Hết hạn đăng nhập"
          })
          window.location.href = "/"
          localStorage.clear()
        } else{
          setError({
            open: true,
            message:"Có lỗi xảy ra"
          })
        }
    } 

  }

  const handleCloseUpload = () => {
    setOpenModelUpload(false);
  }

  const handleTitleChange = (event) => {
    setPhotoUpload({
      ...photoUpload,
      title: event.target.value
    })
  }

  const handleFileChange = (event) => {
    setPhotoUpload({
      ...photoUpload,
      file: event.target.files[0]
    })
    console.log(event.target.files[0]);
  }

  const handleUploadPhoto = async () => {
    if(!photoUpload?.title || !photoUpload?.file) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", photoUpload.title);
    formData.append("file", photoUpload.file); 
    const response = await fetch(URL+"/api/photo/new", {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${token}`
        },
        body: formData
    });
    if(response.status === 200) {
        setUploadStatus({
          open: true,
          message:"Thêm ảnh mới thành công",
          statusToast:"success"
        })
        handleCloseUpload();
        const userId = localStorage.getItem("userId");
        window.location.href = `/photos/${userId}`
    } else {
      setUploadStatus({
        open: true,
        message:"Có lỗi xảy ra",
        severity: "error"
      })
    }
}
    return (

      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          <Link to={`/users/${userId}`} style={{ color: "white", textDecoration: "none" }}>
            {title}
          </Link>


          </Typography>
          <Button variant="outlined" color="inherit" onClick={openModelUpLoadImage}>
            Thêm ảnh
          </Button>
          <div style={{margin: "0 10px"}}></div>
          <Button variant="outlined" color="inherit" onClick={logOut}>
            Đăng xuất
          </Button>
        </Toolbar>
        {
              openModalUpload && (<Modal open={openModalUpload} onClose={handleCloseUpload}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <TextField
                    label="Title"
                    type="name"
                    fullWidth
                    value={photoUpload.title}
                    onChange={handleTitleChange}
                    margin="normal"
                    variant="outlined"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                <div style={{ display:"flex", justifyContent:"end", marginTop: 20}}>
                <Button onClick={handleUploadPhoto} variant="contained" color="primary">
                    Upload
                  </Button>
                  <div style={{padding: 5}}/>
                <Button onClick={handleCloseUpload} variant="contained" color="error">
                    Close
                  </Button>
                </div>
                </div>
              </Modal>)
            }
                        <Toast
            open={uploadStatus.open}
            onClose={closeUploadStatus}
            message={uploadStatus.message}
            severity={uploadStatus.statusToast}
      />
      </AppBar>
      
    );
}

export default TopBar;
