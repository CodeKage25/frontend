'use client'

import { AuthContext } from '@/context/AuthContextProvider'
import { LocationType } from '@/lib/types/location/CoordinateInterface';
import { useContext, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckLocationResInterface } from '@/lib/types/user/LocationResInterface';
import { AxiosError } from 'axios';
import { checkLocation, getUnReadMessageCount, setToken } from '@/api/user/endpoints';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import logo from "@/public/logo2.svg";
import sellIcon from "@/public/send.svg";
import buyIcon from "@/public/buyIcon.svg";
import { requestPermission, userLoggedIn } from '@/lib/utils';
import Link from 'next/link';
import dynamic from "next/dynamic";
import CheckLocation from '@/components/ui/checklocation';
import Searchbar from '@/components/ui/searchbar';

// const Searchbar = dynamic(() => import("@/components/ui/searchbar"))

export default function Home() {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    userLoggedIn(auth) && requestPermission();
  }, []);

  return (
    <section className="flex flex-col min-h-screen py-14 items-center justify-center">
      {userLoggedIn(auth) && <CheckLocation />}

      <div className="flex flex-col justify-center items-center py-10 bg-white w-[90%] shadow-[6px_6px_16px_0px_#D1CDC740] border-[.5px] border-[#EAEAEA] rounded-[20px] lg:max-w-[50%]">
        <Image src={logo} width={270} height={270} alt='' />

        <Searchbar styleName="relative max-w-[85%]" />

        <p className="text-[#253B4B] font-medium text-md mt-10">What do you want to do today?</p>

        <div className='flex flex-col justify-center items-center space-y-6 w-full mt-7 lg:flex-row lg:space-x-10 lg:space-y-0'>
          <div className="flex justify-center py-4 items-end bg-[#E07E1B] bg-[url('./../public/sellBg.png')] bg-no-repeat rounded-[12px] w-[70%] h-[25vh] lg:w-[32%] lg:h-[30vh]">
            <Link href={`${!userLoggedIn(auth) ? '/login' : '/dashboard'}`} legacyBehavior passHref>
              <Button className='font-semibold text-[16px] w-[40%] lg:py-[10px] lg:px-[20px]' size="lg"> <Image src={sellIcon} width={20} height={20} alt='' className='mr-2 rounded-[8px]' /> Sell</Button>
            </Link>
          </div>
          <div className="flex justify-center py-4 items-end bg-[url('./../public/buyBg.png')] bg-no-repeat rounded-[12px] w-[70%] h-[25vh] lg:w-[32%] lg:h-[30vh]">
            <Link href="/buy" passHref legacyBehavior>
              <Button className='font-semibold text-[16px] w-[40%] lg:py-[10px] lg:px-[20px]' size="lg"> <Image src={buyIcon} width={20} height={20} alt='' className='mr-2 rounded-[8px]' /> Buy</Button>
            </Link>
          </div>
        </div>

        <Link href='/view-requests' passHref legacyBehavior>
          <Button className='font-semibold mt-7 px-6 py-6 w-[80%] lg:max-w-[50%]'>View Requests</Button>
        </Link>
        {/* <p className='text-primary text-xs font-semibold'>* coming soon</p> */}
        {
          userLoggedIn(auth) &&
          (<Link href='/request' passHref legacyBehavior>
            <Button className='font-semibold mt-4 px-6 py-6 w-[80%] lg:max-w-[50%]' variant="outline">Request an Item/Service</Button>
          </Link>
          )
        }
      </div>

    </section>
  )
}
