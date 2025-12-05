import { Home, BarChart, ShoppingBag, Users, CircleUser } from "lucide-react";
import Link from "next/link";


const menu = [
{ name: "Dashboard", icon: Home, href: "/dashboard" },
{ name: "Orders", icon: BarChart, href: "/orders" },
{ name: "Products", icon: ShoppingBag, href: "/add-product" },
//{ name: "Customers", icon: Users, href: "#" },
{ name: "Profile", icon: CircleUser, href: "/VendorProfile" },
];


export default function Sidebar() {
return (
<div className="h-full p-4 space-y-4">
<h2 className="text-xl font-bold">Admin Panel</h2>
<nav className="space-y-2">
{menu.map((item) => (
<Link
key={item.name}
href={item.href}
className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
>
<item.icon size={20} />
{item.name}
</Link>
))}
</nav>
</div>
);
}