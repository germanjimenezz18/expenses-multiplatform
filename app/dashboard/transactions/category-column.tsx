import { useOpenCategory } from "@/features/categories/hooks/use-open-categorie";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export default function CategoryColumn({ id, categoryId, category }: Props) {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "hidden md:flex items-center cursor-pointer hover:underline",
        !category && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="size-4 mr-2 shrink-0" />}
      {category || "Uncategorized"}
    </div>
  );
}
