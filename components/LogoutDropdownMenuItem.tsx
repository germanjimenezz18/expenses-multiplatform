"use client"
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function DropDownMenuItemLogout({children } : {children: any}) {
    return (
      <DropdownMenuItem
      className="text-red-600 hover:bg-red-950 hover:text-white"
      onClick={ ()=>signOut()}>{children}</DropdownMenuItem>
    )
  }