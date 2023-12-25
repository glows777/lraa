'use client'

import { Loader2 } from 'lucide-react'
import { FC } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { toast } from '@/components/ui/use-toast'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFRendererProps {
  url: string
}

const PDFRenderer: FC<PDFRendererProps> = ({ url }) => {
  return (
    <div className=" w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className=" h-14 w-full border-b border-neutral-200 flex items-center justify-between px-2">
        <div>tool bar</div>
      </div>

      <div className=" flex-1 w-full max-h-screen">
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
          file={url}
          className=' max-h-full'
        >
          <Page 
            pageIndex={0}
          />
        </Document>
      </div>
    </div>
  )
}

export default PDFRenderer
