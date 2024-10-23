import Image from "next/image";
import placeholder from "@/app/favicon.ico";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="mt-10 flex justify-center">
        <Image
          src={placeholder}
          alt="Image"
          width="300"
          height="300"
          className=""
        />
      </div>
      <div className="flex items-center justify-center py-12">{children}</div>
    </div>
  );
}
