import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileTabBar } from './MobileTabBar';

export function AppLayout() {

    return (
        <div className="fixed inset-0 bg-bg flex text-text overflow-hidden w-full h-[100dvh]">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-28 md:pb-8">
                    <div className="max-w-7xl mx-auto animate-page-enter">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            <MobileTabBar />
        </div>
    );
}
