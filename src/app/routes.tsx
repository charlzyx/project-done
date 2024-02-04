import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout";

import Skeleton from "@ant-design/pro-skeleton";
import React from "react";
const Menu = React.lazy(() => import("../pages/menu"));
const Live = React.lazy(() => import("../pages/live"));
const Login = React.lazy(() => import("../pages/login"));
const Index = React.lazy(() => import("../pages/index"));
const Admin = React.lazy(() => import("../pages/admin"));
const Live$Page = React.lazy(() => import("../pages/live/$page"));
const AdminDashboard = React.lazy(() => import("../pages/admin/dashboard"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/menu",
        element: (
          <React.Suspense fallback={<Skeleton type="list" />}>
            <Menu />
          </React.Suspense>
        ),
      },
      {
        path: "/live",
        element: (
          <React.Suspense fallback={<Skeleton type="list" />}>
            <Live />
          </React.Suspense>
        ),

        children: [
          {
            path: ":page",
            element: (
              <React.Suspense fallback={<Skeleton type="list" />}>
                <Live$Page />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <React.Suspense fallback={<Skeleton type="list" />}>
            <Login />
          </React.Suspense>
        ),
      },
      {
        path: "/index",
        element: (
          <React.Suspense fallback={<Skeleton type="list" />}>
            <Index />
          </React.Suspense>
        ),
      },
      {
        path: "/admin",
        element: (
          <React.Suspense fallback={<Skeleton type="list" />}>
            <Admin />
          </React.Suspense>
        ),

        children: [
          {
            path: "dashboard",
            element: (
              <React.Suspense fallback={<Skeleton type="list" />}>
                <AdminDashboard />
              </React.Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export const routes = [
  {
    path: "/menu",
  },
  {
    path: "/live",
    routes: [
      {
        path: ":page",
      },
    ],
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
    ],
  },
];
