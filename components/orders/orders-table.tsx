import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrders, GetTotalOrders } from "@/lib/actions/orders";
import { TablePagination } from "./pagination";
import { Badge } from "../ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import DeleteButton from "./delete-button";
import Image from "next/image";

export default async function OrdersTable({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page: number;
}) {
  const items_per_page = 7;

  const [totalOrders, orders] = await Promise.all([
    GetTotalOrders(),
    GetOrders(searchQuery, page, items_per_page),
  ]);

  const totalPages = Math.ceil(totalOrders / items_per_page);
  return (
    <Card className="w-full shadow-none bg-background">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage orders role.</CardDescription>
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
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <DeleteButton id={item.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{(page - 1) * items_per_page + 1}</strong>-
          <strong>{Math.min(page * items_per_page, totalOrders)}</strong> of{" "}
          <strong>{totalOrders}</strong> orders
        </div>
        <div className="ml-auto">
          <TablePagination totalPages={totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
