import {
  createContext,
  useEffect,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"

import CartNotification from "../components/CartNotification"
import { productApi } from "../api/client"

export const products = [
  {
    id: "6720e5c9b83b123456789001",
    category: "ELECTRONICS",
    name: "Studio Wireless Headphones",
    rating: "4.8",
    price: 2499,
    image: "/assets/6ce96.png",
  },
  {
    id: "6720e5c9b83b123456789002",
    category: "FASHION",
    name: "Everyday Court Sneakers",
    rating: "4.7",
    price: 1850,
    image: "/assets/c3f85.png",
  },
  {
    id: "6720e5c9b83b123456789003",
    category: "HOME & LIVING",
    name: "Minimal Ceramic Lamp",
    rating: "4.9",
    price: 1150,
    image: "/assets/eb990.png",
  },
  {
    id: "6720e5c9b83b123456789004",
    category: "ACCESSORIES",
    name: "Everyday Carry Tote",
    rating: "4.6",
    price: 650,
    image: "/assets/6ce96.png",
  },
]

export type User = {
  _id?: string
  name: string
  email: string
  token: string
}

type CartNotification = {
  id: number
  message: string
}

type StoreContextValue = {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  quantities: number[]
  cartCount: number
  subtotal: number
  notification: CartNotification | null
  addQuantity: (index: number, quantity?: number) => void
  updateQuantity: (index: number, quantity: number) => void
  removeProduct: (index: number) => void
  resetCart: () => void
  products: typeof products
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [quantities, setQuantities] = useState([1, 1, 0, 0])
  const [storeProducts, setStoreProducts] = useState(products)
  const [notification, setNotification] = useState<{
    id: number
    message: string
  } | null>(null)
  const notificationId = useRef(0)

  // Try fetching products from live Product Service on mount
  useEffect(() => {
    productApi.getProducts().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((item: any, idx: number) => ({
          id: item._id || item.id || `prod-${idx}`,
          category: (item.category || "GENERAL").toUpperCase(),
          name: item.name,
          rating: item.rating ? String(item.rating) : "4.8",
          price: Number(item.price) || 999,
          image: item.image && item.image !== "no-image.jpg"
            ? (item.image.startsWith("http") ? item.image : `/assets/${item.image}`)
            : (products[idx % products.length]?.image || "/assets/6ce96.png"),
        }))
        setStoreProducts(mapped)
        if (mapped.length > quantities.length) {
          setQuantities((prev) => [...prev, ...new Array(mapped.length - prev.length).fill(0)])
        }
      }
    })
  }, [])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("token", newUser.token)
    } else {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  const logout = () => {
    setUser(null)
    setNotification({
      id: ++notificationId.current,
      message: "You have been logged out.",
    })
  }

  useEffect(() => {
    if (!notification) return

    const timeout = window.setTimeout(() => setNotification(null), 3000)
    return () => window.clearTimeout(timeout)
  }, [notification])

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = quantities.reduce((sum, quantity) => sum + quantity, 0)
    const subtotal = storeProducts.reduce(
      (sum, product, index) => sum + product.price * (quantities[index] || 0),
      0,
    )

    return {
      user,
      setUser,
      logout,
      quantities,
      cartCount,
      subtotal,
      notification,
      products: storeProducts,
      addQuantity: (index, quantity = 1) => {
        setQuantities((current) =>
          current.map((value, itemIndex) =>
            itemIndex === index ? value + quantity : value,
          ),
        )
        setNotification({
          id: ++notificationId.current,
          message: `${storeProducts[index]?.name || "Item"} added to your cart.`,
        })
      },
      updateQuantity: (index, quantity) =>
        setQuantities((current) =>
          current.map((value, itemIndex) =>
            itemIndex === index ? Math.max(0, quantity) : value,
          ),
        ),
      removeProduct: (index) => {
        setQuantities((current) =>
          current.map((value, itemIndex) => (itemIndex === index ? 0 : value)),
        )
        setNotification({
          id: ++notificationId.current,
          message: `${storeProducts[index]?.name || "Item"} removed from your cart.`,
        })
      },
      resetCart: () => setQuantities(new Array(storeProducts.length).fill(0)),
    }
  }, [notification, quantities, storeProducts, user])

  return (
    <StoreContext.Provider value={value}>
      {children}
      <CartNotification notification={notification} />
    </StoreContext.Provider>
  )
}

export function useStore() {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error("useStore must be used within StoreProvider")
  }

  return store
}

export function formatPrice(value: number) {
  return `EGP ${value.toLocaleString("en-US")}`
}
