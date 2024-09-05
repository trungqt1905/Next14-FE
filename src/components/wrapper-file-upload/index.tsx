import React from 'react'
import { useDropzone } from 'react-dropzone'

interface TProps {
  children: React.ReactNode
  uploadFunc: (files: File) => void
  objectAcceptFile?: Record<string, string[]>
}

function WrapperFileUpload(props: TProps) {
  const { children, uploadFunc, objectAcceptFile } = props
  const { getRootProps, getInputProps } = useDropzone({
    accept: objectAcceptFile ? objectAcceptFile : {},
    onDrop: acceptedFiles => {
      uploadFunc(acceptedFiles[0])
    }
  })

  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone disabled' })}>
        <input {...getInputProps()} />
        {children}
      </div>
    </section>
  )
}
export default WrapperFileUpload
