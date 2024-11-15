"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UpdateProduct } from "@/lib/actions/products";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";
import Image from "next/image";

export default function UpdateProductForm({ item }: { item: ProductsT }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      // Reset preview if no file is selected
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (
      !formData.get("name") ||
      !formData.get("flavor") ||
      !formData.get("price")
    ) {
      toast.error("Please fill in all the required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await UpdateProduct(formData);
      if (error) {
        toast.error(error.toString());
      }
      router.push("/products");
    } catch (error) {
      toast.error("There was an unexpected error updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 mt-5 container max-w-screen-sm mx-auto">
        <div className="flex justify-center">
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            height="200"
            src={imagePreview || item.image}
            width="200"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Image</Label>
          <input
            name="currentImageUrl"
            id="currentImageUrl"
            type="text"
            placeholder=""
            required
            defaultValue={item.image}
            hidden
          />
          <Input
            name="image"
            id="image"
            type="file"
            placeholder=""
            accept="image/*"
            className="col-span-3"
            onChange={handleImageChange}
          />
          <p className="text-muted-foreground text-sm">
            You can leave the image blank if you will not replace it.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Product name</Label>
          <input
            name="id"
            id="id"
            type="text"
            placeholder=""
            required
            defaultValue={item.id}
            hidden
          />
          <Input
            name="name"
            id="name"
            type="text"
            placeholder=""
            required
            defaultValue={item.name}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="flavor">Flavor</Label>
          <Input
            name="flavor"
            id="flavor"
            type="text"
            placeholder=""
            defaultValue={item.flavor}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            name="price"
            id="price"
            type="number"
            placeholder=""
            defaultValue={item.price}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            name="quantity"
            id="quantity"
            type="number"
            placeholder=""
            defaultValue={item.quantity}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

export type ProductsT = Tables<"products">;
