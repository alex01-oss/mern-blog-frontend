import { fetchPosts, fetchTags, fetchComments } from "../redux/slices/posts";
import { Grid, useMediaQuery, Typography } from "@mui/material";
import { Post, TagsBlock, CommentsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tag } from "@mui/icons-material";
import React from "react";

export const TagSearch = () => {
  const { posts, tags, comments } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const { tag } = useParams();

  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';
  
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch]);

  return (
    <>
      <Grid container spacing = {4}>
        <Grid xs = {isMobile ? 12 : 8} item>
          <div style = {{ marginBottom: '1.5em' }}>
            <Typography variant = 'h4' style={{color: "inherit"}}>
              <Tag />
              {tag}
            </Typography>
          </div>
          {isPostLoading ? ([...Array(5)].map((_, index) => (
              <Post key = {index} isLoading = {true} />
            ))
          ) : (
            posts.items
              .filter((post) => post.tags.includes(tag))
              .map((obj) => (
                <Post
                  id = {obj._id}
                  title = {obj.title}
                  imageUrl = {obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : null}
                  user = {obj.user}
                  createdAt = {obj.createdAt}
                  viewsCount = {obj.viewsCount}
                  commentsCount = {obj.commentsCount}
                  tags = {obj.tags ? obj.tags : null}
                  isEditable = {userData?._id === obj.user._id}
                />
              ))
            )}
        </Grid>
        {!isMobile &&
          <Grid xs = {4} item>
            <TagsBlock
              items = {tags.items}
              isLoading = {isTagsLoading}
            />
            <CommentsBlock
              items = {comments.items}
              isLoading = {isCommentsLoading}
            />
          </Grid>
        }
      </Grid>
    </>
  );
};
