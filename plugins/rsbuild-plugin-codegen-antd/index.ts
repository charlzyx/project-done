import type { RsbuildPlugin, RsbuildPluginAPI } from "@rsbuild/core";
import chokidar from "chokidar";
import fs, { PathLike } from "fs";
import path from "path";
import mustache from "mustache";
import { gen, GenOptions, checkDeps, MatchRule } from "./utils";
import validatePkgName from "validate-npm-package-name";
import { match, scan } from "./utils";

const tplRoot = path.resolve(__dirname, "./tpls");
const fragmentRoot = path.resolve(__dirname, "./fragments");
const deps = [
  "@ant-design/icons@^5.3.0",
  "@ant-design/pro-components@^2.6.49",
  "@emotion/css@^11.11.2",
  "antd@^5.13.3",
];

const scanRoute = (pagesRoot: string, prefix: string) => {
  const imports = [
    `import Skeleton from '@ant-design/pro-skeleton';`,
    `import React from 'react';`,
    // `const Home = React.lazy(() => import('./pages/Home')); `
  ];
  const matching = /index\.(ts|tsx)$/;
  const files = scan(pagesRoot, matching);
  files.sort((a, b) => {
    return a.length - b.length > 0 ? 1 : -1;
  });
  const pathToName = (x: string, last = false) => {
    if (last) {
      const segs = x.split("/");
      return segs[segs.length - 1].replace(/\w/, (m) => m.toUpperCase());
    } else {
      return x.replace(/\/\w/g, (m) => m.replace("/", "").toUpperCase());
    }
  };
  const routes = files.reduce((tree, file) => {
    const base = file.replace(pagesRoot, "").replace(/\/index\.(ts|tsx)$/, "");
    const segs = base.split("/");
    segs.pop();
    const parent = segs.join("/");

    if (tree[parent]) {
      tree[parent].routes = tree[parent].routes ?? [];
      imports.push(
        `const ${pathToName(
          base,
        )} = React.lazy(() => import('${prefix}${base}'));`,
      );
      tree[parent].routes.push({
        element: pathToName(base),
        name: pathToName(base, true),
        path: base.replace(`${parent}/`, ""),
        component: `${prefix}${base}`,
        routes: null,
      });
    } else {
      imports.push(
        `const ${pathToName(
          base,
        )} = React.lazy(() => import('${prefix}${base}'));`,
      );
      tree[base] = {
        element: pathToName(base),
        name: pathToName(base, true),
        path: base,
        component: `${prefix}${base}`,
        routes: null,
      };
    }
    return tree;
  }, {});
  return [
    imports.map((item) => ({ import: item })),
    Object.keys(routes).map((routepath) => routes[routepath]),
  ] as const;
};

export const pluginCodegenAntd = ({ autoInstall = false }): RsbuildPlugin => ({
  name: "plugin-codegen-antd",
  async setup(api) {
    const root = api.context.rootPath;

    const codegen = () => {
      const [routeImports, rootRoute] = scanRoute(
        path.resolve(root, "src/pages"),
        "../pages",
      );
      const data = {
        routeImports,
        rootRoute,
      };
      gen({
        tplRoot: tplRoot,
        fragmentRoot,
        data,
        outRoot: root,
        overwrite: /routes/,
      });
    };

    const packageJSON = JSON.parse(
      fs.readFileSync(path.resolve(root, "package.json")).toString(),
    ) as any;

    const watcher = chokidar.watch(
      path.resolve(root, "src/pages/**/index.tsx"),
      {
        // 忽略不是 index.tsx 结尾的
        // ignored: /^.*(?<!index\.(ts|tsx))$/,
        // ignored: /(^|[\/\\])\../,
        persistent: true,
      },
    );
    watcher
      .on("add", () => {
        console.log("新增了一个文件,重新生成路由");
        codegen();
      })
      .on("unlink", () => {
        console.log("删除了一个文件,重新生成路由");
        codegen();
      })
      .on("addDir", () => {
        console.log("添加了一个文件夹,重新生成路由");
        codegen();
      })
      .on("unlinkDir", () => {
        console.log("删除了一个文件夹,重新生成路由");
        codegen();
      });

    api.onBeforeCreateCompiler(() => {
      checkDeps(packageJSON, deps, autoInstall);
      codegen();
    });
  },
});
