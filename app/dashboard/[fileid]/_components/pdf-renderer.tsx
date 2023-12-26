'use client'

import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { FC, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useResizeDetector } from 'react-resize-detector'

import { toast } from '@/components/ui/use-toast'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFRendererProps {
  url: string
}

const PDFRenderer: FC<PDFRendererProps> = ({ url }) => {
  const { width, ref } = useResizeDetector()
  const [numPages, setNumPages] = useState<number>()
  const [currPage, setCurrPage] = useState(1)

  const customPageValidator = z.object({
    page: z
      .string()
      .refine((page) => Number(page) > 0 && Number(page) <= numPages!),
  })

  type CustomPageValidator = z.infer<typeof customPageValidator>

  const {
    setValue,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<CustomPageValidator>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(customPageValidator),
  })

  const handlePageSubmit = ({ page }: CustomPageValidator) => {
    setCurrPage(Number(page))
    setValue('page', String(page))
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(handlePageSubmit)()
    }
  }

  const handleTurnToPreviousPage = () => {
    setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
    setValue('page', String(currPage - 1))
  }
  const handleTurnToNextPage = () => {
    setCurrPage((prev) => (prev + 1 > numPages! ? numPages! : prev + 1))
    setValue('page', String(currPage + 1))
  }
  return (
    <div className=" w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className=" h-14 w-full border-b border-neutral-200 flex items-center justify-between px-2">
        <div className=" flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            variant="ghost"
            aria-label="previous page"
            onClick={handleTurnToPreviousPage}
          >
            <ChevronUp className=" h-4 w-4" />
          </Button>

          <div className=" flex items-center gap-1.5">
            <Input
              className={cn(
                ' w-12 h-8',
                // * remove inner border when focused on input
                'focus-visible:border-none',
                errors.page && ' focus-visible:ring-red-500'
              )}
              {...register('page')}
              onKeyDown={handleKeydown}
            />
            <p className=" text-sm text-neutral-700 space-x-2">
              <span>/</span>
              <span>{numPages ? numPages : 'x'}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            aria-label="next page"
            disabled={numPages === undefined || currPage === numPages}
            onClick={handleTurnToNextPage}
          >
            <ChevronDown className=" h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className=" flex-1 w-full max-h-screen">
        <div className=" h-[calc(100vh-10rem)] overflow-scroll">
          <div ref={ref}>
            <Document
              loading={
                <div className=" flex justify-center">
                  <Loader2 className=" my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later',
                  variant: 'destructive',
                })
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className=" max-h-full"
            >
              <Page pageIndex={currPage - 1} width={width ? width : 1} />
            </Document>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFRenderer
