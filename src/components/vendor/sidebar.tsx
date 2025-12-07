// import { Home, BarChart, ShoppingBag, Users, CircleUser } from "lucide-react";
// import Link from "next/link";


// const menu = [
// { name: "Dashboard", icon: Home, href: "/dashboard" },
// { name: "Orders", icon: BarChart, href: "/orders" },
// { name: "Products", icon: ShoppingBag, href: "/add-product" },
// //{ name: "Customers", icon: Users, href: "#" },
// { name: "Profile", icon: CircleUser, href: "/VendorProfile" },
// ];


// export default function Sidebar() {
// return (
// <div className="h-full p-4 space-y-4">
// <h2 className="text-xl font-bold">Admin Panel</h2>
// <nav className="space-y-2">
// {menu.map((item) => (
// <Link
// key={item.name}
// href={item.href}
// className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
// >
// <item.icon size={20} />
// {item.name}
// </Link>
// ))}
// </nav>
// </div>
// );
// }

// sidebar.tsx
import { Home, BarChart, ShoppingBag, CircleUser } from "lucide-react";
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
    <div className="h-full p-6 space-y-6" style={{ backgroundColor: '#1A3126' }}>
      <h2 className="text-xl font-medium font-serif" style={{ color: 'white' }}>Admin Panel</h2>
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            style={{ 
              backgroundColor: '#1A3126',
              color: 'white'
            }}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}