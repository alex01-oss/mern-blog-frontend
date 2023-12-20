import { ListItem, ListItemAvatar, Avatar, ListItemText, Divider, List, Skeleton, IconButton} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { fetchRemoveComment } from "../redux/slices/posts";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SideBlock } from "./SideBlock";
import moment from "moment"; 

export const CommentsBlock = ({ items, children, isLoading, currentUser }) => {
  const dispatch = useDispatch();
  const [comments, setComments] = useState(items || []);

  useEffect(() => {
    setComments(items || []);
  }, [items]);

  const onClickRemove = async (commentId) => {
    if (window.confirm('Are you sure you want to delete the comment?')) {
      try {
        await dispatch(fetchRemoveComment(commentId));
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      } catch (error) {
        console.error("Error removing comment:", error);
      }
    }
  };

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : comments).map((comment, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={comment.user.fullName} src={comment.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <React.Fragment>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        {comment.user.fullName}
                        <span style={{ fontSize: '0.8em', color: '#999' }}>
                          {` • ${moment(comment.createdAt).fromNow()}`}
                        </span>
                      </React.Fragment>
                    }
                    secondary={comment.text}
                  />
                  {currentUser && currentUser._id === comment.user._id && (
                    <IconButton onClick={() => onClickRemove(comment._id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </React.Fragment>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
