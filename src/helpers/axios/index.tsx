import axios from 'axios'
import { BASE_URL, CONFIG_API } from 'src/configs/api'
import { getLocalUserData, removeLocalUserData, setLocalUserData } from '../storage'
import { jwtDecode } from 'jwt-decode'
import { NextRouter, useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

type TAxiosInterceptor = {
  children: ReactNode
}

const instanceAxios = axios.create({ baseURL: BASE_URL })

const handleRedirectToLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath } 

      // Đang ở product thì chuyển qua login,
      // sau khi login xong sẽ chuyển lại product
    })
  } else {
    // router.replace('/login')
    setUser(null)
    removeLocalUserData()
  }
}

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const { accessToken, refreshToken } = getLocalUserData()
  const router = useRouter()
  const { setUser } = useAuth()

  instanceAxios.interceptors.request.use(async config => {
    if (accessToken) {
      const decodedAccessToken: any = jwtDecode(accessToken)

      if (decodedAccessToken?.exp * 1000 > Date.now()) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      } else {
        if (refreshToken) {
          const decodedRefreshToken: any = jwtDecode(refreshToken)
          if (decodedRefreshToken.exp * 1000 > Date.now()) {
            await axios
              .post(
                `${CONFIG_API.AUTH.INDEX}/refresh-token`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`
                  }
                }
              )
              .then(response => {
                const newAccessToken = response?.data.data?.access_token
                if (newAccessToken) {
                  config.headers['Authorization'] = `Bearer ${newAccessToken}`
                } else {
                  handleRedirectToLogin(router, setUser)
                }
              })
              .catch(() => {
                handleRedirectToLogin(router, setUser)
              })
          } else {
            handleRedirectToLogin(router, setUser)
          }
        } else {
          handleRedirectToLogin(router, setUser)
        }
      }
    } else {
      handleRedirectToLogin(router, setUser)
    }

    return config
  })

  instanceAxios.interceptors.response.use(response => {
    return response
  })

  return <>{children}</>
}

export default instanceAxios
export { AxiosInterceptor }
