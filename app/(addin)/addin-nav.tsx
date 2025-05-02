"use client"

import Link from "next/link"
import { Moon, Sun, Menu, X, DollarSign } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
//import AuthButton from "@/components/header-auth"
import ClientAuthButton from "@/components/header-auth-client"


export default function MainNav() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)


  const navItems = [
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Resources", href: "#resources" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Integrated</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
          <nav className="flex items-center gap-6">

          </nav>

      </div>
    </header>
  )
}

