"use client";

import { Button } from "@/components/ui/button";
import { useNewCategory } from "@/features/categories/hooks/use-new-categorie";

export default function ButtonSheetNewCategory() {
  const { onOpen } = useNewCategory();
  return <Button onClick={onOpen}>Add Category</Button>;
}
