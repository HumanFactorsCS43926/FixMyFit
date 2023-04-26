import Sidebar from './Sidebar';
import 'react-toastify/dist/ReactToastify.css';

const ProfileLayout = ({ children }) => {
  return (
    <section className="relative" style={{ width: '100%', height: '100%' }}>
      <div className="fixed top-0 left-0 h-screen bg-sidebar w-auto">
        <Sidebar />
      </div>
      <div className="pl-80 pr-4 flex" style={{ width: 'calc(100% - 260px)' }}>
        <div className="mr-4">{children[0]}</div>
        <div>{children[1]}</div>
      </div>
    </section>
  );
}

export default ProfileLayout;
