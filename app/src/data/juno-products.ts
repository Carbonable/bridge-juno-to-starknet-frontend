export type Product = {
  id: string;
  name: string;
  href: string;
  imageAlt: string;
  price: number | string;
  priceUnit: string;
  holder: string;
  certifyer: string;
  land: string;
  country: string;
  countryIsoCode: string;
  flagUrl: string;
  fundsTarget: number | string;
  expiration: string;
  duration: string;
  absorbtion: string;
  odd: string[];
  av: boolean;
  slug: string;
  sellContractAddress: string;
  nftContractAddress: string;
  starknetProjectAddress: string;
  unitPrice: number;
  denom: string;
  max: number;
  saleDate: string;
  isReady: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Banegas Farm",
    href: "#",
    imageAlt: "Banegas Farm",
    price: "9.8",
    priceUnit: "JUNO",
    holder: "Corcovado Foundation",
    certifyer: "Wildsense",
    land: "4",
    country: "Costa Rica",
    countryIsoCode: "cr",
    flagUrl:
      "https://firebasestorage.googleapis.com/v0/b/carbonable-projects/o/flags%2Fcostarica.png?alt=media&token=f5425c48-1da5-400a-b77f-40689ee47d14",
    fundsTarget: 17,
    expiration: "2052",
    duration: "30 years",
    absorbtion: "1,573 T",
    odd: ["08", "13", "15"],
    av: true,
    slug: "reforestation-banegas-farm-costa-rica",
    sellContractAddress:
      "juno17ctm453vqp0qvummupzln8q7cayeka0cfu7kfgm22qlqgl7zua0s32v5ld",
    nftContractAddress:
      "juno12uzam70vndkakuupksvsasrxwsehz8n8j5s8sw2y0vv5d94dxh0qwmddq4",
    starknetProjectAddress:
      typeof window === "undefined" ? "" : window.ENV.BANEGAS_FARM,
    unitPrice: 9800000,
    denom: "ujuno",
    max: 5,
    saleDate: "🗓 May, 6th 2022",
    isReady: true,
  },
  {
    id: "2",
    name: "Las delicias",
    href: "#",
    imageAlt: "Las delicias",
    price: "12.9",
    priceUnit: "JUNO",
    holder: "Fundación Naturaleza Panamá",
    certifyer: "Wildsense",
    land: "18",
    country: "Panama",
    countryIsoCode: "pa",
    flagUrl:
      "https://firebasestorage.googleapis.com/v0/b/carbonable-projects/o/flags%2Fpanama.png?alt=media&token=dc9108eb-24ef-48f8-98ba-e8f97da2a962",
    fundsTarget: 40,
    expiration: "2042",
    duration: "20 years",
    absorbtion: "3,603 T",
    odd: ["08", "13", "14", "15"],
    av: true,
    slug: "mangroves-las-delicias-panama",
    sellContractAddress:
      "juno1fl7vq8hwej2lr67f08w3xmsgsctupngeyd5cl6650pj3g0ddslasctjvf0",
    nftContractAddress:
      "juno13g5r0tmmngmm9d0clwa7exjamxxxag5p5fgdra7qjtaexdg6yprq5298fn",
    starknetProjectAddress:
      typeof window === "undefined" ? "" : window.ENV.LAS_DELICIAS,
    unitPrice: 12900000,
    denom: "ujuno",
    max: 5,
    saleDate: "🗓 May, 10th 2022",
    isReady: true,
  },
  {
    id: "3",
    name: "Los Azules",
    href: "#",
    imageAlt: "Los Azules",
    price: "👀",
    priceUnit: "USD",
    holder: "CREHO",
    certifyer: "Wildsense",
    land: "64.5",
    country: "Panama",
    countryIsoCode: "pa",
    flagUrl:
      "https://firebasestorage.googleapis.com/v0/b/carbonable-projects/o/flags%2Fpanama.png?alt=media&token=dc9108eb-24ef-48f8-98ba-e8f97da2a962",
    fundsTarget: "👀",
    expiration: "2037",
    duration: "15 years",
    absorbtion: "14,025 T",
    odd: ["08", "13", "14", "15"],
    av: false,
    slug: "mangroves-los-azules-panama",
    sellContractAddress: "",
    nftContractAddress: "",
    starknetProjectAddress: "",
    unitPrice: 100000,
    denom: "ujuno",
    max: 5,
    saleDate: "🗓 COMING SOON",
    isReady: false,
  },
];
