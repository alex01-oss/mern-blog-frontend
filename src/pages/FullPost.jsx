import { CommentsBlock, AddComment, Post } from "../components";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from '../axios';

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.data);

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Error get articles");
      });
  }, [id]);
  
  const handleCommentAdded = (newComment) => {
    setData({
      ...data,
      comments: [...data.comments, {...newComment, user: userData }],
      commentsCount: data.commentsCount + 1
    });
  };
  
  const handleCommentRemoved = (removedComment) => {
    setData({
      ...data,
      comments: data.comments.filter(comment => comment._id !== removedComment._id),
      commentsCount: data.commentsCount - 1
    });
  };  
  
  if (isLoading) {
    return (
      <>
        <Post isLoading = {isLoading}/>
        <CommentsBlock isLoading = {isLoading}/>
      </>
    );
  }

  return (
    <>
      <Post
        id = {data.id}
        title = {data.title}
        imageUrl = {data.imageUrl ? `http://localhost:4444${data.imageUrl}` : null}
        user = {data.user}
        createdAt = {data.createdAt}
        viewsCount = {data.viewsCount}
        commentsCount = {data.commentsCount}
        tags = {data.tags ? data.tags : null}
        isFullPost
      >
        <ReactMarkdown children = {data.text} />
      </Post>
      <CommentsBlock
        items={data.comments}
        isLoading={false}
        isFullPost
        currentUser={userData}
      >
        <AddComment
          onCommentAdded={handleCommentAdded}
          onCommentRemoved={handleCommentRemoved}
        />
      </CommentsBlock>
    </>
  );
};