"use client"
import React from 'react'
import Link from 'next/link'
import { trpc } from "./_trpc/client"

export default  function Home() {
  const [title, setTitle] = React.useState<string>("")
  const [description, setDescription] = React.useState<string>("")

  const getTodos = trpc.todo.getTodos.useQuery()
  const addTodo = trpc.todo.addTodo.useMutation({
    onSettled:()=>{getTodos.refetch()}
  })
  const deleteTodo = trpc.todo.deleteTodo.useMutation({
    onSettled:()=>{getTodos.refetch()}
  })
  const setDone = trpc.todo.setDone.useMutation({
    onSettled:()=>{getTodos.refetch()}
  })

  const todos = getTodos.data

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="overflow-x-auto">
      {todos ? (
       <table className="table min-w-[800px]">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Done</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(({id, title,description, done})=>(
              <tr className="hover">
                <td><Link href={`/todo/${id}`} className="hover:underline">{title}</Link></td>
                <td>{description}</td>
                <td><input type="checkbox" checked={done} onChange={()=>setDone.mutate({id, done: !done})} className="checkbox" /></td>
                <td><button onClick={()=>deleteTodo.mutate(id)} className='btn btn-warning'>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>) : (<span className="loading loading-spinner loading-lg"/>)}
      </div>
      <div className='flex flex-col flex-start gap-4 pt-4'> 
        <input value={title} placeholder='title' className='input input-bordered w-full max-w-xs' name="title" onChange={(e)=>setTitle(e.target.value)} />
        <input value={description} placeholder='description' className='input input-bordered w-full max-w-xs' name="title" onChange={(e)=>setDescription(e.target.value)} />
        <button className='btn' onClick={()=>{
            if (!title || !description){
              return
            } 

            addTodo.mutate({
              title,
              description
            })
            
            setTitle("")
            setDescription("")
        }}>Add todo</button>
        </div>
    </main>
  )
}
