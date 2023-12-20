import { Button, Container, IconButton, createTheme, Paper, Divider, useMediaQuery, Avatar, Tooltip, MenuItem, Menu, ListItemIcon } from '@mui/material';
import { Brightness4, Brightness7, Create, Logout, AccountCircle, Login } from '@mui/icons-material';
import { selectIsAuth, logout } from '../../redux/slices/auth';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import styles from './Header.module.scss';
import React, { useEffect } from 'react';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export const Header = () => {
  const userData = useSelector((state) => state.auth.data);
  const colorMode = React.useContext(ColorModeContext);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  
  const [mode, setMode] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
      return <Navigate to="/" />;
    }
  };

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('theme', newMode);
      colorMode.toggleColorMode();
      return newMode;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setMode(savedTheme);
      colorMode.toggleColorMode();
    }
  }, [colorMode]);

  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper elevation={0} className={styles.root}>
        <Container maxWidth="lg">
          <div className={styles.inner}>
            <Link className={styles.logo} to="/">
              <div className={styles.logoText}>
                <div>NODE-REACT BLOG</div>
              </div>
            </Link>
            <div className={styles.mobile}>
              <div className={styles.buttons}>
                {isMobile ? (
                  <IconButton onClick={toggleColorMode}>
                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                ) : (
                  <>
                    {theme.palette.mode} mode 
                    <IconButton onClick={toggleColorMode}>
                      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    {isAuth ? (
                      <>
                        <Link to="/add-post">
                          <Button variant="contained">Create article</Button>
                        </Link>
                        <Button onClick={onClickLogout} variant="contained" color="error">
                          Exit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login">
                          <Button variant="outlined">Login</Button>
                        </Link>
                        <Link to="/register">
                          <Button variant="contained">Register</Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
              {isMobile && 
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar src={userData ? userData.avatarUrl : ''} />
                  </IconButton>
                </Tooltip>
              }
            </div>
          </div>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {isAuth ? (
              <div className={styles.buttons}>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Create fontSize="small" />
                  </ListItemIcon>
                  <Link to="/add-post">Create article</Link>
                </MenuItem>
                <MenuItem onClick={handleClose && onClickLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Exit
                </MenuItem>
              </div>
            ) : (
              <>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Login fontSize="small" />
                  </ListItemIcon>
                  <Link to="/login">Login</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <Link to="/register">Register</Link>
                </MenuItem>
              </>
            )}
          </Menu>
        </Container>
      </Paper>
      <Divider style={{ marginBottom: "30px" }} />
    </>
  );
};