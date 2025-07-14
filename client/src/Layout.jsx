import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySelector } from './components/CategorySelector';
import { PropertyCard } from './components/PropertyCard';


const Layout = () => {
    return(
        <div className='py-4 px-8 flex flex-col min-h-screen'>
            <Header />
            <Hero />
            <CategorySelector />
            <PropertyCard />
            <Outlet />
        </div>
    )
}

export default Layout;