import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Building2,
    FileText,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    Search
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Market Intelligence",
            icon: Search,
            href: "/market-perception/dashboard",
            color: "text-orange-500",
        },
        {
            label: "My Reviews",
            icon: FileText,
            href: "/reviews",
            color: "text-violet-500",
        },
        {
            label: "Profile",
            icon: Users,
            href: "/profile",
            color: "text-pink-700",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
        },
    ];

    return (
        <div className={cn("pb-12 min-h-screen bg-navy-900 text-white", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-orange-500">Company</span>Next
                    </h2>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10 border-l-4 border-orange-500 rounded-l-none" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-400 uppercase">
                        Admin
                    </h2>
                    <div className="space-y-1">
                        <Link href="/admin/moderation" className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400">
                            <ShieldCheck className="h-5 w-5 mr-3 text-red-500" />
                            Moderation
                        </Link>
                    </div>
                </div>
            </div>
            <div className="px-3 py-2 mt-auto">
                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10">
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
