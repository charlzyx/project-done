import { useEffect, useMemo, useRef, useState } from "react";
import { useMatch, useMatches, useParams, useRoutes } from "react-router-dom";
import React from "react";
import {
  Studio,
  PreviewWidget,
  transformToTreeNode,
} from "../../../components/Studio";
import { page } from "../../../services/page";
import {
  PageLoading,
  ProBreadcrumb,
  ProPageHeader,
} from "@ant-design/pro-components";
import { Button, Empty, Space } from "antd";
import { useMenus } from "../../../app/layout";
import { FontColorsOutlined } from "@ant-design/icons";

const usePageQuery = () => {
  const [tree, setTree] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const store = useMemo(() => {
    const query = () => {
      setLoading(true);
      return page
        .info(params.menu!)
        .then((resp) => {
          const json = resp.data?.[0]?.meta;
          if (json) {
            // const treenew = transformToTreeNode(json);
            // tree.current = json;
            setTree(json);
          }
        })
        .finally(() => setLoading(false));
    };
    const reset = () => {
      setTree({});
    };
    const save = (json: any) => {
      setLoading(true);
      return page
        .upsert({
          id: +params.menu!,
          meta: json,
        })
        .then(() => {})
        .finally(() => {
          setLoading(false);
        });
    };
    return { query, save, reset };
  }, [params.menu]);
  return { tree, store, loading };
};

const usePageBreadCurmb = () => {
  const matches = useMatches();
  const menus = useMenus();
  const match = matches[matches.length - 1];
  let title = "";

  const find = (list: typeof menus, chain: any[] = []) => {
    list.forEach((menu: any) => {
      if (menu.link === match.pathname) {
        chain.push({
          path: menu.link,
          breadcrumbName: menu.name,
        });
        title = menu.name;
      } else if (menu.routes) {
        const isMyChild = find(menu.routes);
        if (isMyChild.length > 0) {
          chain.push(...isMyChild);
          chain.push({
            path: menu.link,
            breadcrumbName: menu.name,
          });
        }
      }
    });
    chain.reverse();
    return chain;
  };
  const list = find(menus);
  return [list, title] as const;
};

const PageHeader: React.FC = (props: { showTitle?: boolean }) => {
  const [breadcurmbs, title] = usePageBreadCurmb();

  return <ProBreadcrumb routes={breadcurmbs}></ProBreadcrumb>;
};

const Page = () => {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const { loading, store, tree } = usePageQuery();
  const params = useParams();

  useEffect(() => {
    setMode("preview");
    store.reset();
    store.query();
  }, [params.menu]);

  useEffect(() => {
    if (!tree) return;
    if (mode === "preview") {
      store.query();
    }
  }, [mode]);

  return (
    <React.Fragment>
      <PageHeader></PageHeader>
      {loading ? (
        <PageLoading></PageLoading>
      ) : mode === "preview" ? (
        <div>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              icon={<FontColorsOutlined></FontColorsOutlined>}
              onClick={() => setMode("edit")}
              type="primary"
            >
              设计
            </Button>
          </Space>
          {/* {JSON.stringify(tree, null, 2)} */}
          {tree.form ? (
            <PreviewWidget
              tree={transformToTreeNode(tree) as any}
            ></PreviewWidget>
          ) : (
            <Empty></Empty>
          )}
        </div>
      ) : (
        <Studio
          schema={tree}
          onSave={(json) => {
            return store.save(json).then(() => {
              setMode("preview");
              return store.query();
            });
          }}
        ></Studio>
      )}
    </React.Fragment>
  );
};

export default Page;
