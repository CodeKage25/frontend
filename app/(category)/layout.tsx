import type { Metadata } from 'next'
import Footer from '@/components/footer/Footer';
import MainNavbar from '@/components/navbar/MainNavbar';
import Bottombar from '@/components/navbar/category/Bottombar';
import Topbar from '@/components/navbar/category/Topbar';

export const metadata: Metadata = {
    title: 'Buy on Katangwa',
    description: '',
}

export default function CategoryLayout({
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
            <main>
                {children}
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}
