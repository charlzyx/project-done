import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginCodegenAntd } from "./plugins/rsbuild-plugin-codegen-antd";

export default defineConfig({
  plugins: [pluginReact(), pluginCodegenAntd({ autoInstall: true })],
  tools: {
    less: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  },
});
