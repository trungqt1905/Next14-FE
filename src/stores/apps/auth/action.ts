// ** Redux Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

// ** Axios Imports
import { registerAuth } from 'src/services/auth'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Add User
export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)

  return response
}) //Action async là những action liên quan đến api của mình
