"use client";
import React, { useCallback, useState } from "react";

import { usePlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";
import { Button } from "./ui/button";
import { BanknoteIcon, PiggyBankIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";

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
      <div className="flex gap-x-2  border rounded-full">
        <Image
          className="ml-2"
          src="/bank_logos/bbva-logo.png"
          alt="Connected"
          width={40}
          height={30}
        />
        <Badge variant={"primary"}>Connected</Badge>
      </div>

      <div className="border rounded-xl p-2 mt-2">
        <div className="mb-2 text-center">
          <span>Accounts</span>
        </div>
        <ul className="grid gap-2">
          {account.accounts.map((account: any) => (
            <li
              key={account.account_id}
              className="flex gap-4 border rounded-xl hover:bg-muted/20 cursor-pointer"
            >
              <div className="flex items-center p-2  gap-4 ">
                <BanknoteIcon className="size-4 ml-2 text-primary" />
                <div className="flex flex-col gap-x-2 px-2 ">
                  <span className="text-sm">{account.name}</span>
                  <span className="text-xs text-primary">EUR {account?.balances?.current} </span>
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
      onClick={() => open()}
      disabled={!ready}
      variant={"secondary"}
      className="flex items-center justify-center"
    >
      <PiggyBankIcon className="mr-3 size-4" />
      Connect a bank account
    </Button>
  );
};

export default ButtonConnectToBank;
