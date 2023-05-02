import React from 'react';

import styled from '@emotion/styled';
import { Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { login } from '../api/user';
import { APP_ROUTES, variantTypes } from '../utils/constants';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #5D4037;
`;

const CustomTypography = styled(Typography)`
    color: white;
`;

const CustomCard = styled(Card)`
    width: 280px;
    margin: 16px;
    padding: 32px;
`;

const CustomTextField = styled(TextField)`
    margin-bottom: 16px;    
    width: 100%;
`;

const CustomCardActions = styled(CardActions)`
    justify-content: center;    
`;

const CustomButton = styled(Button)`
    width: 100%;    
`;

function Login() {

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false
    },
    onSubmit: async (values) => {
      const logged = await login(values.username, values.password, values.rememberMe);
      if (logged) {
        navigate(APP_ROUTES.DASHBOARD);
      }
      else enqueueSnackbar('L\'authentification a échouée', { variant: variantTypes.WARNING } );
    },
  });

  const handleChange = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  return (
    <Container>    
      <CustomTypography variant="h4">Bienvenue sur Cariboot</CustomTypography>
      <img src="../caribou.png"/>
      <CustomCard elevation={8}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <CustomTextField
              required
              name="username"
              id="username"
              value={formik.values.username}
              label="Identifiant"
              onChange={handleChange}
            />
            <CustomTextField
              required
              name="password"
              id="password"
              value={formik.values.password}
              label="Mot de passe"
              onChange={handleChange}
              type="password"
              autoComplete="current-password"
            />
            <FormControlLabel 
              control={
                <Checkbox name="rememberMe" id="rememberMe" value={formik.values.rememberMe} onChange={handleChange} />
              } label="Se souvenir de moi" />
          </CardContent>
          <CustomCardActions>
            <CustomButton size="large" variant="contained" type="submit">Se connecter</CustomButton>
          </CustomCardActions>
        </form>
      </CustomCard></Container>

  );
}

export default Login;