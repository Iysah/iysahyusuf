'use client';

import { AuthProvider } from '@/lib/auth-context';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main>{children}</main>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}