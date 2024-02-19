import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import { ProConfigProvider, ProSkeleton } from "@ant-design/pro-components";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { menus as getMenus } from "./menus";
import { SWRProvider, supabase, useAuth } from "./request";
import { menu } from "../services/menu";

const remap = (list: any[]) => {
  const dynamic = list.reduce((ll, item) => {
    const route: any = {
      name: item.name,
    };
    if (item.children) {
      route.routes = remap(item.children);
      route.path = `live_${item.id}`;
    } else {
      route.path = `/live/${item.id}`;
      route.link = `/live/${item.id}`;
    }
    ll.push(route);
    return ll;
  }, [] as any[]);
  return dynamic;
};
const useMenus = () => {
  const once = useRef(false);

  const [menus, setMenus] = useState(getMenus());

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    menu.tree().then((list) => {
      setMenus((m: any[]) => [...m, ...remap(list)]);
    });
  }, []);
  return menus;
};
export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  const { pathname } = useLocation();
  const nav = useNavigate();

  const [loading] = useAuth();
  const menus = useMenus();

  const isLogin = pathname === "/login";

  return (
    <div
      id="pro-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <SWRProvider>
        <ProConfigProvider hashed={false}>
          <ConfigProvider
            getTargetContainer={() => {
              return document.getElementById("pro-layout") || document.body;
            }}
          >
            <ProLayout
              route={{
                path: "/",
                routes: menus,
              }}
              appList={[{ title: "supbase", url: "http://localhost:8000" }]}
              menuRender={isLogin ? false : undefined}
              location={{
                pathname,
              }}
              menuFooterRender={(props) => {
                if (props?.collapsed) return undefined;
                return (
                  <div
                    style={{
                      textAlign: "center",
                      paddingBlockStart: 12,
                    }}
                  >
                    <div>© 2021 Made with love</div>
                    <div>by Ant Design</div>
                  </div>
                );
              }}
              menuItemRender={(item, dom) => (
                <div
                  onClick={() => {
                    nav(item.link!, {});
                    console.log(`🚀 ~ item:`, item);
                  }}
                >
                  {dom}
                </div>
              )}
            >
              <PageContainer style={{ flex: 1, overflow: "auto" }}>
                {loading ? (
                  <ProSkeleton type="result"></ProSkeleton>
                ) : (
                  <Outlet></Outlet>
                )}
              </PageContainer>
            </ProLayout>
          </ConfigProvider>
        </ProConfigProvider>
      </SWRProvider>
    </div>
  );
};
