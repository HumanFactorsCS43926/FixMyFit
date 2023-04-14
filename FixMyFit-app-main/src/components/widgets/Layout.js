
import Sidebar from './Sidebar';

const Layout = ({children}) => {
    return(
        <section className="relative">
            <div className="fixed top-0 left-0 h-screen bg-sidebar w-auto">
                < Sidebar />
            </div>
            <div className="pl-80 pr-4">
                {children}
            </div>
        </section>
    )
}
export default Layout