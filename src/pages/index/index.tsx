import { useEffect, useMemo, useState } from "react";
import { ArrayField, createForm } from "@formily/core";
import { FormProvider, ISchema, createSchemaField } from "@formily/react";
import { FormGrid, FormItem, FormLayout, Input } from "@formily/antd";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  ProArrayTable,
  QueryForm,
  QueryList,
  QueryTable,
  ShadowForm,
  useQueryListRef,
} from "@pro.formily/antd";

const service: React.ComponentProps<typeof QueryList>["service"] = (
  query,
) => {};

const query: ISchema = {
  type: "object",
  "x-decorator": "FormLayout",
  "x-decorator-props": {
    layout: "vertical",
  },
  "x-component": "QueryForm",
  "x-component-props": {
    grid: {
      maxRows: 1,
    },
  },
  properties: {
    domain: {
      title: "名称",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
    },
  },
};

const schema: ISchema = {
  type: "object",
  properties: {
    querylist: {
      type: "void",
      "x-component": "QueryList",
      "x-component-props": {
        service: "{{service}}",
        queryRef: "{{querylist}}",
      },
      properties: {
        query: query,
        list: {
          type: "array",
          "x-component": "QueryTable",
          "x-component-props": {
            onRemove: "{{onRemove}}",
          },
          items: {
            type: "object",
            properties: {
              _id: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  width: 60,
                  title: "ID",
                  align: "center",
                },
                properties: {
                  id: {
                    type: "string",
                    "x-component": "Input",
                    "x-read-pretty": true,
                  },
                },
              },
              _name: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  title: "名称",
                  align: "center",
                },
                properties: {
                  name: {
                    type: "string",
                    "x-component": "Input",
                    "x-read-pretty": true,
                  },
                },
              },
              _created_at: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  title: "创建时间",
                  align: "center",
                },
                properties: {
                  created_at: {
                    type: "string",
                    "x-component": "Input",
                    "x-read-pretty": true,
                  },
                },
              },
              _editable: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": { title: "操作", align: "center" },
                properties: {
                  _trigger: {
                    type: "void",
                    "x-decorator": "ProArrayTable.DelegateAction",
                    "x-decorator-props": {
                      act: "modal",
                    },
                    "x-component": "Button",
                    "x-component-props": {
                      type: "link",
                      icon: <EditOutlined></EditOutlined>,
                      // children: "编辑",
                    },
                  },
                  _rm: {
                    type: "void",
                    "x-component": "ProArrayTable.Remove",
                    "x-component-props": {
                      confirm: true,
                    },
                  },
                },
              },
            },
          },
          properties: {
            // ↓ 不填写 act 属性的话, 就读这个 modal 字段
            modal: {
              type: "void",
              "x-component": "ProArrayTable.ShadowModal",
              "x-component-props": {
                onOk: "{{onUpsert}}",
                // act: "modal", // 这里不填写的话, 就读取上面
                schema: {
                  type: "void",
                  properties: {
                    id: {
                      title: "ID",
                      type: "string",
                      "x-read-pretty": true,
                      "x-decorator": "FormItem",
                      "x-component": "Input",
                    },
                    name: {
                      title: "域名",
                      "x-decorator": "FormItem",
                      type: "string",
                      "x-component": "Input",
                    },
                  },
                },
              },
            },
            add: {
              type: "void",
              "x-component": "ProArrayTable.ProAddition",
              "x-component-props": {
                onOk: "{{onUpsert}}",
                schema: {
                  type: "void",
                  properties: {
                    name: {
                      title: "名称",
                      "x-decorator": "FormItem",
                      type: "string",
                      "x-component": "Input",
                    },
                  },
                },
              },
              title: "添加应用",
            },
          },
        },
      },
    },
  },
};

export const Component = () => {
  const querylist = useQueryListRef();
  const onUpsert = (
    data: any,
    ctx: ReturnType<typeof ProArrayTable.useProArrayTableContext>,
  ) => {};
  const onRemove = (idx: number, array: ArrayField) => {
    console.log("onRemove", { idx, array });
  };
  const [form, SchemaField] = useMemo(() => {
    const _form = createForm({});
    const _ScahemField = createSchemaField({
      components: {
        FormItem,
        FormGrid,
        Input,
        FormLayout,
        ProArrayTable,
        QueryList,
        QueryForm,
        ShadowForm,
        QueryTable,
        Button,
      },
      scope: {
        service,
        querylist,
        onUpsert,
        onRemove,
      },
    });
    return [_form, _ScahemField] as const;
  }, []);

  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
    </FormProvider>
  );
};

export default Component;
