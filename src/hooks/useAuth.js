import { useEffect, useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { me } from '../api/user';
import { APP_ROUTES } from '../utils/constants';

export function useAuth(destination) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getMe() {
      setIsLoading(true);
      const { authenticated } = await me();
      setIsLoading(false);
      if (authenticated && destination === APP_ROUTES.LOGIN){
        navigate(APP_ROUTES.DASHBOARD);
      } else if (authenticated) {
        navigate(destination);
      }
      else navigate(APP_ROUTES.LOGIN);
    }
    getMe();
  }, []);

  return { isLoading };
}