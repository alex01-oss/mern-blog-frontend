import { Typography, TextField, Paper, Button, Grid, useMediaQuery } from "@mui/material";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import styles from "./Login.module.scss";
import React from "react";

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isMobile = useMediaQuery("(max-width:600px)");

  const { 
    register, 
    handleSubmit, 
    formState: {errors, isValid} 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Failed to autorize.');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  console.log('isAuth', isAuth);

  if (isAuth) {
    return <Navigate to = '/' />
  }

  return (
    <Grid container spacing = {4} justifyContent="center">
      <Grid xs = {isMobile ? 12 : 4} item>
        <Paper classes = {{ root: styles.root }}>
          <Typography classes = {{ root: styles.title }} variant="h5">
            Autorization
          </Typography>
          <form onSubmit = {handleSubmit(onSubmit)}>
            <TextField
              className = {styles.field}
              label = "E-Mail"
              error = {Boolean(errors.email?.message)}
              helperText = {errors.email?.message}
              type = "email"
              {...register('email', { required: 'Enter email' })}
              fullWidth
            />
            <TextField 
              className = {styles.field} 
              label = "Password"
              error = {Boolean(errors.password?.message)}
              helperText = {errors.password?.message}
              type = "password"
              {...register('password', { required: 'Enter password' })}
              fullWidth />
            <Button
              disabled={!isValid}
              type = "submit"
              size = "large"
              variant = "contained"
              fullWidth
            >
              Войти
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};
