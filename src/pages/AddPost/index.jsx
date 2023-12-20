import { Navigate, useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TextField, Paper, Button } from "@mui/material";
import { selectIsAuth } from "../../redux/slices/auth";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import axios from "../../axios";
import React from "react";

import MDEditor from '@uiw/react-md-editor';

export const AddPost = () => {
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const inputFileRef = React.useRef(null);
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("error loading file");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        imageUrl,
        title,
        tags: tags.split(','),
        text
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);

    } catch (err) {
      console.warn(err);
      alert('error creating post');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setImageUrl(data.imageUrl);
          setTitle(data.title);
          setTags(data.tags.join(','));
          setText(data.text);
        }).catch((err) => {
          console.warn(err);
          alert('error getting article');
        });
    }
  }, [id]);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mr: 2, mb: 3 }}
      >
        Upload file
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          onChange={handleChangeFile}
          hidden
      />
      </Button>

      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
            sx={{ mb: 3 }}
          >
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <MDEditor
        data-color-mode={localStorage.getItem('theme')}
        className={styles.editor}
        value={text}
        onChange={onChange}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publicate'}
        </Button>
        <Button size="large">Cancel</Button>
      </div>
    </Paper>
  );
};