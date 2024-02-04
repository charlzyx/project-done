import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import { ProConfigProvider } from "@ant-design/pro-components";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { routes } from "./routes";

const hideinbush = (x: string) => /\/(login)$/.test(x);

export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  const { pathname } = useLocation();
  const nav = useNavigate();

  const isLogin = pathname === "/login";

  return (
    <div
      id="pro-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById("pro-layout") || document.body;
          }}
        >
          <ProLayout
            route={{
              path: "/",
              routes: routes.filter((x) => !hideinbush(x.path)),
            }}
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
                  nav(item.path!, {});
                }}
              >
                {dom}
              </div>
            )}
          >
            <PageContainer>
              <Outlet></Outlet>
            </PageContainer>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};
