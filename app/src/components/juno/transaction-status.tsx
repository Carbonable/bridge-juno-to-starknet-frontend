import React from "react";
import Status from "./status";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

type TransactionStatusProps = {
  hasTokens: boolean;
  tokens: string[];
  data: any;
};

function StatusItem({ hasTokens, tokens, data }: TransactionStatusProps) {
  if (!hasTokens && data?.length === 0) {
    return <div className="text-neutral-300 mb-4">No tokens to bridge</div>;
  }

  if (hasTokens && data?.length === 0) {
    return (
      <>
        {tokens?.map((token) => (
          <div key={token} className="mb-4 flex items-center flex-nowrap">
            Token {token}: <Status>to bridge</Status>
          </div>
        ))}
      </>
    );
  }

  return data?.map((item: any) => (
    <div key={item.token_id} className="mb-4 flex items-center flex-nowrap">
      Token {item.token_id}: <Status>{item.status}</Status>
      {item.status === "success" && (
        <a
          href={`https://starkscan.co/tx/${item.transaction_hash}`}
          target="_blank"
          rel="noreferrer"
          className="text-neutral-300 underline hover:no-underline ml-4 flex flex-nowrap"
        >
          View on starkscan <ArrowTopRightOnSquareIcon className="w-4 ml-2" />
        </a>
      )}
    </div>
  ));
}

export default function TransactionStatus({
  hasTokens,
  tokens,
  data,
}: TransactionStatusProps) {
  return (
    <div className="rounded-2xl border border-neutral-700 bg-launchpad-header pt-4 px-4 text-left mt-4 shadow-xl mb-12">
      <div className="font-inter uppercase font-bold text-neutral-200 text-sm mb-4">
        Transaction status
      </div>

      <StatusItem hasTokens={hasTokens} tokens={tokens} data={data} />
    </div>
  );
}
