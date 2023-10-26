'use client'
import React from 'react'
import { trpc } from './_trpc/client'
import Image from 'next/image'

type ChatMessageType = {
  sender: 'user' | 'server'
  message: string
}

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [userMessage, setUserMessage] = React.useState<string>('')
  const [file, setFile] = React.useState<string>('')
  const [chat, setChat] = React.useState<ChatMessageType[]>([
    {
      sender: 'server',
      message: 'Please ask a question',
    },
  ])
  const containerRef = React.useRef<HTMLDivElement>(null)
  const ask = trpc.bot.ask.useMutation()

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [chat])

  const updateChat = (message: ChatMessageType) => {
    setChat((prevChat) => [...prevChat, message])
  }

  const sendMessageToServer = async () => {
    if (!userMessage || loading) {
      return
    }
    setLoading(true)
    updateChat({ sender: 'user', message: userMessage })
    setUserMessage('')

    const response = await ask.mutateAsync(userMessage)
    const serverMessage = response?.content

    if (!serverMessage) {
      setLoading(false)
      throw new Error('Error: No message from server!')
    }

    updateChat({
      sender: 'server',
      message: serverMessage,
    })

    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center relative">
          <div className="flex flex-col w-full gap-4 h-screen pt-8 pb-28 ">
            <div
              id="chat"
              ref={containerRef}
              className="overflow-y-scroll px-8"
            >
              {chat.map((item, index) => (
                <ChatComponent key={index} {...item} />
              ))}
              {loading ? (
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full bg-red">
                      <Image src="/next.svg" width={100} height={100} alt="" />
                    </div>
                  </div>
                  <div className="chat-bubble chat-bubble-primary">
                    <span className="loading loading-dots loading-xs"></span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-auto w-full bg-base-100 bottom-0 left-0 py-4 absolute border-t-2">
              <div className="px-8 flex flex-row gap-2 ">
                <input
                  value={userMessage}
                  placeholder="message..."
                  className="input input-bordered w-full"
                  name="Message"
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(event) => {
                    if (loading) {
                      return
                    }
                    if (event.key === 'Enter') {
                      sendMessageToServer()
                    }
                  }}
                />
                <button
                  className={`btn ${loading && 'opacity-60 cursor-wait'}`}
                  disabled={loading}
                  onClick={() => sendMessageToServer()}
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side bg-base-200 p-4">
          <ul className="menu w-80 min-h-fulltext-base-content">
            {/* List uploaded files */}
            {/* <li>File.pdf</li> */}
          </ul>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebasr"
              className="drawer-overlay"
            ></label>
            <FileInput
              value={file}
              disabled={loading}
              onChange={async (e) => {
                e.preventDefault()
                setFile(e.target.value)
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  const data = new FormData()
                  data.set('file', file)

                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: data,
                  })
                  // handle the error
                  if (!res.ok) throw new Error(await res.text())
                } catch (e) {
                  // Handle errors here
                  console.error(e)
                }
                setFile('')
              }}
            />
            {/* <button
              className="btn btn-primary"
              onClick={() => {
                addPdf.mutate(null)
              }}
            >
              Add pdf
            </button> */}
          </div>
        </div>
      </div>
    </main>
  )
}

const ChatComponent = (chat: ChatMessageType) => {
  const isServer = chat.sender === 'server'
  return (
    <div className={`chat ${isServer ? 'chat-start' : 'chat-end'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full bg-red">
          <Image
            src={isServer ? '/next.svg' : '/vercel.svg'}
            width={100}
            height={100}
            alt=""
          />
        </div>
      </div>
      <div className="chat-header">{chat.sender}</div>
      <div
        className={`chat-bubble ${
          isServer ? 'chat-bubble-primary' : 'chat-bubble-secondary'
        } `}
      >
        {chat.message}
      </div>
    </div>
  )
}

type FileInputType = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FileInput = ({ onChange, ...remainingProps }: FileInputType) => {
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    await onChange(e)
    setLoading(false)
  }

  return (
    <div
      className={`flex flex-col gap-4 relative ${
        loading && 'opacity-60 cursor-wait'
      }`}
    >
      <input
        type="file"
        className={`file-input w-full max-w-xs`}
        accept=".pdf"
        disabled={loading}
        {...remainingProps}
        onChange={async (e) => handleOnChange(e)}
      />
      {loading && (
        <span className="loading loading-spinner loading-xl mx-auto" />
      )}
    </div>
  )
}
