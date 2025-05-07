"use client"

import Link from "next/link"
import { DollarSign } from "lucide-react"

export default function MainNav() {
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

