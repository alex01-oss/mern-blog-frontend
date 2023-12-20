import { Home, FullPost, Registration, AddPost, Login, TagSearch } from "./pages";
import { Container, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ColorModeContext } from './components/Header/index';
import { fetchAuthMe } from './redux/slices/auth';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Header } from "./components";
import React from 'react';

function App() {
  const dispatch = useDispatch();
  const [mode, setMode] = React.useState('light');

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }}), []
  );

  const theme = React.useMemo(() =>
    createTheme({ 
      palette: {
        mode,
        background: {
          default: mode === 'light' ? "#f5f5f5" : "#121212",
        }
      },
    }), [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ColorModeContext.Provider value={colorMode}>
        <Header />
        <Container maxWidth="lg">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/posts/:id' element={<FullPost />} />
            <Route path='/posts/:id/edit' element={<AddPost />} />
            <Route path='/add-post' element={<AddPost />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />
            <Route path='/tags/:tag' element={<TagSearch />} />
          </Routes>
        </Container>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}

export default App;