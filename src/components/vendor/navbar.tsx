
// import Image from "next/image";
// import Link from "next/link";
// import { LogoutButton } from "@/components/logout-button";

// export default function Navbar() {
//   return (
//     <header className="flex items-center justify-between px-6 py-4 bg-card">
//       {/* Logo */}
//       <Link href="/dashboard" className="flex items-center">
//         <Image
//           src="/logoo.jpg"
//           alt="Doma Logo"
//           width={250}
//           height={200}
//           className="w-16 h-16 sm:w-12 sm:h-12 transition-transform hover:scale-105 object-contain"
//           priority
//         />
//       </Link>

//       {/* Right side - Icons and Logout */}
//       <div className="flex items-center gap-6">
        
//         <LogoutButton />
//       </div>
//     </header>
//   );
// }



import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center -my-2">
        <Image
          src="/logoo.jpg"
          alt="Doma Logo"
          width={250}
          height={200}
          className="w-24 h-24 sm:w-20 sm:h-20 transition-transform hover:scale-105 object-contain"
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