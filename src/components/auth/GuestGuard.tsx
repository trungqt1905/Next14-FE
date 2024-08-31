// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  // Thành phần GuestGuard bảo vệ các trang chỉ dành cho khách.
  const { children, fallback } = props

  const router = useRouter()

  const authContext = useAuth() // Hook để lấy thông tin xác thực của người dùng

  useEffect(() => {
    if (!router.isReady) {
      return
    } // Kiểm tra xem router đã sẵn sàng chưa, nếu chưa thì return
    if (window.localStorage.getItem('ACCESS_TOKEN') && window.localStorage.getItem('USER_DATA')) {
      router.replace('/')
    } // Nếu có token truy cập dữ liệu người dùng trong localstorage chuyển hướng về trang chủ
  }, [router.route])

  if (authContext.loading || (!authContext.loading && authContext.user !== null)) {
    return fallback
  } // Hiển thị fallback nếu đang tải hoặc người dùng đã đăng nhập, ngược lại hiển thị các thành phần con.

  return <>{children}</>
}

export default GuestGuard
