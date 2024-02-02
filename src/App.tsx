import React from "react";
import { Root } from "./layouts/root";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  createRoutesFromElements,
} from "react-router-dom";

// const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <Root />,
//       children: [
//         {
//           index: true,
//           path: "/",
//           lazy: () => import("./pages/hello"),
//         },
//         {
//           path: "admin",
//           lazy: () => import("./pages/admin"),
//           children: [
//             {
//               path: "dashboard",
//               lazy: () => import("./pages/admin/dashboard"),
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   // createRoutesFromElements(
//   //   <Route path="/" element={<Root />}>
//   //     <Route path="hello" lazy={() => import("./pages/hello")}></Route>
//   //   </Route>,
//   // ),
// );

const App = () => {
  // return <RouterProvider router={router}></RouterProvider>;
  return <h1>SAYHI </h1>;
};

export default App;
