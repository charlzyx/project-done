import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout";

import Skeleton from '@ant-design/pro-skeleton';
import React from 'react';
const Else = React.lazy(() => import('../pages/else'));
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
        path: "/else",
        element: <React.Suspense fallback={<Skeleton type="list" />}>
          <Else />
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
    path: "/else",
  },
  {
    path: "/login",
  },
  {
    path: "/index",
  },
  {
    path: "/admin",
    routes: [
      {
        path: "dashboard",
      },
    ]
  },
]