import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};
