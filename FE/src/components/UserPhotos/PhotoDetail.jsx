import { Typography, Card, CardMedia, CardContent, Divider, Grid, Button, TextField} from "@mui/material";
import {useParams, Link} from "react-router-dom";
import {format} from "date-fns"
import { useState } from "react";
import Toast from "../Toast";
import { URL } from "../../utils/URL";


export const PhotoDetail = ({photo, updatePhotoByComment}) => {
     const [comment, setComment] = useState("");
     const [err, setError] = useState(undefined)
     const [addComentStatus, setAddCommentStatus] = useState({
          open: false,
          message:"",
          status:"error"
     })

     const submitComment = async () => {

          if(!comment?.length) {
               setError("Nhập bình luận");
               return;
          }

          const token = localStorage.getItem("token");
          const response = await fetch(URL+"/api/photo/commentsOfPhoto/" + photo._id, {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
                 "Authorization":`Bearer ${token}`
               },
               body: JSON.stringify({comment})
          })
          if(response.status === 201) {
               const photoChangeByComment =  await response.json();
               updatePhotoByComment(photoChangeByComment.data?.[0])
               setAddCommentStatus({open: true, message:"Thêm thành công!", status:"success"});
          } else {
               setAddCommentStatus({open:true, message:`Lỗi: ${await response.text()}`, status:"error"});
          }
          setComment("")
     }

     const closeToast = () => {
          setAddCommentStatus({
               open: false,
               message:"",
               status:"error"
          })
     }
     return (
       <Card key={photo._id} style={{ marginBottom: '100px' , width: "70%"}}>
       <CardMedia
         component="img"
         alt={photo.file_name}
         style={{ height: 'auto' }} // Chỉ định chiều rộng 100% và chiều cao tự động
         image={URL+`/api/photo/image/${photo._id}`}
       />

       <CardContent>
       <Typography variant="body1">
           Mô tả: {photo.title}
         </Typography>
         <Typography variant="body1">
           Tạo ngày: {format(new Date(photo.date_time), 'dd/MM/yyyy, HH:mm')}
       </Typography>
         <Divider />
         {/* <Typography variant="body1">
           Bình luận:
         </Typography> */}

         <Grid container spacing={1} alignItems="center">
   </Grid>
         {!!photo?.comments?.length && photo?.comments.map((comment) => {
               const user = comment?.user_id;
               return (
                    <div key={comment._id} style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5', marginTop: 20 }}>
                    <Typography variant="body2" style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                    <Link to={`/users/${user._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                         {user?.name || `${user?.first_name} ${user?.last_name}`}
                    </Link>
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '5px' }}>
                    {comment?.comment}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.75rem' }}>
                    {format(new Date(comment.date_time), 'dd/MM/yyyy, HH:mm')}
                    </Typography>
                    </div>

                  )
         })}
                <div style={{ display:"flex", justifyContent:"end", marginTop: 12}}>
         <Button variant="contained" color="primary" onClick={submitComment}>
             Bình luận
         </Button>
       </div>
         <TextField
          label="Bình luận"
          type="comment"
          style={{paddingTop: 10, width: "100%"}}
          value={comment}
          onChange={(e) => {
               setComment(e.target.value);
               setError(undefined)
          }}
          margin="normal"
          variant="outlined"
          error = {err}
        />
       </CardContent>
       <Toast
            open={addComentStatus.open}
            onClose={closeToast}
            message={addComentStatus?.message}
            severity={addComentStatus.status}
      />
     </Card>
     ) 
   }