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
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import DeleteButton from "./delete-button";
import ItemsDialog from "./items-dialog";

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
              <TableHead className="table-cell">Items</TableHead>
              <TableHead className="table-cell">Order no.</TableHead>
              <TableHead className="table-cell">Name</TableHead>
              <TableHead className="table-cell">Total Price</TableHead>
              <TableHead className="table-cell">Created At</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
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
