import React from 'react';

import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { logout } from '../api/user';
import { APP_ROUTES } from '../utils/constants';

const LogoutIconButton = styled(IconButton)`
    margin-left: auto
`;

function TopAppBar() {

  const navigate = useNavigate();
    
  const username = Cookies.get('username') || sessionStorage.getItem('username');

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <AppBar>
      <Toolbar>
        <IconButton>
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
        <Typography variant="h6">
            Bienvenue {username}
        </Typography>
        <LogoutIconButton onClick={handleLogout}>
          <PowerSettingsNewIcon style={{ color: 'white' }} />
        </LogoutIconButton>
      </Toolbar>
    </AppBar>
  );
}
  
export default TopAppBar;