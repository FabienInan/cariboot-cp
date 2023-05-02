import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { Route, Routes } from 'react-router-dom';

import './App.css';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Guard from './routing/Guard';
import { APP_ROUTES } from './utils/constants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#795548',
      light:'#D7CCC8',
      dark: '#5D4037',
      contrastText: '#FFFFFF',
      accent: '#CDDC39',
      extralight:'#EEEBF6',
      ultralight:'#F7F3FF',
    },
    secondary: {
      main: '#CDDC39',
    }
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}>
        <div className="App">
          <Routes>
            <Route path="*" element={<Guard path={APP_ROUTES.DASHBOARD}><Dashboard /></Guard>}/>
            <Route path={APP_ROUTES.LOGIN} element={<Guard path={APP_ROUTES.LOGIN}><Login /></Guard>}/>
            <Route path={APP_ROUTES.DASHBOARD} element={<Guard path={APP_ROUTES.DASHBOARD}><Dashboard /></Guard>}/>
          </Routes>
        </div>

      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;