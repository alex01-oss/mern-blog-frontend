import { Typography, TextField, Button, Avatar, Paper, Grid, useMediaQuery } from "@mui/material";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import axios from '../../axios';
import React from "react";

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const inputFileRef = React.useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setAvatarUrl(data.url);      
    } catch (err) {
      console.warn(err);
      alert("error loading file");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      avatar: "",
      fullname: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    if (!avatarUrl) {
      alert("Please upload an avatar");
      return;
    }
  
    values.avatarUrl = avatarUrl;
    const data = await dispatch(fetchRegister(values));
  
    if (!data.payload) {
      return alert("Failed to register.");
    }
  
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    setIsDragging(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleChangeFile({ target: { files: [file] } });
    }
  };
  
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Grid container spacing = {4} justifyContent="center">
      <Grid xs = {isMobile ? 12 : 4} item>
        <Paper
          classes={{ root: `${styles.root} ${isDragging ? styles.dragging : ''}` }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Typography classes={{ root: styles.title }} variant="h5">
            Registration
          </Typography>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <>
                <img
                  src={`http://localhost:4444${avatarUrl}`}
                  alt="uploaded"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                  onClick={() => inputFileRef.current.click()}
                  className={styles.image}
                />
                <AddAPhotoIcon
                  className={styles.plus}
                  sx={{ fontSize: 50, fill: '#fff' }}
                />
              </>
            ) : (
              <>
                <Avatar
                  className={styles.circle}
                  sx={{ width: 100, height: 100 }}
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                  {...register("avatarUrl")}
                />
                <AddAPhotoIcon
                  className={styles.plus}
                  sx={{ fontSize: 50, fill: '#fff' }}
                />
              </>
            )}
            <input
              style={{ width: 100, height: 100, borderRadius: 50 }}
              ref={inputFileRef}
              accept="image/*"
              type="file"
              onChange={handleChangeFile}
              hidden
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              className={styles.field}
              label="Full name"
              error={Boolean(errors.fullName?.message)}
              helperText={errors.fullName?.message}
              {...register("fullName", { required: "Enter your full name" })}
              fullWidth
            />
            <TextField
              className={styles.field}
              label="E-Mail"
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              type="email"
              {...register("email", { required: "Enter your email" })}
              fullWidth
            />
            <TextField
              className={styles.field}
              label="Password"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              type="password"
              {...register("password", { required: "Enter your password" })}
              fullWidth
            />
            <Button
              disabled={!isValid}
              type="submit"
              size="large"
              variant="contained"
              fullWidth
            >
              Register
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};
