import DashboardCard from "@/components/dashboard/dashboard-card";
import { Coffee, ShoppingCart } from "lucide-react";
import { GetTotalProducts } from "@/lib/actions/products";
import { GetTotalOrders } from "@/lib/actions/orders";
import OrdersTable from "@/components/dashboard/orders-table";

export default async function Dashboard() {
  const [products, pending] = await Promise.all([
    GetTotalProducts(),
    GetTotalOrders(),
  ]);

  const cards = [
    {
      title: "Total Products",
      number: products,
      icon: <Coffee size={25} color="#7F5539" />,
    },
    {
      title: "Total Orders",
      number: pending,
      icon: <ShoppingCart size={25} color="#7F5539" />,
    },
  ];

  return (
    <div className="container mx-auto max-w-screen-2xl p-4 lg:p-6">
      <h1 className="text-center text-2xl">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-4">
        {cards.map((item, index) => (
          <DashboardCard key={index} item={item} />
        ))}
      </div>
      <div className="flex flex-1 flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full">
          <OrdersTable searchQuery="" page={1} />
        </div>
      </div>
    </div>
  );
}
