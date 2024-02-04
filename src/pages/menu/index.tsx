import { useEffect, useMemo, useRef, useState } from "react";
import { ArrayField, createForm } from "@formily/core";
import { FormProvider, ISchema, createSchemaField } from "@formily/react";
import { move } from "@formily/shared";
import {
  ArrayBase,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
} from "@formily/antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Tag } from "antd";
import { Menu, menu } from "../../services/menu";
import {
  ProArrayTable,
  ProArrayTableProps,
  QueryForm,
  QueryList,
  QueryTable,
  ShadowForm,
  useQueryListRef,
} from "@pro.formily/antd";
import { schema } from "./schema";
const measureTableHeight = (el: HTMLElement) => {
  let table = el as any;
  while (table && table.tagName !== "TABLE") {
    table = table.parentElement!;
  }
  if (!table) return 0;
  return (table as HTMLTableElement).clientHeight;
};

const Indent: React.FC<React.PropsWithChildren> = (props) => {
  const record = ArrayBase.useRecord?.();
  const indent = Array.from({ length: record?.indent }).fill("....").join("  ");
  return props.children ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: record.indent * 20,
        position: "relative",
      }}
    >
      {props.children}
    </div>
  ) : (
    <span
      style={{
        padding: "0 8px",
        // paddingLeft: props.children ? record.indent * 10 : "8px",
        // display: "flex",
        // alignItems: "center",
      }}
    >
      {indent}
    </span>
  );
};

const fluttenTree = (tree: Menu[], indent = 0) => {
  return tree.reduce<
    (Menu & { indent: number; canMoveUp: boolean; canMoveDown: boolean })[]
  >((flat, item, idx) => {
    flat.push({
      ...item,
      indent,
      canMoveUp: idx !== 0,
      canMoveDown: idx < tree.length - 1,
      children: undefined,
    });
    if (item.children) {
      flat.push(...fluttenTree(item.children, indent + 1));
    }
    return flat;
  }, []);
};

const nextTick = (cb: () => any) => {
  setTimeout(cb);
};
export const Component = () => {
  const querylist = useQueryListRef();
  const service: React.ComponentProps<typeof QueryList>["service"] = () => {
    return menu.tree().then((tree) => {
      return {
        list: fluttenTree(tree),
        total: 0,
      };
    });
  };

  const onUpsert = (
    data: any,
    ctx: ReturnType<typeof ProArrayTable.useProArrayTableContext>,
  ) => {
    return menu
      .upsert(data)
      .then(() => nextTick(() => querylist.current?.run()));
  };

  const onAddSub = (
    data: any,
    ctx: ReturnType<typeof ProArrayTable.useProArrayTableContext>,
  ) => {
    return menu
      .upsert(data)
      .then(() => nextTick(() => querylist.current?.run()));
  };

  const onMoveUp: ProArrayTableProps["onMoveUp"] = (dest, arrayField) => {
    const array = arrayField.value;
    return menu
      .mvUpDown(array[dest], "up")
      .then(() => nextTick(() => querylist.current?.run()));
  };

  const onMoveDown: ProArrayTableProps["onMoveDown"] = (dest, arrayField) => {
    const array = arrayField.value;
    return menu
      .mvUpDown(array[dest], "down")
      .then(() => nextTick(() => querylist.current?.run()));
  };

  const onSortEnd: ProArrayTableProps["onSortEnd"] = (
    from,
    _to,
    arrayField,
  ) => {
    const to = from > _to ? _to - 1 : _to;
    const source = arrayField.value[from]?.id;
    const target = arrayField.value[to]?.id;
    return menu
      .mv(target, source)
      .then(() => nextTick(() => querylist.current?.run()));
  };
  const onRemove: ProArrayTableProps["onRemove"] = (
    idx: number,
    array: ArrayField,
  ) => {
    return menu
      .rm(array.value?.[idx]?.id)
      .then(() => nextTick(() => querylist.current?.run()));
  };

  const [form, SchemaField] = useMemo(() => {
    const _form = createForm({});
    const _ScahemField = createSchemaField({
      components: {
        FormItem,
        FormGrid,
        Input,
        Indent,
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
        onAddSub,
        onRemove,
        onSortEnd,
        onMoveUp,
        onMoveDown,
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
