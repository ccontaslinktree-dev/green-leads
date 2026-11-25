import { useEffect, useState } from 'react';

const buyers = [
  ['Valentina', 'Santiago, Chile'], ['Mateo', 'Lima, Perú'], ['Camila', 'Bogotá, Colombia'], ['Santiago', 'Guadalajara, México'],
  ['Sofía', 'Buenos Aires, Argentina'], ['Diego', 'Quito, Ecuador'], ['Isabella', 'Montevideo, Uruguay'], ['Alejandro', 'Asunción, Paraguay'],
  ['Lucía', 'La Paz, Bolivia'], ['Joaquín', 'Valparaíso, Chile'], ['Martina', 'Medellín, Colombia'], ['Sebastián', 'Monterrey, México'],
  ['Gabriela', 'Caracas, Venezuela'], ['Andrés', 'San José, Costa Rica'], ['Daniela', 'Ciudad de Panamá, Panamá'], ['Tomás', 'Córdoba, Argentina'],
  ['Fernanda', 'Arequipa, Perú'], ['Nicolás', 'Concepción, Chile'], ['Mariana', 'Santo Domingo, Rep. Dominicana'], ['Emiliano', 'Puebla, México'],
  ['Renata', 'Guayaquil, Ecuador'], ['Felipe', 'Cali, Colombia'], ['Antonella', 'Rosario, Argentina'], ['Javier', 'Tegucigalpa, Honduras'],
];
// Pattern: 3 Completo for every 1 Básico.
const plans = ['Completo', 'Completo', 'Completo', 'Básico'];

export function LiveBuyers() {
  const [i, setI] = useState(-1);
  useEffect(() => {
    const t = setInterval(() => setI(n => n + 1), 2000);
    return () => clearInterval(t);
  }, []);
  if (i < 0) return null;
  const [name, place] = buyers[i % buyers.length];
  const plan = plans[i % plans.length];
  return <div className="live-buyer" role="status" aria-live="polite" key={i}>
    <span className="live-buyer-dot" aria-hidden="true" />
    <span><b>{name}</b> de {place}<br />compró el <strong className={plan === 'Completo' ? 'lb-full' : ''}>Paquete {plan}</strong> · ahora</span>
  </div>;
}
