import React from 'react'
import { useDropzone } from 'react-dropzone'

// interface file {
//   path: string
//   lastModified: number
//   lastModifiedDate: Date
//   name: string
//   size: number
//   type: string
//   webkitRelativePath: string
// }

interface Props {
  onDropAccepted: (files: File[]) => void
}

export const ReactDropZone = ({ onDropAccepted }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    maxFiles: 1,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p className="file-input file-input-bordered file-input-primary w-full max-w-xs">
          Drag n drop some files here, or click to select files
        </p>
      )}
    </div>
  )
}
