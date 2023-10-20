"use client";
import React from "react";
import { trpc } from "./_trpc/client";

export default function Home() {
  const [message, setMessage] = React.useState<string>("");

  const addTodo = trpc.todo.addEmbedding.useMutation();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col flex-start gap-4 pt-4">
        <input
          value={message}
          placeholder="message..."
          className="input input-bordered w-full max-w-xs"
          name="Message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="btn"
          onClick={() => {
            if (!message) {
              return;
            }

            const response = addTodo.mutate(message);
            setMessage("");
          }}
        >
          Add embedding
        </button>
      </div>
    </main>
  );
}
