import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from 'src/configs/auth'

export const setLocalUserData = (user: string, access_token: string, refresh_token: string) => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.setItem(USER_DATA, user),
      accessToken: window.localStorage.setItem(ACCESS_TOKEN, access_token),
      refreshToken: window.localStorage.setItem(REFRESH_TOKEN, refresh_token)
    }
  }
} // Dùng để thêm ra thông tin user từ localStorage

export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.getItem(USER_DATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
  }

  return {
    userData: null,
    accessToken: null,
    refreshToken: null
  }
} // Dùng để lấy thông tin user trong localStorage

export const removeLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.removeItem(USER_DATA),
      accessToken: window.localStorage.removeItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.removeItem(REFRESH_TOKEN)
    }
  }
} // Dùng để xóa thông tin user khỏi localStorage
