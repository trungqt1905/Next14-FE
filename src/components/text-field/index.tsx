// ** MUI Imports
import { styled, TextField, TextFieldProps } from '@mui/material'

const TextFieldStyle = styled(TextField)<TextFieldProps>(({ theme }) => {
  return {
    '& .MuiInputlabel-root': {
      transcode: 'none',
      lineHeight: 1.2,
      position: 'relative',
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.body2.fontSize
    },
    '& .MuiInputBase-root': {
      borderRadius: 8,
      backgroundColor: 'transparent !important',
      boder: `1px solid rgba${theme.palette.customColors.main}, 0.2`,
      transition: theme.transitions.create(['border-color', 'box-shadow'], {
        duration: theme.transitions.duration.shorter
      }),
      '&:before , &:after': {
        display: 'none'
      },
      '.MuiInputBase-root': {
        padding: '8px 10px'
      }
    }
  }
})

const CustomTextField = (props: TextFieldProps) => {
  const { InputLabelProps, size = 'small', variant = 'filled', ...rest } = props

  return <TextFieldStyle size={size} variant={variant} InputLabelProps={{ ...InputLabelProps }} {...rest} />
}

export default CustomTextField
