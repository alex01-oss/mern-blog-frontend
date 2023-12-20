import { fetchPosts, fetchTags, fetchComments } from "../redux/slices/posts";
import { Tabs, Tab, Grid, useMediaQuery } from "@mui/material";
import { Post, TagsBlock, CommentsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, comments } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isMobile = useMediaQuery("(max-width:600px)");

  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  const [tabValue, setTabValue] = useState(0);
  const switchNew = () => {setTabValue(0)};
  const switchPopular = () => {setTabValue(1)};

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch]);

  return (
    <>
      <Tabs
        style = {{ marginBottom: 15 }}
        value = {tabValue}
        onChange = {newValue => setTabValue(newValue)}
        aria-label = "basic tabs example"
      >
        <Tab label = "New" value = {0} onClick = {switchNew}/>
        <Tab label = "Popular" value = {1} onClick = {switchPopular}/>
      </Tabs>
      <Grid container spacing = {4}>
        <Grid xs = {isMobile ? 12 : 8} item>
          {isPostLoading ? ([...Array(5)].map((index) => (
              <Post key = {index} isLoading = {true} />
            ))
          ) : tabValue === 0 ? (
            posts.items.map((obj) => (
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
          ) : tabValue === 1 ? (
            posts.items
              .slice()
              .sort((a, b) => b.viewsCount - a.viewsCount)
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
          ) : null}
        </Grid>
        {!isMobile &&
          <Grid xs = {4} item>
            <TagsBlock
              items = {tags.items}
              isLoading = {isTagsLoading}
            />
            <CommentsBlock
              items={comments.items.map((comment) => ({...comment}))}
              isLoading={isCommentsLoading}
            />
          </Grid>
        }
      </Grid>
    </>
  );
};