import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

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
      className="hidden cursor-pointer items-center hover:underline md:flex"
      onClick={onClick}
    >
      {account}
    </div>
  );
}
