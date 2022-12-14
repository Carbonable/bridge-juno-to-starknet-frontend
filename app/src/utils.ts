export function displayAddress(address: string): string {
  return address.length > 24
    ? `${address.substring(0, 5)}...${address.substring(
        address.length - 5,
        address.length
      )}`
    : address;
}
