import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrders } from "@/lib/actions/orders";
import ItemsDialog from "../orders/items-dialog";
import Link from "next/link";
import { Button } from "../ui/button";
import { MoveUpRight } from "lucide-react";

export default async function OrdersTable({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page: number;
}) {
  const items_per_page = 7;

  const [orders] = await Promise.all([
    GetOrders(searchQuery, page, items_per_page),
  ]);

  return (
    <Card className="w-full shadow-none bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Orders</CardTitle>
          <Link href="/orders">
            <Button variant="outline" className="flex items-center">
              View More
              <MoveUpRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="table-cell">Items</TableHead>
              <TableHead className="table-cell">Order no.</TableHead>
              <TableHead className="table-cell">Name</TableHead>
              <TableHead className="table-cell">Total Price</TableHead>
              <TableHead className="table-cell">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="">
                  <ItemsDialog order_id={item.id} />
                </TableCell>
                <TableCell>{item.order_number}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="font-normal">
                  ₱{Number(item.total_price)}
                </TableCell>
                <TableCell className="font-normal">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
