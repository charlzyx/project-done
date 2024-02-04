import { PostgrestResponse } from "@supabase/supabase-js";
import { ListQuery, supabase, unbox } from "../utils";

type MenuMeta = {
  icon: string;
  access: string;
};

type DataMenu = {
  id: number;
  parent_id?: number;
  code: string;
  name: string;
  path: string;
  meta: MenuMeta;
  order: number;
  created_at: string;
  updated_at: string;
};

export type Menu = DataMenu & {
  children?: Menu[];
};

const sortBy =
  (by: "ASC" | "DESC") => (a: { order: number }, b: { order: number }) => {
    const cmp = a.order - b.order > 0;
    return by === "ASC" && cmp ? 1 : -1;
  };

export const menu = {
  async upsert(neo: Menu) {
    const { data: parent } = await supabase
      .from("Menu")
      .select("code")
      .eq("id", neo.parent_id ?? 0);

    // order
    const { data: max } = await supabase
      .from("Menu")
      .select("order")
      .eq("parent_id", neo.parent_id ?? 0)
      .order("order", { ascending: false })
      .limit(1);
    const maxOrder = max?.[0]?.order ?? 0;

    // insert
    const { data } = await supabase
      .from("Menu")
      .upsert({ ...neo, order: maxOrder + 1 })
      .select();

    const nid = data?.[0].id;
    // update code
    const { data: next } = await supabase
      .from("Menu")
      .update({
        code: `${parent?.[0]?.code ?? ""}#${nid}`,
      })
      .eq("id", nid)
      .select();
    return next?.[0] as Menu;
  },

  async rm(id: Pick<DataMenu, "id">): Promise<void> {
    const { data: target } = await supabase
      .from("Menu")
      .select("parent_id,code,order")
      .eq("id", id);
    const codePrefix = target?.[0]?.code;
    if (!codePrefix) {
      throw new Error("DEL ERROR");
    }
    await supabase.from("Menu").delete().like("code", `${codePrefix}%`);
    // fix order
    const { data: slibings } = await supabase
      .from("Menu")
      .select("id, order")
      .eq("parent_id", target?.[0].parent_id);

    const rmOrder = target?.[0].order;
    const upto = slibings?.reduce<{ id: number; order: number }[]>(
      (list, item) => {
        if (item.order >= rmOrder) {
          list.push({ ...item, order: item.order - 1 });
        }
        return list;
      },
      [],
    );
    await supabase.from("Menu").upsert(upto);
  },

  async mvUpDown(current: Menu, move: "up" | "down") {
    const { data: slibings } = await supabase
      .from("Menu")
      .select("id, order")
      .eq("parent_id", current.parent_id ?? 0);
    slibings?.sort(sortBy("ASC"));
    const myIndex = slibings?.findIndex((x) => x.id === current.id);
    const swap = slibings?.[myIndex! + (move === "up" ? -1 : 1)];

    await supabase.from("Menu").upsert([
      {
        id: current.id,
        order: swap?.order,
      },
      {
        id: swap?.id,
        order: current.order,
      },
    ]);
  },

  async mv(
    target: DataMenu["id"] | undefined,
    source: DataMenu["id"],
  ): Promise<void> {
    let targetCode: string;
    let sourceCode: string;
    if (!target) {
      // ROOT
      targetCode = "#";
      const { data } = await supabase
        .from("Menu")
        .select("code")
        .eq("id", source);
      sourceCode = data?.[0].code;
    } else {
      const [r1, r2] = await Promise.all([
        supabase
          .from("Menu")
          .select("code")
          .eq("id", target)
          .then((resp) => resp.data),
        supabase
          .from("Menu")
          .select("code")
          .eq("id", source)
          .then((resp) => resp.data),
      ]);
      targetCode = r1?.[0].code;
      sourceCode = r2?.[0].code;
    }
    const sourceCodes = sourceCode.split("#");
    const targetCodes = targetCode.split("#");

    const isSameLevel =
      // 父级不变, 位置交换
      sourceCodes.slice(0, -1).join("#") === targetCode;

    const isSlibing = // 同级拖动
      sourceCodes.slice(0, -1).join("#") === targetCodes.slice(0, -1).join("#");

    if (isSameLevel || isSlibing) {
      throw new Error("同级别不移动");
    } else {
      // re link parent
      const { data: willUpdate } = await supabase
        .from("Menu")
        .select("id, code")
        .like("code", `${sourceCode}%`);
      const prefix = new RegExp(`^${sourceCodes.slice(0, -1).join("#")}`);
      // order

      const upto = willUpdate?.map((item, idx) => {
        return {
          id: item.id,
          parent_id: target ?? 0,
          order: idx + 1,
          code: item.code.replace(prefix, `${targetCode}`).replace("##", "#"),
        };
      });

      await supabase.from("Menu").upsert(upto);
    }
  },

  async tree(treeCode = "#") {
    const resp = await supabase
      .from("Menu")
      .select("*")
      .like("code", `${treeCode}%`);
    const list = resp.data;
    list?.sort((a, b) => {
      const cmp = a.code.split("#").length - b.code.split("#").length;
      return cmp > 0 ? 1 : -1;
    });
    const tree = list?.reduce(
      (info, item) => {
        const codes = item.code.split("#");
        codes.pop();
        const parentCode = codes.join("#");

        if (!info.map[parentCode]) {
          info.ll.push(item);
          // reference
          info.map[item.code] = info.ll[info.ll.length - 1];
          info.ll.sort(sortBy("ASC"));
          // info.ll.sort((a: any, b: any) => (a.sort - b.sort > 0 ? -1 : 1));
        } else {
          const parent = info.map[parentCode];
          parent.children = parent.children ?? [];
          parent.children.push(item);
          // reference
          info.map[item.code] = parent.children[parent.children.length - 1];
          parent.children.sort(sortBy("ASC"));
        }
        return info;
      },
      { ll: [], map: {} },
    );
    return tree.ll as Menu[];
  },
} as const;
