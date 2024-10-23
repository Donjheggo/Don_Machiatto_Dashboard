import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrders } from "@/lib/actions/orders";
import { Badge } from "../ui/badge";
import { MoveUpRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

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
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead className="table-cell">Order no.</TableHead>
              <TableHead className="table-cell">Product</TableHead>
              <TableHead className="table-cell">Size</TableHead>
              <TableHead className="table-cell">Name</TableHead>
              <TableHead className="table-cell">Quantity</TableHead>
              <TableHead className="table-cell">Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={item.product_id.image}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-normal">
                  {item.order_number}
                </TableCell>
                <TableCell className="font-normal">
                  {item.product_id.name}
                </TableCell>
                <TableCell className="font-normal">{item.name}</TableCell>
                <TableCell className="font-normal">
                  <Badge variant="default">{item.size}</Badge>
                </TableCell>
                <TableCell className="font-normal">
                  {Number(item.quantity)}
                </TableCell>
                <TableCell className="font-normal">
                  ₱{Number(item.product_id.price) * Number(item.quantity)}
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
