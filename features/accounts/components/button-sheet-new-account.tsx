"use client"

import { Button } from "@/components/ui/button"
import { useNewAccount } from "../hooks/use-new-account"

export default function ButtonSheetNewAccount() {
    const { onOpen } = useNewAccount()
    return (
        <Button onClick={onOpen}>Add Account</Button>
    )
}


