import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center -my-2">
        <Image
          src="/DomaG.png"
          alt="Doma Logo"
          width={250}
          height={200}
          className="w-32 h-32 sm:w-28 sm:h-28 transition-transform hover:scale-105 object-contain"
          priority
        />
      </Link>

      {/* Right side - Icons and Logout */}
      <div className="flex items-center gap-6">
        
        <LogoutButton />
      </div>
    </header>
  );
}

