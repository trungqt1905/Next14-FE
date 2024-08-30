// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()
  console.log(router)

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (
      authContext.user === null &&
      window.localStorage.getItem('accessToken') === null &&
      window.localStorage.getItem('userData') === null
    ) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath } // Đang ở product thì chuyển qua login,
          // sau khi login xong sẽ chuyển lại product
        })
      } else {
        router.replace('/login')
      }
      authContext.setUser(null)
    }
  }, [authContext, router])

  if (authContext.loading) {
    return fallback
  } // nghĩa là : nếu đang loading thì hiển thị fallback (loading) ra

  return <>{children}</>
}

export default AuthGuard
