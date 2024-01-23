import { nunito } from '@/app/font';
import logo from '../../../../public/logo.svg'
import jetSuccess from '../../../../public/jet.svg'
import Image from 'next/image';

const OtpInfo = () => {
    return (
        <div className="container h-screen flex flex-col justify-center w-full items-center bg-[#FCFCFD] md:w-[65%]">
            <div className='relative w-full mt-4 md:mt-[32px]'>
                <div className=' w-[45%] h-[45px] md:w-[5%] md:h-[70px]'>
                    <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
                </div>
                <p className='hidden absolute text-[11px] top-12 right-2 font-semibold italic md:block lg:text-[12px] lg:top-12 lg:right-44'>Exchange with connections</p>
            </div>
            <div className='flex flex-col w-full items-center p-8 text-textPrimary shadow-[6px_6px_16px_0px_#D1CDC740] lg:px-[100px] lg:py-[50px]'>
                <h1 className='text-center text-xl font-semibold md:text-3xl lg:text-[32px]'>PASSWORD RESET</h1>
                <h3 className='text-center text-[14px] font-medium mt-4 mb-6'>
                    Complete OTP verification to proceed, its important for account verification
                </h3>

                <p className={`${nunito.className} mb-6 text-center font-semibold text-[12px] text-textPrimary md:text-[14px]`}>
                    We have a sent a password reset link to your registered email address, Please check your email address and follow the instructions to recover your password.
                </p>

                <Image src={jetSuccess} width={"200"} height={"200"} alt="" />

                <p className={`${nunito.className} mt-[24px] text-center font-semibold text-[14px] text-textPrimary`}>
                    By signing up, you agree to our <span className='text-primary'>Terms & Privacy Policy.</span>
                </p>
            </div>
        </div>
    )
}

export default OtpInfo;