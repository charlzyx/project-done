import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { supabase } from "./utils";

export { supabase } from "../app/request";

export const unbox = <
  T extends void | Record<string, any> | Record<string, any>[] = void,
>(
  query: PromiseLike<PostgrestSingleResponse<any>>,
): T extends Array<infer P>
  ? Promise<{
      data: P[];
      count: number;
    }>
  : Promise<T> => {
  return Promise.resolve(
    query.then((resp) => {
      if (resp.error) {
        throw resp.error;
      } else {
        return Array.isArray(resp.data)
          ? ({
              count: resp.count,
              data: resp.data,
            } as any)
          : resp.data;
      }
    }),
  ) as any;
};

export type ListQuery<T> = {
  current: number;
  pageSize: number;
} & T;
