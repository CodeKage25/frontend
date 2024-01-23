import AuthNavbar from "@/components/navbar/AuthNavbar"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <nav>
                <AuthNavbar />
            </nav>
            <main className="bg-[url('./../public/bg.png')]">
                {children}
            </main>
        </>
    )
}
