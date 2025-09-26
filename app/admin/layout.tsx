'use client';

import { AuthProvider } from '@/lib/auth-context';
import AdminHeader from '@/components/admin/AdminHeader';

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
      </div>
    </AuthProvider>
  );
}