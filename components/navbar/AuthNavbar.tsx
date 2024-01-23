'use client';

import Image from 'next/image';
import logo from '../../public/logo.svg'
import { Button } from '../ui/button';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContextProvider';
import { userLoggedIn } from '@/lib/utils';

const AuthNavbar = () => {
    const { auth } = useContext(AuthContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])
    return (
        <div className='px-4 py-4 flex justify-between items-center md:px-16'>
            {/* <Image layout='responsive' src={logo} width={200} height={200} alt='Katangwa Logo' /> */}
            <div className='relative w-[45%] h-[45px] md:w-[15%]'>
                <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
            </div>
            {(isClient && !userLoggedIn(auth)) &&
                <Link href="/login" legacyBehavior passHref>
                    <Button className={'py-2 px-3 font-semibold md:px-[50px]'}>Log in</Button>
                </Link>
            }
        </div>
    )
}

export default AuthNavbar;