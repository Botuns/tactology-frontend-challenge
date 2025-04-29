"use client";

import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Building2, Menu, User } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideNav } from "@/components/side-nav";

export function TopNav() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-12 items-center gap-4 border-b border-gray-100 bg-white px-3 sm:px-4">
      <div className="flex lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0">
            <SideNav />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-2 lg:hidden">
        <Building2 className="h-5 w-5" />
        <span className="font-medium text-sm">Tactology</span>
      </div>
      <div className="ml-auto flex items-center gap-1">
        {/* <ModeToggle /> */}
        {/* greet the user */}
        <span className="text-sm font-medium text-gray-700">
          {user ? `Hello, ${user.username}` : "Welcome"}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs">
              {user ? user.username : "Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-xs">
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-xs">
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-xs">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
