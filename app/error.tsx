"use client"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.log(error);
    return (
        <p>{error.message} something went wrong!</p>
    )
}