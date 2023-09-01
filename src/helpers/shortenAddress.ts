export const shortenAddress = (address?: string) => {
  if (!address) return '';

  const firstPart = address.substring(0, 5);
  const lastPart = address.substring(address.length - 5, address.length);

  return `${firstPart}...${lastPart}`;
};
