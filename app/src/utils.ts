export function displayAddress(address: string): string {
  return address.length > 24
    ? `${address.substring(0, 10)}...${address.substring(
        address.length - 10,
        address.length
      )}`
    : address;
}
