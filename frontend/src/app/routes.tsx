import {
  createBrowserRouter,
  Navigate,
  Outlet,
  ScrollRestoration,
} from "react-router"

import Auth from "../pages/Auth"
import Cart from "../pages/Cart"
import Checkout from "../pages/Checkout"
import Home from "../pages/Home"
import Product from "../pages/Product"
import { StoreProvider } from "./store"

function Root() {
  return (
    <StoreProvider>
      <Outlet />
      <ScrollRestoration />
    </StoreProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "product", Component: Product },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "sign-in", Component: Auth },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
])
