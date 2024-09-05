import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default MyProfile

MyProfile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
MyProfile.guestGuard = true
