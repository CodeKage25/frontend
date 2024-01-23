'use client'

import { motion } from 'framer-motion'

const Loading = () => {
    return <section className="flex flex-col space-y-2 h-screen justify-center items-center">
        <motion.img
            initial={{
                scale: 0.5
            }}
            animate={{
                scale: 1.2,
                rotate: 360
            }}
            transition={{
                duration: 1,
                repeatType: 'reverse',
                repeat: Infinity,
                ease: 'easeOut'
            }} src='/katangwa-logo.png' width={50} height={50} alt="logo" />

        <h1 className="text-2xl font-semibold text-black">Fetching page content</h1>
        <p className="font-normal text-sm text-[#253B4B]">Please wait...</p>
    </section>
}

export default Loading;