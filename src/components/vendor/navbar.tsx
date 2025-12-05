import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
//import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <Search size={20} />
        <Input className="w-64" placeholder="Search..." />
      </div>

      <div className="flex items-center gap-6">
        <Bell size={22} className="cursor-pointer" />
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar> */}
      </div>
    </header>
  );
}