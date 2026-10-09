"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  LayoutList
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingBag },
    { name: "Categories", href: "/admin/dashboard/categories", icon: LayoutList },
    { name: "Products", href: "/admin/dashboard/products", icon: Package },
    { name: "Customers", href: "/admin/dashboard/customers", icon: Users },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-200 z-40 flex items-center justify-between px-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900">LilyPique Admin</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-zinc-600 hover:bg-zinc-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-16 md:h-20 items-center px-6 md:px-8 border-b border-zinc-100 justify-between">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">LilyPique Admin</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-zinc-100 text-zinc-900" 
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 bg-white">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
        {children}
      </main>
      
    </div>
  );
}
