import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'
import { AdminSidebarProvider } from '@/context/AdminSidebarContext'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let admin
  try {
    admin = await requireAdmin()
  } catch (e) {
    console.error('requireAdmin error:', e)
    redirect('/admin/login')
  }
  
  if (admin.ok === false) {
    redirect('/admin/login')
  }

  return (
    <AdminSidebarProvider>
      <div className="admin-shell flex h-screen overflow-hidden bg-cream-deep">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
