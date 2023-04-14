import Sidebar from './Sidebar';

const ProfileLayout = ({children}) => {
    return (
        <section className="relative">
          <div className="fixed top-0 left-0 h-screen bg-sidebar w-auto">
            <Sidebar />
          </div>
          <div className="pl-80 pr-4 flex">
            <div className="mr-4">{children[0]}</div>
            <div>{children[1]}</div>
          </div>
        </section>
      );
}

export default ProfileLayout