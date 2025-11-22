import React from 'react'
import { SignIn } from '@clerk/nextjs'
const page = () => {
  return (
    <div className="p-0 flex justify-center items-center  ">
      <SignIn />
    </div>
  )
}

export default page