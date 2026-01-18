import Link from "next/link"
import { UserNav } from "./user-nav"
import { Button } from "@/components/ui/button"

export function AppHeader() {
    return (
        <div className="border-b bg-white">
            <div className="flex h-16 items-center px-4">
                {/* Mobile menu trigger could go here */}
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                </div>
            </div>
        </div>
    )
}
