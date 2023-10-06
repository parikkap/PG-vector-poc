import React from 'react'
import { serverClient } from '@/app/_trpc/serverClient'

export default async function Home({ params }: { params: { id: string } }){
  const todo = await serverClient.todo.getTodo(Number(params.id))
  
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{todo?.title}</h2>
                <p>{todo?.description}</p>
                <div className='flex items-center gap-4'><input type="checkbox" checked={todo?.done} className="checkbox" /> Done</div>
            </div>
        </div>
    </main>
  )
}
