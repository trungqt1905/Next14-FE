// ** Next Imports
import { useRouter } from 'next/router'

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Config
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'

// ** Helper
import { removeLocalUserData } from 'src/helpers/storage'

import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  // Props
  const { children, fallback } = props

  // auth
  const authContext = useAuth()

  //router
  const router = useRouter()


  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (
      authContext.user === null &&
      window.localStorage.getItem(ACCESS_TOKEN) === null &&
      window.localStorage.getItem(USER_DATA) === null
    ) {
      if (router.asPath !== '/' && router.asPath !== '/login') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath } // Đang ở product thì chuyển qua login,
          // sau khi login xong sẽ chuyển lại product
        })
      } else {
        router.replace('/login')
      }
      authContext.setUser(null)
      removeLocalUserData()
    }
  }, [authContext, router])

  if (authContext.loading) {
    return fallback
  } // nghĩa là : nếu đang loading thì hiển thị fallback (loading) ra

  return <>{children}</>
}

export default AuthGuard
