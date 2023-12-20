import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from './redux/store';
import { theme } from "./theme";
import React from "react";
import App from "./App";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ThemeProvider>
);