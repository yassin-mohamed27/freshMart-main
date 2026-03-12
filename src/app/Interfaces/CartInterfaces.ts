export interface CartRes {
    status: string
    numOfCartItems: number
    message?: string
    cartId: string
    data: Data
}
export interface ShippingAddress {
    city: string
    details: string
    phone: string
}
export interface Data {
    [x: string]: any
    _id: string
    cartOwner: string
    products: CartItem[]
    createdAt: string
    updateAt: string
    __v: number
    totalCartPrice: number
}

export interface CartItem {
    count: number
    _id: string
    product: Product
    price: number
}

export interface Product {
    subcategory: Subcategory[]
    _id: string
    title: string
    quantity: number
    imageCover: string
    category: Category
    brand: Brand
    ratingAverage: number
    id: string
}

export interface Subcategory {
    _id: string
    name: string
    slug: string
    category: string
}

export interface Category {
    _id: string
    name: string
    slug: string
    category: string
}

export interface Brand {
    _id: string
    name: string
    slug: string
    image: string
}