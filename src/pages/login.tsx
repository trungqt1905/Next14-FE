import React, { ReactNode } from 'react'
import { NextPage } from 'next'
import LoginPage from 'src/views/pages/login'
import BlankLayout from 'src/views/layouts/BlankLayout'

type TProps = {}

const Login: NextPage<TProps> = () => {
  return <LoginPage />
}

export default Login

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Login.guestGuard = true
