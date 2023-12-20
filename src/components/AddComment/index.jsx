import { Avatar, Button, TextField } from "@mui/material";
import styles from "./AddComment.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from '../../axios'
import { selectIsAuth } from "../../redux/slices/auth";

export const AddComment = ({ onCommentAdded }) => {
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const [commentText, setCommentText] = useState('');
  const isAuth = useSelector(selectIsAuth);

  const onAddComment = async () => {
    if (commentText.trim() === '') {
      alert("please enter the comment");
      return;
    };

    if (!isAuth) {
      alert("Please log in to add a comment.");
      return;
    }  

    try {
      const response = await axios.post(`/posts/${id}/comments`, { text: commentText });
      const newComment = response.data;

      setCommentText('');
      onCommentAdded(newComment);

    } catch (error) {
      alert('error sending comment');
      console.error('error sending comment', error)
    };
  };

  return (
    <>
      <div className = {styles.root}>
        <Avatar
          classes = {{ root: styles.avatar }}
          src = {isAuth ? userData.avatarUrl : null}
          alt = {isAuth ? userData.fullName : null}
        />
        <div className = {styles.form}>
          <TextField
            label = "Write a comment"
            variant = "outlined"
            maxRows = {10}
            multiline
            fullWidth
            value = {commentText}
            onChange = {(e) => setCommentText(e.target.value)}
          />
          <Button onClick = {onAddComment} variant = "contained">Send</Button>
        </div>
      </div>
    </>
  );
};