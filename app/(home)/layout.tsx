import type { Metadata } from 'next'
import Footer from '@/components/footer/Footer';
import MainNavbar from '@/components/navbar/MainNavbar';
import Topbar from '@/components/navbar/home/Topbar';
import Bottombar from '@/components/navbar/home/Bottombar';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <nav>
                <MainNavbar>
                    <Topbar />
                    <Bottombar />
                </MainNavbar>
            </nav>
            <main className="bg-[url('./../public/bg.png')]">
                {children}
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}
