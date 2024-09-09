export type TLoginAuth = {
  email: string
  password: string
}

export type TRegisterAuth = {
  email: string
  password: string
}

export type TUpdateAuthMe = {
  
}

export type TChangePassword = {
  currentPassword: string
  newPassword: string
}

export type TUserDataType = {
  firstName: string
  lastName: string
  middleName: string
  email: string
  password: string
  role: string
  phoneNumber: string
  address: string
  avatar: string
  city: string
  status: 1
  userType: 3
  addresses: [
    {
      firstName: string
      lastName: string
      middleName: string
      phoneNumber: string
      price: number
      discount: number
      product: string
    }
  ]
}
