import { globalThisPolyfill } from "@done/shared";
import * as React from "react";
import * as ReactDom from "react-dom";
import * as ReactIs from "react-is";
import * as Antd from "antd";

import * as Done_Shared from "@done/shared";
import * as Done_Core from "@done/core";
import * as Done_React from "@done/react";
import * as Done_SettingsForm from "@done/settings-form";
import * as Formiy_Shared from "@formily/shared";
import * as Formiy_Antd from "@formily/antd";
import * as Formiy_Core from "@formily/core";
import * as Formiy_JsonSchema from "@formily/json-schema";
import * as Formiy_React from "@formily/react";
import * as Formiy_Reactive from "@formily/reactive";
import * as Formiy_ReactiveReact from "@formily/reactive-react";
import { getNpmCDNRegistry, setNpmCDNRegistry } from "@done/settings-form";
const GlobalDeps = {
  React: React,
  ReactDom: ReactDom,
  ReactIs: ReactIs,
  Antd: Antd,
  "Done.Shared": Done_Shared,
  "Done.Core": Done_Core,
  "Done.React": Done_React,
  "Done.SettingsForm": Done_SettingsForm,
  "Formiy.Shared": Formiy_Shared,
  "Formiy.Antd": Formiy_Antd,
  "Formiy.Core": Formiy_Core,
  "Formiy.JsonSchema": Formiy_JsonSchema,
  "Formiy.React": Formiy_React,
  "Formiy.Reactive": Formiy_Reactive,
  "Formiy.ReactiveReact": Formiy_ReactiveReact,
};
// import { getNpmCDNRegistry } from "../registry";
export interface ILoadScriptProps {
  package: string;
  root: string;
}

const anyGlobal = globalThisPolyfill as any;

const loadScript = (path: string, name: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = false;
    script.src = path;
    script.onload = () => {
      const module = anyGlobal[name];
      anyGlobal["define"] = define;
      resolve(module);
      script.remove();
    };
    script.onerror = (err) => {
      reject(err);
    };
    const define = anyGlobal["define"];
    anyGlobal["define"] = undefined;
    document.body.appendChild(script);
  });
};

const loadCSS = (url: string) => {
  return new Promise((resolve, reject) => {
    const csslink = document.createElement("link");
    csslink.href = url;
    document.body.appendChild(csslink);
    resolve(true);
  });
};

export const loadPreset = async (props: ILoadScriptProps) => {
  if (anyGlobal[props.root]) return anyGlobal[props.root];
  // prepare
  Object.keys(GlobalDeps).forEach((name) => {
    (window as any)[name] = GlobalDeps[name as keyof typeof GlobalDeps];
  });

  const base = getNpmCDNRegistry();
  // localhost:4567/@done/preset-antd@1.0.0-beta.0/dist/umd/deps.min.js
  const basepath = `${base}/${props.package}/dist/umd`;
  // const path = `${options.base}/${options.package}/${options.entry}`;
  return Promise.all([
    loadCSS(`${basepath}/preset.min.css`),
    loadScript(`${basepath}/deps.min.js`, "DoneDeps"),
  ])
    .then(() => {
      return loadScript(`${basepath}/preset.min.js`, "DonePreset").then(
        (mod) => {
          anyGlobal[props.root] = mod;
          return mod;
        },
      );
    })
    .catch((err) => {
      console.log("errr", err);
    });
};
