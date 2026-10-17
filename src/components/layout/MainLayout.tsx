import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OfflineBanner } from '../ui/OfflineBanner';
import { AppHeader } from './AppHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { BottomNavigation } from './BottomNavigation';
import { InstallPrompt } from './InstallPrompt';
import { RoleSelectorModal } from '../auth/RoleSelectorModal';

export const MainLayout: React.FC = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* Top Application Bar */}
      <AppHeader onOpenRoleSelector={() => setIsRoleModalOpen(true)} />

      {/* Main Body with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DesktopSidebar />

        {/* Dynamic Page Content with bottom padding for mobile navigation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <BottomNavigation />

      {/* PWA Install Banner */}
      <InstallPrompt />

      {/* Role Switcher Modal */}
      <RoleSelectorModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
};
