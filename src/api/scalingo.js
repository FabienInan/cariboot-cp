
import { postApi } from './utils';

const triggerDeployment = async (appName, environment, branch ) => {
  const body = {
    appName,
    environment,
    branch,
    archi: 'fe'
  };
  const response = await postApi(`${process.env.REACT_APP_API_URL}/scalingo/triggerDeployment`, JSON.stringify(body));
  return response;
};

const getLastDeployments = async (appName, environment, branch ) => {
  const body = {
    appName,
    environment,
    branch,
    archi: 'fe'
  };
  const response = await (await postApi(`${process.env.REACT_APP_API_URL}/scalingo/lastDeployments`, JSON.stringify(body))).json();
  return response;
};

export {triggerDeployment, getLastDeployments};
