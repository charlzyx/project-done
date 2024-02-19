import { PostgrestResponse } from "@supabase/supabase-js";
import { ListQuery, supabase, unbox } from "../utils";

type DataPage = {
  id?: number;
  created_at?: string;
  meta: string;
};

export const page = {
  async upsert(neo: DataPage) {
    await supabase.from("Page").upsert(neo).eq("id", neo.id).select();
  },
  async info(id: string) {
    const resp = await supabase.from("Page").select("*").eq("id", +id);
    return resp;
  },
} as const;
