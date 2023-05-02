
import {useAuth} from '../hooks/useAuth';

// eslint-disable-next-line react/prop-types
export function Guard({path, children}) {

  useAuth(path);

  return children;
}
  
export default Guard;