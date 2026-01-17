import { getRefreshToken, saveTokens } from 'app/_auth/auth.storage';
import axios from 'axios';


const useRefreshToken = () => {
  const refresh = async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const { data } = await axios.get("https://api.cslfreightgh.com/auth/client/refresh", {
      headers: {
        'Authorization': `Refresh ${refreshToken}`
      }
    });

    await saveTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
