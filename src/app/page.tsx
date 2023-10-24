"use client";
import React from "react";
import { trpc } from "./_trpc/client";
import Image from "next/image"

type ChatMessageType = {
  sender: "user" | "server"
  message: string
}

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [userMessage, setUserMessage] = React.useState<string>("")
  const [chat, setChat] = React.useState<ChatMessageType[]>([
    {
      sender: "server",
      message: "Please ask a question"
    }
  ]) 
  const containerRef = React.useRef<HTMLDivElement>(null);
  const addTodo = trpc.todo.addEmbedding.useMutation();
  const addPdf = trpc.todo.addPdf.useMutation();

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  React.useEffect(()=>{
    scrollToBottom()
  }, [chat])

  const updateChat = (message: ChatMessageType) => {
    setChat(prevChat => [...prevChat, message])
  }

  const sendMessageToServer = async () => {
    if (!userMessage || loading) {
      return;
    }
    setLoading(true)
    updateChat({sender: "user", message: userMessage})
    setUserMessage("")
    
    const response = await addTodo.mutateAsync(userMessage);
    const serverMessage = response?.content

    if (!serverMessage) {
      setLoading(false)
      throw new Error("Error: No message from server!")
    }

    updateChat({
      sender: "server",
      message: serverMessage
    })

    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center relative">
            <div className="flex flex-col w-full gap-4 h-screen pt-8 pb-28 ">
            <div id="chat" ref={containerRef} className="overflow-scroll px-8">
              {chat.map((item, index)=>{
                if (item.sender === "server"){
                  return (
                    <div key={index} className="chat chat-start">
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full bg-red">
                          <Image src="/next.svg" width={100} height={100} alt=""/>
                        </div>
                      </div>
                      <div className="chat-header">
                        {item.sender}
                      </div>
                      <div className="chat-bubble chat-bubble-primary">{item.message}</div>
                    </div>
                  )
                }

                return (
                  <div className="chat chat-end" key={index}>
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <Image src="/vercel.svg" width={100} height={100} alt=""/>
                      </div>
                    </div>
                    <div className="chat-header">
                      {item.sender}
                    </div>
                    <div className="chat-bubble chat-bubble-secondary">{item.message}</div>
                  </div>
                )
              })}
              {loading ?  
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                      <div className="w-10 rounded-full bg-red">
                        <Image src="/next.svg" width={100} height={100} alt=""/>
                      </div>
                    </div>
                  <div className="chat-bubble chat-bubble-primary">
                    <span className="loading loading-dots loading-xs"></span>
                  </div>
                </div> : null}
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
                    if (event.key === 'Enter') {
                      sendMessageToServer()
                    }
                  }
                }
                />
                <button
                  className="btn"
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
            <li>File.pdf</li>
          </ul>
          <div className="flex flex-col gap-4">
            <label htmlFor="my-drawer-2" aria-label="close sidebasr" className="drawer-overlay"></label> 
            <input type="file" className="file-input w-full max-w-xs" />
            <button
              className="btn btn-primary"
              onClick={() => {
                const response = addPdf.mutate(null);
              }}
            >
              Add pdf
            </button> 
          </div> 
        </div>
      </div>  
    
    </main>
  );
}



