// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { UserDataType } from 'src/contexts/types'
import { registerAuthAsync } from './action'

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
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetIntialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.typeError = ''
      state.message = ''
    }
  },
  extraReducers: builder => {
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true
    }) //Đang chờ
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action.payload?.data?.email // !! true nếu email tồn tồn tại - ngược lại
      state.isError = !action.payload?.data?.isError // message nếu tồn tại - ngược lại
      state.message = action.payload?.message
      state.typeError = action.payload?.typeError
    }) //Thành công
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    }) //Thất bại
  }
})

export const { resetIntialState } = authSlice.actions
export default authSlice.reducer
