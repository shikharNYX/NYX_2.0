import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0A0B14]">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}
