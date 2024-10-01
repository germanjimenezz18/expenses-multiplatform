import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { cn } from "@/lib/utils";

type Props = {
  account: string;
  accountId: string;
};

export default function AccountColumn({ accountId, account }: Props) {
  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    <div
      onClick={onClick}
      className="hidden md:flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  );
}
