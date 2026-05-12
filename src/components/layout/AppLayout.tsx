import { createElement } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto relative scroll-smooth bg-background">
        <Outlet />
      </main>
    </div>
  );
}
