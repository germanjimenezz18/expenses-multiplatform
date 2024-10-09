import { Button } from "@/components/ui/button"
import { useNewTransaction } from "../hooks/use-new-transaction"

export default function ButtonSheetNewTransaction() {
    const { onOpen } = useNewTransaction()
    return (
        <Button onClick={onOpen}>New Transaction</Button>
    )
}