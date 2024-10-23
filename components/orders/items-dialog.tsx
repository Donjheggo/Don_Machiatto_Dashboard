import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Armchair } from "lucide-react";
import { GetItemsByOrderId } from "@/lib/actions/orders";
import { Tables } from "@/database.types";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

export default async function ItemsDialog({ order_id }: { order_id: string }) {
  const items = await GetItemsByOrderId(order_id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center">
          <Armchair size={18} className="mr-2" /> View Items
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden">
        <ScrollArea className="h-[calc(90vh-2rem)]">
          <div>
            {items?.map((item, index) => (
              <div key={index} className="mb-4 p-4">
                <Image
                  src={item.product_id.image}
                  alt="product-img"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover"
                />
                <div className="flex justify-between">
                  <h1>{item.product_id.name}</h1>
                  <h1>X{item.quantity}</h1>
                </div>
                <h1>Price: ₱{item.price}</h1>
                <h1>Shipping: ₱{item.shipping_fee}</h1>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export type OrderItemsT = {
  created_at: string;
  id: string;
  order_id: string;
  price: number;
  product_id: ProductT;
  quantity: number;
  shipping_fee: number;
};

type ProductT = Tables<"products">;
