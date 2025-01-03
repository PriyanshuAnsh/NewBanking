"use client";
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import { authFormSchema } from '@/lib/utils';
import CustomInput from './CustomInput';
import SignUp from '@/app/(auth)/sign-up/page';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';





const AuthForm = ({type}: {type: string}) => {
    const router = useRouter();
    const formSchema = authFormSchema('sign-in');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            email: "",
            password: ""
          },
        })
      
        // 2. Define a submit handler.
        const onSubmit = async (data: z.infer<typeof formSchema>) => {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          setIsLoading(true);
          try {
            if(type === "sign-up") {

                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    dateOfBirth: data.dateOfBirth!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password

                }
                const newUser = await signUp(userData);
                setUser(newUser);
            }

            if(type=== "sign-in") {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                    })

                if(response) {

                    // console.log("Response: \n")
                    // console.log(response);
                    router.push("/");
                }
            }
          } catch(error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
          
          
        }

  return ( 
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href = "/"
            className = "cursor-pointer flex items-center gap-1">
                <Image src = "/icons/logo.svg" width = {34} height = {34} alt = "Horizon logo" />
                <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                    Horizon
                </h1>
            </Link> 
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-grey-900'>
                    {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"} 
                    <p className="text-16 font-normal text-grey-600">
                        {user ? "Link your account to get started" : "Please enter your details"}
                    </p>   
                </h1> 

            </div>

        </header>

        {user ? (
            <div className='flex flex-col gap-4'>
                <PlaidLink user = {user} variant = 'primary'/>
                
            </div>
        ) : (
            <> 

                

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8">

                    {type === "sign-up" && (
                        <>
                            <div className='flex gap-4'>
                                <CustomInput type="firstName" control={form.control} label='First Name' placeholder='' />
                                <CustomInput type = "lastName" control={form.control} label='Last Name' placeholder='' />
                            </div>
                            
                            <CustomInput type='dateOfBirth' control={form.control} label = 'Date Of Birth' placeholder='YYYY-DD-MM' />
                            <CustomInput type = "address1" control={form.control} label='Address' placeholder='Enter Address' />

                            <div className='flex gap-4'>
                                <CustomInput type = "city" control={form.control} label='City' placeholder='Example: Austin' />
                                <CustomInput type = "state" control={form.control} label = "State" placeholder='Example: TX' />
                            </div>
                           
                            <CustomInput type = "postalCode" control={form.control} label = "Postal Code" placeholder='XXXXXX' />
                            <CustomInput type='ssn' control={form.control} label='Social Security Number' placeholder='XXXXXXXXX' />
                        </>
                    )}

                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <div className='form-item'>
                                <FormLabel className='form-label'>
                                    Email
                                </FormLabel>
                                <div className='flex w-full flex-col'>
                                    <FormControl>
                                        <Input placeholder='Enter your email' className='input-class' {...field} />
                                    </FormControl>
                                    <FormMessage className='form-message mt-2' />
                                </div>

                            </div>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <div className='form-item'>
                                <FormLabel className='form-label'>
                                    Password
                                </FormLabel>
                                <div className='flex w-full flex-col'>
                                    <FormControl>
                                        <Input placeholder='Enter your password' className='input-class' {...field} type = "password" />
                                    </FormControl>
                                    <FormMessage className='form-message mt-2' />
                                </div>

                            </div>
                        )}
                        />
                        <div className='flex flex-col gap-4'>
                        <Button type="submit" disabled = {isLoading} className='form-btn'>
                            {isLoading ? 
                                (
                                    <>
                                    <Loader2 size={20} className='animate-spin' /> &nbsp; 
                                    Loading...
                                    </>
                                )
                                : type === "sign-in" ? "Sign in" : "Sign Up" 
                            }
                        </Button>
                        </div>
                        
                    </form>
                </Form>

                <footer className='flex justify-center gap-1'> 
                <p className='text-14 font-normal text-grey-600'>
                    {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Link href = {type === "sign-in" ? "/sign-up" : "/sign-in"} className='form-link'> 
                    {type === "sign-in" ? "Sign Up" : "Sign In"}
                </Link>

                </footer>

                
            </>
        )}

    </section>
  )
}

export default AuthForm