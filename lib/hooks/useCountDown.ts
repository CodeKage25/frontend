import { useEffect, useRef, useState } from "react"

export const useCountDown = (seconds: number, autoStart: boolean = true) => {
    const [countDown, setCountDown] = useState<number>(seconds)
    const [isComplete, setIsComplete] = useState<boolean>();
    const countDownRef = useRef<number>()

    // if (!autoStart) {
    //     setIsComplete(true);
    //     return { countDown, isComplete, setCountDown, setIsComplete }
    // }
    useEffect(() => {
        countDownRef.current = window.setInterval(() => {
            setCountDown(prev => (prev - 1))
        }, 1000)

        return () => window.clearInterval(countDownRef.current)
    }, [countDown > 0])

    useEffect(() => {
        if (countDown === 0) {
            setIsComplete(true)
            window.clearInterval(countDownRef.current)
        }
    }, [countDown])

    return { countDown, isComplete, setCountDown, setIsComplete }
}