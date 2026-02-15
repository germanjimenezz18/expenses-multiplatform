import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

interface Props {
  account: string;
  accountId: string;
}

export default function AccountColumn({ accountId, account }: Props) {
  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    <button
      className="hidden cursor-pointer items-center hover:underline md:flex"
      onClick={onClick}
      type="button"
    >
      {account}
    </button>
  );
}
