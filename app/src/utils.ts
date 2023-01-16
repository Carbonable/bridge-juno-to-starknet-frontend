import { useFetcher } from "@remix-run/react";

export function displayAddress(address: string): string {
  return address.length > 24
    ? `${address.substring(0, 10)}...${address.substring(
        address.length - 10,
        address.length
      )}`
    : address;
}

/**
 *
 * @param wallet
 * @param projectId
 * @returns Array of transactions status or empty array
 */
export function projectFetcher(wallet: string, projectId: string) {
  const fetcher = useFetcher();
  console.log(`/bridge/status/${wallet}/${projectId}`);
  fetcher.load(`/bridge/status/${wallet}/${projectId}`);

  const data = fetcher.data;
  console.log(data);

  return { data };
}
