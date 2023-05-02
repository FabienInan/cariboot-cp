import bcrypt from 'bcryptjs-react';
import Cookies from 'js-cookie';
import env from 'react-dotenv';

import { getApi, postApi } from './utils';

const userUrl = `${process.env.REACT_APP_API_URL}/user`;

export const login = async (user, pwd, rememberMe = false) => {
  const saltedPassword = await bcrypt.hash(pwd, env.REACT_APP_SALT_PWD);
  const response = await postApi(`${userUrl}/login`, JSON.stringify({'username': user, 'password': saltedPassword})).then(response => response.json());
  if (response?.token) {
    if (rememberMe) {
      Cookies.set('token', response?.token);
      Cookies.set('username', response?.username);
    } else {
      sessionStorage.setItem('token', response?.token);
      sessionStorage.setItem('username', response?.username);
    }
    return true;
  }
  return false;
};

export const me = async () => {
  const response = await getApi(`${userUrl}/me`, {'Authorization' : `Bearer ${Cookies.get('token') || sessionStorage.getItem('token')}`}).then(response => response.json());
  return response;
};

export const logout = async () => {
  Cookies.remove('token');
  sessionStorage.removeItem('token');
  Cookies.remove('username');
  sessionStorage.removeItem('username');
};