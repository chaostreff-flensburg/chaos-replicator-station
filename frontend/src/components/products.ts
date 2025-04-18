import type {Product} from './models';

const products: Array<Product> = [
  {
    slug: 'bottle-clip-1',
    name: 'Flaschen Clip',
    description: 'Ein Clip für Flaschen, personalisiert mit deinem Namen. Farbe: Weiß (Einfarbig). Kann selber bemalt werden. Material: PLA (Bio Plastik).',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Dein Name',
        max_length: 20,
      }
    ],
    images: [
      {
        url: '/products/bottle-clip-1_scad.png',
        alt: 'Screenshot aus OpenSCAD mit dem Mate Clip. Dieser ist ca. 180° langer geschlossener und Kreisförmig',
        default: true
      }
    ]
    }
]

export default products;