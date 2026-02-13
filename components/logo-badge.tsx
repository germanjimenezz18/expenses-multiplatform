import { Globe } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface Props {
  href: string;
}

export default function LogoBadge({ href }: Props) {
  return (
    <Link className="flex items-center justify-center" href={href}>
      <Badge
        className="select-none whitespace-nowrap text-muted-foreground hover:border-primary/50 hover:text-primary/60"
        variant="outline"
      >
        Expenses
        <Globe className="mx-1 size-5" />
        Multiplatform
      </Badge>
      <span className="sr-only">Expenses Multiplatform</span>
    </Link>
  );
}
