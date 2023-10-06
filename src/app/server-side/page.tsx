import React from 'react'
import Link from 'next/link'

import { serverClient } from '@/app/_trpc/serverClient'

export default async function Home() {
  const todos = await serverClient.todo.getTodos()
  
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
        <div className="overflow-x-auto">
       <table className="table min-w-[800px]">
            <thead>
                <tr>
                <th>id</th>
                <th>Title</th>
                <th>Description</th>
                <th>Done</th>
                </tr>
            </thead>
            <tbody>
                {todos.map(({id, title,description, done})=>(
                <tr className="hover">
                    <th>{id}</th>
                    <td><Link href={`/todo/${id}`}>{title}</Link></td>
                    <td>{description}</td>
                    <td><input type="checkbox" checked={done} className="checkbox" /></td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </main>
  )
}
