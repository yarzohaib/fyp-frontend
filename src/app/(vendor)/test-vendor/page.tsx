// "use client"

// import { useEffect, useState } from "react"

// const API_URL = process.env.NEXT_PUBLIC_API_URL

// // ----------------------
// // INTERFACES (typed)
// // ----------------------

// interface OrderItem {
//   product: string | Product
//   quantity: number
//   price: number
// }

// interface Product {
//   id: string
//   title: string
//   vendor: string
//   price: number
//   [key: string]: unknown
// }

// interface Order {
//   id: string
//   orderNumber: string
//   customer: string
//   items: OrderItem[]
//   orderStatus: string
//   total: number
//   createdAt: string
//   updatedAt: string
//   [key: string]: unknown
// }

// interface OrdersResponse {
//   docs: Order[]
//   page: number
//   limit: number
//   totalDocs: number
//   totalPages: number
//   hasNextPage: boolean
//   hasPrevPage: boolean
//   [key: string]: unknown
// }

// // ----------------------
// // PAGE COMPONENT
// // ----------------------

// export default function TestVendor() {
//   const [data, setData] = useState<OrdersResponse | null>(null)
//   const [error, setError] = useState<string>("")

//   // Helper: get JWT from localStorage
//   const getVendorToken = (): string | null => {
//     return typeof window !== "undefined"
//       ? localStorage.getItem("authToken")
//       : null
//   }

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = getVendorToken()

//         if (!token) {
//           setError("Vendor JWT token not found. Vendor is not logged in.")
//           return
//         }

//         if (!API_URL) {
//           setError("Missing NEXT_PUBLIC_API_URL in .env")
//           return
//         }

//         const response = await fetch(`${API_URL}/api/orders`, {
//           headers: {
//             Authorization: `JWT ${token}`,
//           },
//         })

//         const json: OrdersResponse = await response.json()
//         setData(json)
//       } catch (err) {
//         setError("Failed to fetch vendor orders.")
//       }
//     }

//     fetchOrders()
//   }, [])

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Vendor Orders Test</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   )
// }





//----------------------------PRODUCTS API-------------------------



"use client";

import { useEffect, useState } from "react";

interface AuthUser {
  id: string;
  collection: string;
  email: string;
}

interface Product {
  id: string;
  title: string;
  vendor: string;
}

export default function TestVendorPage() {
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get the stored auth user (this matches your screenshot)
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) {
      setVendorId(null);
      return;
    }

    const parsedUser: AuthUser = JSON.parse(storedUser);

    // Vendor ID is simply parsedUser.id
    setVendorId(parsedUser.id);

    // Fetch vendor products
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public-products?vendor=${parsedUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.docs || []);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vendor Products Test</h2>

      {!vendorId ? (
        <p style={{ color: "red" }}>Vendor not logged in</p>
      ) : (
        <p>Vendor ID: {vendorId}</p>
      )}

      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}
