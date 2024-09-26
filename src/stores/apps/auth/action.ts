// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { UserDataType } from 'src/contexts/types'
import { registerAuth, updateAuthMe } from 'src/services/auth'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any, { rejectWithValue }) => {
  try {
    const response = await registerAuth(data)

    return response
  } catch (error: any) {
    return rejectWithValue({
      data: null,
      message: error.response.data.message,
      typeError: error.response.data.typeError
    })
  }
}) //Action async là những action liên quan đến api của mình

export const updateAuthMeAsync = createAsyncThunk('auth/updateAuthMe', async (data: any) => {
  try {
    const response = await updateAuthMe(data)

    return response
  } catch (error: any) {
    return {
      data: null,
      message: error.response.data.message,
      typeError: error.response.data.typeError
    }
  }
}) //Action async là những action liên quan đến api của mình
