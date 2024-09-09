import { NextPage } from 'next'
import { useEffect, useState } from 'react'

// Material-UI
import { Avatar, Grid, useTheme } from '@mui/material'
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
import { UserDataType } from 'src/contexts/types'
import { toFullName } from 'src/utils'

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
  const [user, setUser] = useState<UserDataType | null>(null)

  // ** Router
  const router = useRouter()

  // theme
  const theme = useTheme()

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
    setValue,
    formState: { errors },
    reset
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

  const fetchGetAuthMe = async () => {
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        const data = response?.data
        console.log(data)

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

        setUser(response.data)
        setLoading(false)
      })
      .catch(() => {
        removeLocalUserData()
        setUser(null)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [])

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
                      <span>{t('Change Avatar')}</span>
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
                        disabled
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
                      label='Address'
                      autoComplete='address'
                      placeholder={t('enter_your_address')}
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
                      placeholder={t('enter_your_city')}
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
                      label={t('Phone_number')}
                      autoComplete='phoneNumber'
                      autoFocus
                      placeholder={t('Enter_your_phone_number')}
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
