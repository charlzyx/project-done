import { useEffect, useMemo, useRef, useState } from "react";
import { useMatch, useParams } from "react-router-dom";
import {
  Studio,
  PreviewWidget,
  transformToTreeNode,
} from "../../../components/Studio";
import { page } from "../../../services/page";
import { ProSkeleton } from "@ant-design/pro-components";
import { Button, Space } from "antd";

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

const Page = () => {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const { loading, store, tree } = usePageQuery();
  const params = useParams();
  const dd = useRef<any>({
    get: () => {},
    set: () => {},
    loader: () => {
      return tree;
    },
  });

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

  return loading ? (
    <ProSkeleton></ProSkeleton>
  ) : mode === "preview" ? (
    <div>
      <Space>
        <Button onClick={() => setMode("edit")} type="primary">
          编辑
        </Button>
      </Space>
      <PreviewWidget tree={transformToTreeNode(tree) as any}></PreviewWidget>
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
  );
};

export default Page;
