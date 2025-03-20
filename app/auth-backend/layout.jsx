import { auth } from '@/auth';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react'

const AuthBackendLayout = async({children}) => {
    const session=await auth();
  return (
      <>
        <div className='min-h-screen bg-black'>
              <Navbar session={session}/>
              {children}
        </div>
        <Footer/>
      </>
  )
}

export default AuthBackendLayout