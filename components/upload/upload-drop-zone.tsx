'use client'

import { trpc } from '@/app/_trpc/client'
import { useUploadThing } from '@/lib/use-uploadthing'
import { Cloud, File as FileIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Progress } from '../ui/progress'
import { toast } from '../ui/use-toast'

const UploadDropzone = () => {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { startUpload } = useUploadThing('pdfUploader')

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file?.id}`)
    },
    retry: true,
    retryDelay: 500
  })

  const startSimulatedProgress = () => {
    setUploadProgress(0)

    const interval = setInterval(
      () =>
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        }),
      500
    )
    return interval
  }
  const cancel = (interval: ReturnType<typeof startSimulatedProgress>) => {
    setUploadProgress(0)
    setIsUploading(false)
    clearInterval(interval)
  }
  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true)
    const interval = startSimulatedProgress()
    const files = await startUpload(acceptedFiles)

    if (!files) {
      cancel(interval)
      return toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
    const [file] = files
    const key = file.key
    if (!key) {
      cancel(interval)
      return toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }

    clearInterval(interval)
    setUploadProgress(100)
    startPolling({ key })
  }
  return (
    <Dropzone onDrop={onDrop}>
      {({ getInputProps, getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className=" border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className=" flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className=" flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className=" flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className=" h-6 w-6 text-neutral-500 mb-2" />
                <p className=" mb-2 text-sm text-neutral-700">
                  <span className=" font-semibold">Click to upload</span> or
                  drag and drop
                </p>
                <p className=" text-xs text-neutral-500">PDF (up to 4 MB)</p>
              </div>

              {acceptedFiles.length && acceptedFiles[0] ? (
                <div className=" max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-neutral-200 divide-x divide-neutral-200">
                  <div className=" px-3 py-2 h-full grid place-items-center">
                    <FileIcon className=" h-4 w-4 text-blue-500" />
                  </div>
                  <div className=" px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className=" w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    className=" h-1 w-full bg-neutral-200"
                    value={uploadProgress}
                  />
                  {uploadProgress === 100 ? (
                    <div className=" flex gap-1 items-center justify-center text-sm text-neutral-700 text-center pt-2">
                      <Loader2 className=" h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className=" hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export default UploadDropzone
