export const API_CONFIG = {
  AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:5001",
  PRODUCT_SERVICE_URL: import.meta.env.VITE_PRODUCT_SERVICE_URL || "http://localhost:5002",
  PAYMENT_SERVICE_URL: import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:5003",
  CART_SERVICE_URL: import.meta.env.VITE_CART_SERVICE_URL || "http://localhost:5004",
  ORDER_SERVICE_URL: import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:5005",
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ----------------------------------------------------
// Service A: Auth & User Service (Port 5001)
// ----------------------------------------------------
export const authApi = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_CONFIG.AUTH_SERVICE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || "Registration failed")
    return json
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_CONFIG.AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || "Login failed")
    return json
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}

// ----------------------------------------------------
// Service B: Product & Search Service (Port 5002)
// ----------------------------------------------------
export const productApi = {
  async getProducts(params?: { search?: string; category?: string }) {
    try {
      const url = new URL(`${API_CONFIG.PRODUCT_SERVICE_URL}/api/products/`)
      if (params?.search) url.searchParams.set("search", params.search)
      if (params?.category) url.searchParams.set("category", params.category)

      const res = await fetch(url.toString())
      if (!res.ok) return null
      const data = await res.json()
      return data.products || data
    } catch (err) {
      console.warn("[Product Service] Offline or error, using default catalog:", err)
      return null
    }
  },

  async getProductById(id: string) {
    try {
      const res = await fetch(`${API_CONFIG.PRODUCT_SERVICE_URL}/api/products/${id}`)
      if (!res.ok) return null
      return await res.json()
    } catch (err) {
      console.warn("[Product Service] Error fetching product:", err)
      return null
    }
  },

  async getCategories() {
    try {
      const url = new URL(`${API_CONFIG.PRODUCT_SERVICE_URL}/api/categories/`)
      const res = await fetch(url.toString())
      if (!res.ok) return null
      const data = await res.json()
      return data.categories || data
    } catch {
      return null
    }
  },
}

// ----------------------------------------------------
// Service D: Cart Service (Port 5004)
// ----------------------------------------------------
export const cartApi = {
  async getCart() {
    try {
      const res = await fetch(`${API_CONFIG.CART_SERVICE_URL}/api/cart`, {
        headers: { ...getAuthHeader() },
      })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  },

  async addToCart(productId: string, quantity = 1) {
    const res = await fetch(`${API_CONFIG.CART_SERVICE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ productId, quantity }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || "Failed to add to cart")
    return json
  },

  async updateItem(productId: string, quantity: number) {
    const res = await fetch(`${API_CONFIG.CART_SERVICE_URL}/api/cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ quantity }),
    })
    return await res.json()
  },

  async removeItem(productId: string) {
    const res = await fetch(`${API_CONFIG.CART_SERVICE_URL}/api/cart/${productId}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    })
    return await res.json()
  },

  async clearCart() {
    const res = await fetch(`${API_CONFIG.CART_SERVICE_URL}/api/cart`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    })
    return await res.json()
  },
}

// ----------------------------------------------------
// Service E: Order Service (Port 5005) & Payment Service (Port 5003)
// ----------------------------------------------------
export const orderApi = {
  async createOrder(data: {
    shippingAddress: {
      street: string
      city: string
      country: string
      postalCode?: string
      fullName?: string
      phone?: string
    }
    paymentMethod?: string
    items?: Array<{
      product: string
      quantity: number
      price?: number
      title?: string
    }>
  }) {
    const res = await fetch(`${API_CONFIG.ORDER_SERVICE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || json.paymentError || "Failed to create order")
    }
    return json
  },

  async getMyOrders() {
    try {
      const res = await fetch(`${API_CONFIG.ORDER_SERVICE_URL}/api/orders/my-orders`, {
        headers: { ...getAuthHeader() },
      })
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  },
}
