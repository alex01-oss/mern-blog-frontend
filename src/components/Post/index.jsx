import { IconButton, Modal, Box, Backdrop, Fade, Paper } from "@mui/material";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { fetchRemovePost } from "../../redux/slices/posts";
import { Clear, Edit } from "@mui/icons-material";
import { PostSkeleton } from "./Skeleton";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { format } from "date-fns";
import React from "react";
import clsx from "clsx";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm("Are you sure you want to delete article?")) {
      dispatch(fetchRemovePost(id));
    }
  };

  const date = format(new Date(createdAt), "dd MMMM yyyy HH:mm");

  return (
    <Paper className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <Edit />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <Clear />
          </IconButton>
        </div>
      )}
      {imageUrl !== null && (
        <>
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={imageUrl}
            alt={title}
            onClick={() => setOpen(true)}
          />
          {isFullPost && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{ backdrop: {timeout: 500} }}
            >
              <Fade in={open}>
                <Box onClick={() => setOpen(false)} className={styles.box}>
                  <img
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    src={imageUrl}
                    alt={title}
                  />
                </Box>
              </Fade>
            </Modal>
          )}
        </>
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={date} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title :
              <Link to={`/posts/${id}`}>
                {title}
              </Link>
            }
          </h2>
          <ul className={styles.tags}>
            {tags
              .filter((tag) => tag !== "")
              .map((name, index) => (
                <li key={index}>
                  <Link to={`/tags/${name}`}>
                    #{name}
                  </Link>
                </li>
              ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </Paper>
  );
};
