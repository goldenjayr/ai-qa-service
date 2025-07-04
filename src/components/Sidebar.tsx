import React from 'react';
import { LayoutDashboard, Server, MousePointerClick, FileText } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  currentPage: string;
  onNavigate: (page: string, id?: number | string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, name: 'Dashboard' },
    { id: 'services', icon: Server, name: 'Services' },
    { id: 'ux-flows', icon: MousePointerClick, name: 'UX Flows' },
    { id: 'reports', icon: FileText, name: 'Reports' },
  ];
  return (
    <aside
      className={`bg-gray-900/70 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} h-screen fixed top-0 left-0 flex flex-col z-40`}
    >
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <span className={`text-2xl font-bold text-white transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>AQA</span>
        <svg
          className={`w-8 h-8 text-cyan-400 absolute transition-opacity ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <nav className="flex-grow mt-6">
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="px-4 mb-2">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className={`flex items-center p-3 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-white transition-colors ${currentPage.startsWith(item.id) ? 'bg-cyan-500/10 text-white' : ''}`}
              >
                <item.icon size={20} />
                <span className={`ml-4 transition-opacity whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
