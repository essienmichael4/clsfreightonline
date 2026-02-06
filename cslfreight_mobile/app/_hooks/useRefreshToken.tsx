import { getRefreshToken, saveTokens } from 'app/_auth/auth.storage';
import axios from 'axios';
import useAuth from './useAuth';


const useRefreshToken = () => {
  const {auth, dispatch} = useAuth();
  const refresh = async () => {
    const refreshToken = auth?.backendTokens?.refreshToken;
    if (!refreshToken) throw new Error('No refresh token');

    const { data } = await axios.get("https://api.cslfreightgh.com/auth/refresh", {
      headers: {
        'Authorization': `Refresh ${refreshToken}`
      }
    });
    dispatch({ type: 'ADD_AUTH', payload: { ...auth, backendTokens: { ...auth.backendTokens, accessToken: data.accessToken, refreshToken: data.refreshToken } } });
    // await saveTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
