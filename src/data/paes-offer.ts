export const PAES_CHECKOUT = 'https://pay.hotmart.com/J108608476K?checkoutMode=10';
export type PaesPlan = { id: 'completo' | 'basico'; name: string; priceUSD: number; checkoutUrl: string };
export const paesOffer = { name: 'PAES en Foco · Repaso M1 + Competencia Lectora' };
export const paesPlans: Record<PaesPlan['id'], PaesPlan> = {
 completo: { id: 'completo', name: 'PAES en Foco · Paquete Completo', priceUSD: 4.50, checkoutUrl: PAES_CHECKOUT },
 basico: { id: 'basico', name: 'PAES en Foco · Paquete Básico', priceUSD: 2.95, checkoutUrl: 'https://pay.hotmart.com/W108602921C?checkoutMode=10' },
};
