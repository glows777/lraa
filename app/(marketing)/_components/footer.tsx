import Link from 'next/link'
import BorderImage from './border-image'

const Footer = () => {
  return (
    <div className=" mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
      <div className=" mb-12 px-6 lg:px-8">
        <div className=" mx-auto max-w-2xl sm:text-center">
          <h2 className=" mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
            Start chatting in minutes
          </h2>
          <p className=" mt-4 text-lg text-gray-600">
            Chatting to your PDF files has never been easier than with lraa
          </p>
        </div>
      </div>

      <ol className=" my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
        <li className=" md:flex-1">
          <div className=" flex flex-col space-y-2 border-l-4 border-neutral-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className=" text-sm font-medium text-blue-600">Step 1</span>
            <span className=" text-xl font-semibold">
              Sign up for an account
            </span>
            <span className=" mt-2 text-neutral-700">
              Either starting out a free or choose our
              <Link
                href="/pricing"
                className=" text-blue-700 underline underline-offset-2"
              >
                pro plan
              </Link>
              .
            </span>
          </div>
        </li>
        <li className=" md:flex-1">
          <div className=" flex flex-col space-y-2 border-l-4 border-neutral-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className=" text-sm font-medium text-blue-600">Step 2</span>
            <span className=" text-xl font-semibold">Upload your PDF file</span>
            <span className=" mt-2 text-neutral-700">
              We&apos;ll process your file and make it ready for you to chat
              with.
            </span>
          </div>
        </li>
        <li className=" md:flex-1">
          <div className=" flex flex-col space-y-2 border-l-4 border-neutral-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className=" text-sm font-medium text-blue-600">Step 3</span>
            <span className=" text-xl font-semibold">
              Start asking questions
            </span>
            <span className=" mt-2 text-neutral-700">
              It&apos;s that simple. Try out Quill today - it really takes less
              than a minute.
            </span>
          </div>
        </li>
      </ol>
      <BorderImage
        src="/file-upload-preview.jpg"
        alt="uploading preview"
        width={1419}
        height={732}
        quality={100}
      />
    </div>
  )
}

export default Footer
