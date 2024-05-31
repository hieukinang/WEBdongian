import React, { useEffect, useState } from "react";
import { Typography, Card, CardMedia, CardContent, Divider, Grid, Button} from "@mui/material";

import "./styles.css";
import {useParams, Link} from "react-router-dom";
import models from "../../modelData/models";
import Image1 from "../../images/kenobi1.jpg"
import { PhotoDetail } from "./PhotoDetail";
import { URL } from "../../utils/URL";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const user = useParams();
    const userId = user.userId;
    const [userModel, setUserModal] = useState()
    const [photos, setPhotos] = useState([])
    // useEffect(() => {
    //   const name = userModel?.first_name + " " + userModel?.last_name;;
    //   const title = "Photos of " + name;
    //   onChange(title)
    // },[userModel])

    const updatePhotoByComment = (photo) => {
        setPhotos(ps => {
          return ps.map(p => {
            if(p._id === photo._id) {
              return photo;
            }
            return p;
          })
        })
      }
    useEffect(() => {
      if (userId) {
        fetch(URL+"/api/photo/photosOfUser/" + user?.userId)
          .then(res => res.json())
          .then(data => {
            setPhotos(data);
          })
          .catch(err => {
            console.error("Error fetching user:", err);
          });
          fetch(URL+"/api/user/" + user?.userId)
          .then(res => res.json())
          .then(data => {
            setUserModal(data);
          })
          .catch(err => {
            console.error("Error fetching user:", err);
          });
      }
    }, [userId]);

    return (
      <>
      <Typography variant="body1">
        {/* This should be the UserPhotos view of the PhotoShare app. Since it is
        invoked from React Router the params from the route will be in property
        match. So this should show details of user:
        {user.userId}. You can fetch the model for the user
        from models.photoOfUserModel(userId): */}
      </Typography>
      {
        photos?.map(photo => {
         return <PhotoDetail photo = {photo} updatePhotoByComment = {updatePhotoByComment}/>
        })
      }
      
      </>
    );
}

export default UserPhotos;
