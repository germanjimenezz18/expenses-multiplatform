"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";

export default function BreadcrumbLoco() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);
  console.log(pathnames);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathnames.map((value, index) => {
          const href = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          return (
            <>
            <BreadcrumbItem key={href}>
              <BreadcrumbLink asChild>
                <Link href={href}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
