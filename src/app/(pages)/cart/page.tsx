import { CartRes } from '@/app/Interfaces/CartInterfaces'
import { authOptions } from '@/auth'
import Cart from '@/components/Cart/Cart'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  const response = await fetch(`${process.env.API_URL}/cart`, {
    headers: {
      token: (session as any).tokenRes,
    }
  })
  const data: CartRes = await response.json()
  return <>
    <Cart cartData={data.numOfCartItems == 0 ? null : data} />
  </>
}
