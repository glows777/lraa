'use client'

import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Document, Page, pdfjs } from 'react-pdf'
import { useResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import PDFFullScreen from './pdf-full-screen'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFRendererProps {
  url: string
}

const PDFRenderer: FC<PDFRendererProps> = ({ url }) => {
  const { width, ref } = useResizeDetector()
  const [numPages, setNumPages] = useState<number>()
  const [currPage, setCurrPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [renderedScale, setRenderedScale] = useState<number | undefined>()
  const isLoading = renderedScale !== scale

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

        <div className=" space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className=" gap-1.5" aria-label="zoom" variant="ghost">
                <Search className=" w-4 h-4" />
                {scale * 100}%
                <ChevronDown className=" h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* make the text center */}
              <DropdownMenuItem
                onSelect={() => setScale(1)}
                className=" flex justify-center"
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(1.5)}
                className=" flex justify-center"
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(2)}
                className=" flex justify-center"
              >
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(2.5)}
                className=" flex justify-center"
              >
                250%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(3)}
                className=" flex justify-center"
              >
                300%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            variant="ghost"
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className=" h-4 w-4" />
          </Button>

          <PDFFullScreen fileUrl={url} />
        </div>
      </div>

      <div className=" flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className=" h-[calc(100vh-10rem)]">
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
              {/*
               * when changing the zoom level, this will ensure that
               * the user is informed about the ongoing rendering process
               * and improves the overall user experience
               * by providing a smooth transition between different scales of the PDF.
               */}
              {isLoading && renderedScale ? (
                <Page
                  pageIndex={currPage - 1}
                  scale={scale}
                  width={width ? width : 1}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null}

              {/*
               * When isLoading is true, it renders a Page component with the new scale
               * but keeps it hidden (className={cn(isLoading && ' hidden')})
               * until it's fully rendered.
               * Once the page is successfully loaded at the new scale (onLoadSuccess)
               * setRenderedScale is called to update renderedScale to match the current scale
               * and make isLoading false
               * This triggers the re-render of the component, now showing the page at the new scale.
               */}
              <Page
                className={cn(isLoading && ' hidden')}
                pageIndex={currPage - 1}
                scale={scale}
                width={width ? width : 1}
                rotate={rotation}
                key={'@' + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onLoadSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
}

export default PDFRenderer
