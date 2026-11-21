export const PAES_CHECKOUT = 'https://pay.hotmart.com/W108602921C?checkoutMode=10';
export type PaesPlan = { id: 'completo' | 'basico'; name: string; priceCLP: number; anchorCLP: number; checkoutUrl: string };
export const paesOffer = { name: 'PAES en Foco · Repaso M1 + Competencia Lectora' };
export const paesPlans: Record<PaesPlan['id'], PaesPlan> = {
 completo: { id: 'completo', name: 'PAES en Foco · Paquete Completo', priceCLP: 3000, anchorCLP: 12990, checkoutUrl: PAES_CHECKOUT },
 basico: { id: 'basico', name: 'PAES en Foco · Paquete Básico', priceCLP: 2000, anchorCLP: 6990, checkoutUrl: PAES_CHECKOUT },
};
