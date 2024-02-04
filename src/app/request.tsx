import { SWRConfig, SWRConfiguration } from "swr";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { message } from "antd";

export const supabase = createClient(
  "http://127.0.0.1:8000",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE",
);

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<
    Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"] | null
  >(null);
  useEffect(() => {
    setLoading(true);
    supabase.auth
      .signInWithPassword({
        email: "chao@qq.com",
        password: "chao.666",
      })
      .then((resp) => {
        if (resp.error) {
          message.error(resp.error.message);
        } else {
          setData(resp.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, data] as const;
};

export const fetcher: SWRConfiguration["fetcher"] = (resource, init) =>
  fetch(resource, init).then((res) => res.json());

export const SWRProvider: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <SWRConfig
      value={{
        // refreshInterval: 3000,
        fetcher,
      }}
    >
      {props.children}
    </SWRConfig>
  );
};
