import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySelector } from './components/CategorySelector';

const Layout = () => {
    return(
        <div className='py-4 px-8 flex flex-col min-h-screen'>
            <Header />
            <Hero />
            <CategorySelector />
            <Outlet />
        </div>
    )
}

export default Layout;