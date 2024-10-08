// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { UserDataType } from 'src/contexts/types'
import { registerAuthAsync, updateAuthMeAsync } from './action'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

const initialState = {
  // ** Register Auth
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',

  // ** Auth Me
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  typeErrorUpdateMe: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetIntialState: state => {
      //Reset register
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''

      // Reset update me
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true
    }
  },
  extraReducers: builder => {
    // ** Register Auth
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true
    }) //Đang chờ
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action.payload?.data?.email // !! true nếu email tồn tồn tại - ngược lại
      state.isError = !action.payload?.data?.isError // message nếu tồn tại - ngược lại
      state.message = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    })

    // ** Register Auth

    // ** Update Auth
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      state.isLoading = true
    }) //Đang chờ
    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.message = action.payload?.message
      state.isSuccessUpdateMe = !!action.payload?.data?.email // !! true nếu email tồn tồn tại - ngược lại
      state.isErrorUpdateMe = !action.payload?.data?.isError // message nếu tồn tại - ngược lại
      state.typeErrorUpdateMe = action.payload?.typeError
    }) //Thành công
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.message = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = false
      state.typeErrorUpdateMe = ''
    }) //Thất bại
    // ** Update Auth
  }
})

export const { resetIntialState } = authSlice.actions
export default authSlice.reducer
