// Configure the payment URL only when the checkout stage is ready.
export const officeOffer = {
  name: "Escritório IA",
  price: 9.99,
  checkoutUrl: null as string | null,
  videos: {
    presentation: {
      src: "/videos/apresentacao.mp4",
      poster: "/images/apresentacao.webp",
      title: "Conheça o escritório por dentro",
      duration: "1:09",
    },
    mining: {
      src: "/videos/mineracao.mp4",
      poster: "/images/mineracao.webp",
      title: "Veja a mineração de ofertas na prática",
      duration: "1:09",
    },
  },
} as const;
export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
export function getCheckoutUrl() {
  if (!officeOffer.checkoutUrl) return null;
  const url = new URL(officeOffer.checkoutUrl);
  if (typeof window !== "undefined")
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (!url.searchParams.has(key)) url.searchParams.append(key, value);
    });
  return url.toString();
}
