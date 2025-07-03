import useAuth from './useAuth'
import axios from 'axios'

const useRefreshToken = () => {
    const {auth, dispatch} = useAuth()

    const refresh = async ()=>{
        const response = await axios.get(`"https://api.cslfrieghtonline.com/auth/client/refresh`, {
            headers: {
                'Authorization': `Refresh ${auth?.backendTokens.refreshToken}`
            }
        })

        dispatch({type: "ADD_AUTH", payload:{
            id: auth?.id,
            email: auth!.email,
            backendTokens: {
                accessToken: response.data?.accessToken,
                refreshToken: auth!.backendTokens.refreshToken
            }
        }})
        
        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken
