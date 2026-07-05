import type { BusinessConfig } from '../types'

export const businessConfig: BusinessConfig = {
  name: 'Cuki YunYun',
  tagline: 'Cafetería - Coffee & Food',
  whatsappNumber: '18097526222',
  address: 'Plaza Velero, Verón Punta Cana, República Dominicana',
  currency: 'RD$',
  deliveryFee: 50,
  paymentMethods: [
    { id: 'cash', label: 'Efectivo' },
    { id: 'card', label: 'Tarjeta al recibir' },
    { id: 'transfer', label: 'Transferencia' },
  ],
}
