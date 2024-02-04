import type { RsbuildPlugin } from "@rsbuild/core";
import chokidar from "chokidar";
import path from "path";
import { copy, scan } from "@achaogpt/kakashi";

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
        index: /index\.(ts|tsx)$/.test(base),
        element: pathToName(base),
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
    const tplRoot = path.resolve(__dirname, "./templates");

    const codegen = () => {
      const [routeImports, rootRoute] = scanRoute(
        path.resolve(root, "src/pages"),
        "../pages",
      );
      const data = {
        routeImports,
        rootRoute,
      };
      copy({
        tplRoot: tplRoot,
        data,
        outRoot: root,
        tags: ["[[", "]]"],
        overwrite: /routes/,
      });
    };

    const watcher = chokidar.watch(
      path.resolve(root, "src/pages/**/index.tsx"),
      {
        interval: 1000,
      },
    );
    watcher
      .on("add", () => {
        codegen();
      })
      .on("unlink", () => {
        codegen();
      })
      .on("addDir", () => {
        codegen();
      })
      .on("unlinkDir", () => {
        codegen();
      });

    api.onBeforeCreateCompiler(() => {
      codegen();
    });
  },
});
