import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext()

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [qty, setQty] = useState(1)

  // normal variables for cart component
  let foundProduct
  let index 

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id)
    
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

    if(checkProductInCart) {
        // add actual items in the cart
        const updatedCartItems = cartItems.map((cartProduct) => {
            if(cartProduct._id === product._id) return {
                ...cartProduct,
                quantity: cartProduct.quantity + quantity
            }
        })

        setCartItems(updatedCartItems)
    } else {
        product.quantity = quantity
        setCartItems([...cartItems, { ...product }])
    }

    toast.success(`${qty} ${product.name} added to the cart.`) 
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id)
    const newCartItems = cartItems.filter((item) => item._id !== product._id)

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
    setCartItems(newCartItems)
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id)
    index = cartItems.findIndex((product) => product._id === id)
    const newCartItems = cartItems.filter((item) => item._id !== id)

    if(value === 'inc'){
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }])
        setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
    } else if(value === 'dec'){
        if(foundProduct.quantity > 1){
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }])
            setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1)
        }
    }
  }

  const incQty = () => {
    setQty((prevQty) => prevQty + 1)
  }

  const decQty = () => {
    setQty((prevQty) => {
        if(prevQty - 1 < 1) return 1
        return prevQty - 1
    })
  }

  // createContext ito yung nagbibigay ng access sa lahat ng state natin
  // for every single one of our component
  // to make that happen we need to configure it on _app.js
  return (
    <Context.Provider
        value={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
        }}
    >
        {children}
    </Context.Provider>
  )
}

// this will allow the state to be used in the components, kasi pinasa natin yung Context na galing sa react para iisa nalang sila
export const useStateContext = () => useContext(Context)