import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from 'src/configs/auth'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  return {
    userData: window.localStorage.setItem(USER_DATA, userData),
    accessToken: window.localStorage.setItem(ACCESS_TOKEN, accessToken),
    refreshToken: window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
} // Dùng để thêm ra thông tin user từ localStorage

export const getLocalUserData = () => {
  return {
    userData: window.localStorage.getItem(USER_DATA),
    accessToken: window.localStorage.getItem(ACCESS_TOKEN),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
  }
} // Dùng để lấy thông tin user trong localStorage

export const removeLocalUserData = () => {
  return {
    userData: window.localStorage.removeItem(USER_DATA),
    accessToken: window.localStorage.removeItem(ACCESS_TOKEN),
    refreshToken: window.localStorage.removeItem(REFRESH_TOKEN)
  }
} // Dùng để xóa thông tin user khỏi localStorage
