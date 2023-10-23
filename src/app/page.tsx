"use client";
import React from "react";
import { trpc } from "./_trpc/client";
import Image from "next/image"

type chatMessageType = {
  sender: "user" | "server"
  message: string
}

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>("");
  const [answer, setAnswer] = React.useState<string | null | undefined>("");
  const [chat, setChat] = React.useState<chatMessageType[]>([
    {
      sender: "server",
      message: "Please as a question"
    }
  ])
  const addTodo = trpc.todo.addEmbedding.useMutation();
  const addPdf = trpc.todo.addPdf.useMutation();

  const handleEnterPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  };

  const sendMessage = async () => {
    if (!message) {
      return;
    }
    setLoading(true)
    const messages = [...chat]
    messages.push({
      sender: "user",
      message
    })
    setChat(messages)

    const response = await addTodo.mutateAsync(message);
    const serverMessage = response?.content

    if (!serverMessage) {
      messages.push({
        sender: "server",
        message: ":( Sorry I messed up."
      })
      setLoading(false)
      return setChat(messages)
    }

    messages.push({
      sender: "server",
      message: serverMessage
    })
    setLoading(false)
    setMessage("")
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <div className="flex flex-col w-full gap-4 h-screen py-16 px-8">
          <div id="chat">
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
          <div className="flex flex-row gap-2 mt-auto">
            <input
              value={message}
              placeholder="message..."
              className="input input-bordered w-full"
              name="Message"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleEnterPressed}
            />
            <button
              className="btn"
              disabled={loading}
              onClick={sendMessage}
            >
              Ask
            </button>
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



