import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

// Material-UI
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Avatar, Grid, Icon, IconButton, InputAdornment, useTheme } from '@mui/material'

// custom components
import IconifyIcon from 'src/components/Icon'

// React Hook Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// images
import Image from 'next/image'
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'
import Link from 'next/link'
import CustomTextField from 'src/components/core/text-field'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

type TProps = {}

type TDefaultValues = {
  email: string
  role: string
  address: string
  city: string
  phoneNumber: string
  fullName: string
}
const MyProfilePage: NextPage<TProps> = () => {
  const { user } = useAuth()

  const { t } = useTranslation()

  // theme
  const theme = useTheme()

  const schema = yup.object().shape({
    email: yup.string().email().required("Email can't be empty."),
    role: yup.string().email().required("Role can't be empty."),
    address: yup.string().required("Address can't be empty."),
    city: yup.string().required("City can't be empty."),
    phoneNumber: yup.string().required("Phone number can't be empty."),
    fullName: yup.string().required("Full name can't be empty.")
  })

  const defaultValues: TDefaultValues = {
    email: '',
    role: '',
    address: '',
    city: '',
    fullName: '',
    phoneNumber: ''
  }
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const onsubmit = (data: {
    email: string
    role: string
    address: string
    city: string
    phoneNumber: string
    fullName: string
  }) => {
    console.log(data)
  }

  useEffect(() => {
    if (user) {
      setValue('email', user?.data?.email)
      setValue('role', user?.data?.role?.name)
      setValue('address', user?.data?.addresses[0]?.address)
      setValue('city', user?.data?.addresses[0]?.city)
      setValue(
        'fullName',
        `${user?.data?.addresses[0]?.firstName ?? ''} ${user?.data?.addresses[0]?.middleName ?? ''} ${user?.data?.addresses[0]?.lastName ?? ''}`
      )
      setValue('phoneNumber', user?.data?.addresses[0]?.phoneNumber)
    }
  }, [user, setValue])

  const handleSubmitUploadAvatar = (file: File) => {
    console.log(file)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
        <Grid container spacing={0} sx={{ padding: 0 }}>
          <Grid item xs={12} sm={6} sx={{ padding: 2 }}>
            <Grid item xs={12} sm={12}>
              <Box>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: 'auto',
                    marginTop: 8
                  }}
                >
                  <IconifyIcon
                    icon='mdi:account-circle'
                    color={theme.palette.primary.contrastText}
                    width={100}
                    height={100}
                  />
                </Avatar>
                <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
                  <WrapperFileUpload
                    uploadFunc={handleSubmitUploadAvatar}
                    objectAcceptFile={{
                      'image/*': ['.jpg', '.jpeg', '.png']
                    }}
                  >
                    <Button variant='tonal'>
                      <IconifyIcon icon='mdi:camera' width={16} height={16} opacity={0.6} />
                      <span>{t('Change_avatar')}</span>
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Box>
            </Grid>
            <Grid container spacing={4} sx={{ padding: 0 }} direction='row'>
              <Grid item xs={12} sm={6}>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        margin='normal'
                        fullWidth
                        required
                        label='Email'
                        autoComplete='email'
                        placeholder={t('Enter_your_email')}
                        autoFocus
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={Boolean(errors.email)}
                        helperText={errors?.email?.message}
                      />
                    )}
                    name='email'
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        margin='normal'
                        fullWidth
                        required
                        label='Role'
                        autoComplete='role'
                        placeholder={t('role')}
                        autoFocus
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                    name='role'
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container xs={12} sm={6} sx={{ padding: 0 }} spacing={4} marginTop={15}>
            <Grid item xs={12} sm={6} sx={{ padding: 0 }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      margin='normal'
                      fullWidth
                      required
                      label='Address'
                      autoComplete='address'
                      placeholder={t('enter_your_address')}
                      autoFocus
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={!!errors.address}
                      helperText={errors?.address?.message}
                    />
                  )}
                  name='address'
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      margin='normal'
                      fullWidth
                      required
                      label={t('City')}
                      autoComplete='city'
                      placeholder={t('enter_your_city')}
                      autoFocus
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={!!errors.city}
                      helperText={errors?.city?.message}
                    />
                  )}
                  name='city'
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      margin='normal'
                      fullWidth
                      required
                      label={t('Phone_number')}
                      autoComplete='phoneNumber'
                      autoFocus
                      placeholder={t('Enter_your_phone_number')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={!!errors.phoneNumber}
                      helperText={errors?.phoneNumber?.message}
                    />
                  )}
                  name='phoneNumber'
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      margin='normal'
                      fullWidth
                      required
                      label={t('Full_name')}
                      autoComplete='fullName'
                      placeholder={t('Enter_your_full_name')}
                      autoFocus
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={!!errors.fullName}
                      helperText={errors?.fullName?.message}
                    />
                  )}
                  name='fullName'
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Button fullWidth type='submit' variant='outlined' sx={{ mt: 3, mb: 2 }}>
          Change Profile
        </Button>
      </form>
    </>
  )
}

export default MyProfilePage
