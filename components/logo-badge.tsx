import Link from 'next/link'
import { Badge } from './ui/badge'
import { Globe } from 'lucide-react'

interface Props {
  href: string
}

export default function LogoBadge({ href }: Props) {
  return (
    <Link className="flex items-center justify-center" href={href}>
      <Badge
        variant="outline"
        className="text-muted-foreground select-none hover:text-primary/60 hover:border-primary/50 whitespace-nowrap"
      >
        Expenses
        <Globe className="size-5 mx-1" />
        Multiplatform
      </Badge>
      <span className="sr-only">Expenses Multiplatform</span>
    </Link>
  )
}
