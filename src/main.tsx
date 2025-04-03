import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "@/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App, ConfigProvider } from "antd";
import ProtectedRound from "./authentication/auth";
import LayoutAdmin from "./components/layout/layout.admin";
import DashBoardPage from "./components/admin/dashboard";
import ManageBookPage from "./components/admin/manage.book";
import ManageOrderPage from "./components/admin/manage.order";
import ManageUserPage from "./components/admin/manage.user";
import LoginPage from "./components/auth/login";
import RegisterPage from "./components/auth/register";
import { AppProvider } from "./context/app.context";
import enUS from "antd/locale/en_US";
import AboutPage from "./pages/about";
import HomePage from "./pages/home";
import BookPage from "./components/client/Products/product";
import OrderPageStep from "./components/client/order/checkout.step";
import PaymentPage from "./components/client/order/payment";
import OrderDetail from "./components/client/order/orderPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRound>
            <PaymentPage />
          </ProtectedRound>
        ),
      },
      {
        path: "/orderDetail",
        element: (
          <ProtectedRound>
            <OrderDetail />
          </ProtectedRound>
        ),
      },
      {
        path: "/OrderPageStep",
        element: (
          <ProtectedRound>
            <OrderPageStep />
          </ProtectedRound>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRound>
            <DashBoardPage />
          </ProtectedRound>
        ),
      },
      {
        path: "book",
        element: (
          <ProtectedRound>
            <ManageBookPage />
          </ProtectedRound>
        ),
      },
      {
        path: "order",
        element: (
          <ProtectedRound>
            <ManageOrderPage />
          </ProtectedRound>
        ),
      },

      {
        path: "user",
        element: (
          <ProtectedRound>
            <ManageUserPage />
          </ProtectedRound>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRound>
            <div>admin page</div>
          </ProtectedRound>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
