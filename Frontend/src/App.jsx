import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";

import ProductList from "./admin/ProductList";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";

const router = createBrowserRouter([
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

  // Product List
  {
    path: "/admin/products",
    element: <ProductList />,
  },

  // Add Product
  {
    path: "/admin/products/add",
    element: <AddProduct />,
  },

  // Edit Product
  {
    path: "/admin/products/update/:id",
    element: <EditProduct />,
  },
 
]);

export default function App() {
  return <RouterProvider router={router} />;
}