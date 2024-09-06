// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, ErrCallbackType, LoginParams, RegisterParams, UserDataType } from './types'

import { loginAuth, logoutAuth, registerAuth } from 'src/services/auth'
import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import { removeLocalUserData, setLocalUserData } from 'src/helpers/storage'
import instanceAxios from 'src/helpers/axios'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      // Lấy token truy cập từ localStorage
      // bằng khóa được định nghĩa trong authConfig.
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        // Kiểm tra xem token có tồn tại hay không. Nếu có, thực hiện các bước tiếp theo để xác thực người dùng.
        setLoading(true)
        await instanceAxios
          .get(CONFIG_API.AUTH.AUTH_ME)
          .then(async response => {
            setUser(response.data)
            setLoading(false)
          }) // Nếu yêu cầu thành công,
          // cập nhật trạng thái người dùng (setUser(response.data)) và đặt trạng thái loading thành false.
          .catch(() => {
            // Nếu yêu cầu thất bại, xóa dữ liệu người dùng khỏi localStorage
            // (removeLocalUserData), đặt trạng thái người dùng thành null,
            // đặt trạng thái loading thành false, và chuyển hướng đến trang đăng nhập nếu
            // không phải đang ở trang đăng nhập.
            removeLocalUserData()
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('/login')) {
              router.push('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setLoading(true)
    loginAuth({ email: params.email, password: params.password })
      .then(async response => {
        setLoading(false)

        // Nếu rememberMe là true, lưu token vào localStorage
        // RememberMe is true, save token to localStorage
        params.rememberMe
          ? setLocalUserData(
              JSON.stringify(response.data.user),
              response.data.access_token,
              response.data.refresh_token
            )
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })

      .catch(err => {
        setLoading(false)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    logoutAuth()
      .then(() => {
        removeLocalUserData()
        setUser(null)
        router.push('/login')
      })
      .catch(() => {
        removeLocalUserData()
        setUser(null)
        router.push('/login')
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
