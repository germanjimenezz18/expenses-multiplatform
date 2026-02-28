import { useOpenCategory } from "@features/categories/hooks";
import { useOpenTransaction } from "@features/transactions/hooks";
import { TriangleAlert } from "lucide-react";
import { UNCATEGORIZED_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  category: string | null;
  categoryId: string | null;
}

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
    <button
      className={cn(
        "hidden cursor-pointer items-center hover:underline md:flex",
        !category && "text-rose-500"
      )}
      onClick={onClick}
      type="button"
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || UNCATEGORIZED_NAME}
    </button>
  );
}
