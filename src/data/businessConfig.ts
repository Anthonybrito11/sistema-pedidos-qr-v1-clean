import type { BusinessConfig } from '../types'

export const businessConfig: BusinessConfig = {
  name: 'Cuki Yun Yun',
  tagline: 'Cafetería & Restaurant',
  whatsappNumber: '18094338279',
  address: 'Av. 25 de Febrero esq. Av. San Vicente de Paúl, Los Mina, Santo Domingo Este, República Dominicana',
  currency: 'RD$',
  deliveryFee: 50,
  paymentMethods: [
    { id: 'cash', label: 'Efectivo' },
    { id: 'card', label: 'Tarjeta al recibir' },
    { id: 'transfer', label: 'Transferencia' },
  ],
}
