import React from 'react'
import Image from 'next/image'
import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/router'
import { redirect } from 'next/navigation'

const Footer = ({user, type = "desktop"}: FooterProps) => {

    const handleLogOut = async() => {
        const loggedOut = await logoutAccount();
        

        if(loggedOut) {
            redirect("/sign-in");
        }
    }
  return (
    <footer className='footer'>
        <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
            <p className='text-xl font-bold text-gray-700'>
                {user?.firstName[0]}
            </p>
        </div>
        <div className={type === "mobile" ? "footer_email-mobile" : "footer_email"}>

            <h1 className='truncate text-14 text-gray-700 font-semibold'>

                {user?.firstName}
            </h1>
            <p className='text-14 truncate font-normal text-gray-600'>
                {user?.email}

            </p>
        </div>
        <div className='footer_image' onClick={handleLogOut}>
            <Image src = "./icons/logout.svg" fill alt = "logout button"/>
        </div>
    </footer>
  )
}

export default Footer