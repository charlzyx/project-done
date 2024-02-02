import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout";

import Skeleton from '@ant-design/pro-skeleton';
import React from 'react';
const Home = React.lazy(() => import('../pages/home'));
const Login = React.lazy(() => import('../pages/login'));
const Index = React.lazy(() => import('../pages/index'));
const Admin = React.lazy(() => import('../pages/admin'));
const AdminDashboard = React.lazy(() => import('../pages/admin/dashboard'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/home",
        element: <React.Suspense fallback={<Skeleton type="list" />}>
          <Home />
        </React.Suspense>,

      },
      {
        path: "/login",
        element: <React.Suspense fallback={<Skeleton type="list" />}>
          <Login />
        </React.Suspense>,

      },
      {
        path: "/index",
        element: <React.Suspense fallback={<Skeleton type="list" />}>
          <Index />
        </React.Suspense>,

      },
      {
        path: "/admin",
        element: <React.Suspense fallback={<Skeleton type="list" />}>
          <Admin />
        </React.Suspense>,

        children: [
          {
            path: "dashboard",
            element: <React.Suspense fallback={<Skeleton type="list" />}>
              <AdminDashboard />
            </React.Suspense>,

          },
        ]
      },
    ]
  },
]);


export const routes = [
  {
    name: "Home",
    path: "/home",
    icon: "",
    access: "",
  },
  {
    name: "Login",
    path: "/login",
    icon: "",
    access: "",
  },
  {
    name: "Index",
    path: "/index",
    icon: "",
    access: "",
  },
  {
    name: "Admin",
    path: "/admin",
    icon: "",
    access: "",
    routes: [
      {
        name: "Dashboard",
        path: "dashboard",
        icon: "",
        access: "",
      },
    ]
  },
]