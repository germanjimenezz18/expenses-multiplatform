"use client";
import { BanknoteIcon, PiggyBankIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { type PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function PlaidAuth({ public_token }: { public_token: string }) {
  const [account, setAccount] = useState<any>(null);
  React.useEffect(() => {
    const accessToken = async () => {
      const response = await fetch("/api/test/exchange_public_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicToken: public_token }),
      });
      const { accessToken } = await response.json();
      console.log(`Access Token: ${accessToken}`);

      const authResponse = await fetch("/api/test/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      const authData = await authResponse.json();
      console.log({ authData });
      setAccount(authData);
    };
    accessToken();
  }, []);

  return account ? (
    <div className="flex flex-col items-start">
      <div className="flex gap-x-2 rounded-full border">
        <Image
          alt="Connected"
          className="ml-2"
          height={30}
          src="/bank_logos/bbva-logo.png"
          width={40}
        />
        <Badge variant={"primary"}>Connected</Badge>
      </div>

      <div className="mt-2 rounded-xl border p-2">
        <div className="mb-2 text-center">
          <span>Accounts</span>
        </div>
        <ul className="grid gap-2">
          {account.accounts.map((account: any) => (
            <li
              className="flex cursor-pointer gap-4 rounded-xl border hover:bg-muted/20"
              key={account.account_id}
            >
              <div className="flex items-center gap-4 p-2">
                <BanknoteIcon className="ml-2 size-4 text-primary" />
                <div className="flex flex-col gap-x-2 px-2">
                  <span className="text-sm">{account.name}</span>
                  <span className="text-primary text-xs">
                    EUR {account?.balances?.current}{" "}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div>
      <h1>Plaid Auth</h1>
      <p>Public Token: {public_token}</p>
    </div>
  );
}
const ButtonConnectToBank = () => {
  const [token, setToken] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  // get link_token from your server when component mounts
  React.useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch("/api/test/create_link_token", {
        method: "POST",
      });
      const { link_token } = await response.json();
      console.log(link_token);
      setToken(link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    // send public_token to your server
    console.log(publicToken, metadata);
    setPublicToken(publicToken);
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
    // onEvent
    // onExit
  });

  return publicToken ? (
    <PlaidAuth public_token={publicToken} />
  ) : (
    <Button
      className="flex items-center justify-center"
      disabled={!ready}
      onClick={() => open()}
      variant={"secondary"}
    >
      <PiggyBankIcon className="mr-3 size-4" />
      Connect a bank account
    </Button>
  );
};

export default ButtonConnectToBank;
