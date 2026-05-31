import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import ProductList from "./admin/ProductList";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import CheckoutAddress from "./pages/CheckoutAddress";
import Checkout from "./pages/Checkout";

// Layout Component
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Router Configuration
const router = createBrowserRouter([
  {
    element: <Layout />,

    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/signup",
        element: <Signup />,
      },

      {
        path: "/product/:id",
        element: <ProductDetails />,
      },

      {
        path: "/cart",
        element: <Cart />,
      },

      // Admin Routes
      {
        path: "/admin/products",
        element: <ProductList />,
      },

      {
        path: "/admin/products/add",
        element: <AddProduct />,
      },

      {
        path: "/admin/products/update/:id",
        element: <EditProduct />,
      },
      {path:"/checkout-address",element :<CheckoutAddress/>},
      {
        path:"/checkout", element: < Checkout/>
      }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}