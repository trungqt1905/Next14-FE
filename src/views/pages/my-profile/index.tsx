import { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'

// Material-UI
import { Avatar, Grid, IconButton, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// custom components
import IconifyIcon from 'src/components/Icon'

// React Hook Form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// images
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/components/core/text-field'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'
import { getAuthMe } from 'src/services/auth'
import { removeLocalUserData } from 'src/helpers/storage'
import { useRouter } from 'next/router'

// types
import { UserDataType } from 'src/contexts/types'

import { convertBase64, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { ROUTE_CONFIG } from 'src/configs/route'
import { resetIntialState } from 'src/stores/apps/auth'
import { updateAuthMeAsync } from 'src/stores/apps/auth/action'
import FallbackSpinner from 'src/components/fall-back'

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
  const { t } = useTranslation()

  // Hooks
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')

  const [user, setUser] = useState<UserDataType | null>(null)

  // ** Router
  const router = useRouter()

  // theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorUpdateMe, message, isSuccessUpdateMe } = useSelector((state: RootState) => state.auth)

  const schema = yup.object().shape({
    email: yup.string().email().required("Email can't be empty."),
    role: yup.string().email().required("Role can't be empty."),
    fullName: yup.string().required("Full name can't be empty."),
    phoneNumber: yup.string().required("Phone number can't be empty.").min(8, 'The phone number is min 8 number'),
    city: yup.string().required("City can't be empty."),
    address: yup.string().required("Address can't be empty.")
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
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onsubmit = (data: any) => {
    console.log('data', data)
  }

  const fetchGetAuthMe = async () => {
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        const data = response?.data

        if (data) {
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role?.name,
            fullName: toFullName(data?.firstName, data?.lastName, data?.middleName, 'en')
          })
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [])

  useEffect(() => {
    console.log('1')
    if (message) {
      if (isSuccessUpdateMe) {
        toast.success(message)
        fetchGetAuthMe()
      } else if (isErrorUpdateMe) {
        toast.error(message)
      }
      dispatch(resetIntialState())
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, message])

  const handleSubmitUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
    console.log(base64)
  }

  const handleDeleteAvatar = () => {
    setAvatar('')
  }

  return (
    <>
      {isLoading || (loading && <FallbackSpinner />)}{' '}
      <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
        <Grid container spacing={0} sx={{ padding: 0 }}>
          <Grid item xs={12} sm={6} sx={{ padding: 2 }}>
            <Grid item xs={12} sm={12}>
              <Box>
                {avatar ? (
                  <Box>
                    {' '}
                    <Box sx={{ position: 'relative' }}>
                      <Avatar src={avatar} sx={{ width: 100, height: 100, margin: 'auto' }}>
                        <IconifyIcon icon='mdi:account' width={50} height={50} opacity={0.6} />
                      </Avatar>
                      <IconButton
                        sx={{
                          width: 25,
                          height: 25,
                          position: 'absolute',
                          top: 0,
                          right: '40%',
                          backgroundColor: theme.palette.primary.main,
                          opacity: 0.6,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            opacity: 0.7
                          }
                        }}
                        onClick={handleDeleteAvatar}
                      >
                        <IconifyIcon icon='mdi:close' width={16} height={16} />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Avatar sx={{ width: 100, height: 100, margin: 'auto' }}>
                    <IconifyIcon icon='mdi:account' width={50} height={50} opacity={0.6} />
                  </Avatar>
                )}

                <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
                  <WrapperFileUpload
                    uploadFunc={handleSubmitUploadAvatar}
                    objectAcceptFile={{
                      'image/*': ['.jpg', '.jpeg', '.png']
                    }}
                  >
                    <Button variant='tonal'>
                      <IconifyIcon icon='mdi:camera' width={16} height={16} opacity={0.6} />
                      {avatar ? <span>{'Change Avatar'}</span> : <span>{'Upload Avatar'}</span>}
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
                        disabled
                        fullWidth
                        required
                        label='Email'
                        autoComplete='email'
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
                        autoFocus
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        disabled
                      />
                    )}
                    name='role'
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={6} sx={{ padding: 0 }} spacing={0} marginTop={0}>
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
                      label={t('Address')}
                      autoComplete='address'
                      placeholder={t('Enter your adress')}
                      autoFocus
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
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
                      label={t('City')}
                      autoComplete='city'
                      placeholder={t('Enter your city')}
                      autoFocus
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
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
                      label={t('Phone number')}
                      autoComplete='phoneNumber'
                      autoFocus
                      placeholder={t('Enter your phone number')}
                      onChange={e => {
                        const value = e.target.value
                        if (value.match(/^\d+$/) || value === '') {
                          onChange(value)
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 10
                      }}
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
                      label={t('Fullname')}
                      autoComplete='fullName'
                      placeholder={t('Enter your full name')}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Button
              type='submit'
              variant='contained'
              sx={{
                mt: 3,
                mb: 2,
                opacity: '0.7',
                '&:hover': {
                  opacity: '0.9'
                }
              }}
            >
              Change Profile
            </Button>
          </Box>
        </Grid>
      </form>
    </>
  )
}

export default MyProfilePage
