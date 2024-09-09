import axios from 'axios'

// ** config
import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

// ** types
import { TLoginAuth, TRegisterAuth, TUpdateAuthMe } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  try {
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/logout`)

    return res.data
  } catch (error) {
    return null
  }
}

export const registerAuth = async (data: TRegisterAuth) => {
  try {
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error: any) {
    return {
      data: null,
      message: error.response.data.message,
      typeError: error.response.data.typeError
    }
  }
}

export const getAuthMe = async () => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.AUTH.INDEX}/me`)

    return res.data
  } catch (error: any) {
    return {
      data: null,
      message: error.response.data.message,
      typeError: error.response.data.typeError
    }
  }
}

export const updateAuthMe = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${CONFIG_API.AUTH.INDEX}/me`, data)

    return res.data
  } catch (error: any) {
    return {
      data: null,
      message: error.response.data.message,
      typeError: error.response.data.typeError
    }
  }
}
