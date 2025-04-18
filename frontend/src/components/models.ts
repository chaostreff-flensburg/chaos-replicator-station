export interface Product {
  slug: string,
  name: string,
  description: string,
  image: string,
  fields: Array<ProductField>,
  images: Array<any>
}

export interface ProductField {
  name: string,
  type: string,
  label: string,
  max_length: number
}