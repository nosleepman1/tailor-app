import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileTabBar } from './MobileTabBar';

export function AppLayout() {

    return (
        <div className="min-h-screen bg-bg flex text-text overflow-hidden relative">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
                    <div className="max-w-7xl mx-auto animate-page-enter">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            <MobileTabBar />
        </div>
    );
}
