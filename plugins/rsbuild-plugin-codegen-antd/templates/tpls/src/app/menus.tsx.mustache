import { routes } from "./routes";
import { HomeOutlined, DashboardOutlined } from "@ant-design/icons";

const config = [
  {
    hidden: true,
    path: "/login",
  },
  {
    name: "首页",
    icon: <HomeOutlined />,
    hidden: true,
    path: "/index",
  },
  {
    name: "其他",
    icon: <HomeOutlined />,
    path: "/else",
  },
  {
    name: "管理",
    icon: <DashboardOutlined />,
    path: "/admin",
    routes: [
      {
        name: "看板",
        icon: <DashboardOutlined />,
        path: "dashboard",
      },
    ],
  },
];

const merge = (
  _routes: typeof routes,
  _config: typeof config,
  parent = "",
): any => {
  if (!_config) return _routes;
  const merged = _routes.reduce<any>((list, item) => {
    const conf = _config.find((x) => x.path === item.path);
    if (conf?.hidden) return list;
    list.push({
      ...item,
      ...conf,
      link: `${parent ? `${parent}/` : ""}${item.path}`,
      routes:
        conf?.routes && item.routes
          ? merge(item.routes, conf.routes as any, item.path)
          : item.routes,
    });
    return list;
  }, [] as any[]);
  return merged;
};

export const menus = () => merge(routes, config);
