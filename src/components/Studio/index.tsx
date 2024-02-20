import { GlobalRegistry, KeyCode, Shortcut, createDesigner } from "@done/core";
import {
  ComponentTreeWidget,
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewToolsWidget,
  ViewportPanel,
  Workspace,
  WorkspacePanel,
} from "@done/react";
import { SettingsForm, setNpmCDNRegistry } from "@done/settings-form";
import "./style.css";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { saveSchema, loadPreset, transformToTreeNode } from "./utils";
import {
  ActionsWidget,
  MarkupSchemaWidget,
  PreviewWidget,
  SchemaEditorWidget,
} from "./widgets";
export { PreviewWidget } from "./widgets";
export { transformToTreeNode } from "./utils";
import { PageLoading } from "@ant-design/pro-components";

// setNpmCDNRegistry("//unpkg.com");
setNpmCDNRegistry("//127.0.0.1:4567");

GlobalRegistry.registerDesignerLocales({
  "zh-CN": {
    sources: {
      Inputs: "输入控件",
      Layouts: "布局组件",
      Arrays: "自增组件",
      Displays: "展示组件",
    },
  },
  "en-US": {
    sources: {
      Inputs: "Inputs",
      Layouts: "Layouts",
      Arrays: "Arrays",
      Displays: "Displays",
    },
  },
});

const usePresetAntd = () => {
  const once = useRef(false);
  const [loading, setLoading] = useState(false);
  const [Preset, setPreset] = useState<any>({});
  useEffect(() => {
    if (once.current) return;
    once.current = true;
    loadPreset({
      package: "@done/preset-antd",
      root: "DonePreset",
    })
      .then(setPreset)
      .then(() => {
        setLoading(false);
      });
  }, []);

  return [loading, Preset];
};

export const Studio = (props: {
  onSave: (json: any) => Promise<void>;
  schema: any;
}) => {
  const [loading, Preset] = usePresetAntd();
  const engine = useMemo(() => {
    if (Preset?.Form) {
      const dd = createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              const tree = saveSchema(ctx.engine);
              props.onSave?.(tree);
            },
          }),
        ],
        rootComponentName: "Form",
      });
      // init
      setTimeout(() => {
        engine?.setCurrentTree(transformToTreeNode(props.schema));
      });

      return dd;
    } else {
      null;
    }
  }, [loading, Preset?.Form]);

  const {
    Form,
    Field,
    Input,
    Select,
    TreeSelect,
    Cascader,
    Radio,
    Checkbox,
    Slider,
    Rate,
    NumberPicker,
    Transfer,
    Password,
    DatePicker,
    TimePicker,
    Upload,
    Switch,
    Text,
    Card,
    ArrayCards,
    ObjectContainer,
    ArrayTable,
    Space,
    FormTab,
    FormCollapse,
    FormLayout,
    FormGrid,
  } = Preset as any;

  return loading || !Preset?.Form ? (
    <PageLoading></PageLoading>
  ) : (
    <Designer engine={engine!} position="absolute">
      <StudioPanel
        // logo={<LogoWidget />}
        actions={<ActionsWidget onSave={props.onSave} />}
      >
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget
              title="sources.Inputs"
              sources={[
                Input,
                Password,
                NumberPicker,
                Rate,
                Slider,
                Select,
                TreeSelect,
                Cascader,
                Transfer,
                Checkbox,
                Radio,
                DatePicker,
                TimePicker,
                Upload,
                Switch,
                ObjectContainer,
              ]}
            />
            <ResourceWidget
              title="sources.Layouts"
              sources={[
                Card,
                FormGrid,
                FormTab,
                FormLayout,
                FormCollapse,
                Space,
              ]}
            />
            <ResourceWidget
              title="sources.Arrays"
              sources={[ArrayCards, ArrayTable]}
            />
            <ResourceWidget title="sources.Displays" sources={[Text]} />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget
                use={["DESIGNABLE", "JSONTREE", "MARKUP", "PREVIEW"]}
              />
            </ToolbarPanel>
            <ViewportPanel style={{ height: "100%" }}>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
                      Form,
                      Field,
                      Input,
                      Select,
                      TreeSelect,
                      Cascader,
                      Radio,
                      Checkbox,
                      Slider,
                      Rate,
                      NumberPicker,
                      Transfer,
                      Password,
                      DatePicker,
                      TimePicker,
                      Upload,
                      Switch,
                      Text,
                      Card,
                      ArrayCards,
                      ArrayTable,
                      Space,
                      FormTab,
                      FormCollapse,
                      FormGrid,
                      FormLayout,
                      ObjectContainer,
                    }}
                  />
                )}
              </ViewPanel>
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => (
                  <SchemaEditorWidget tree={tree} onChange={onChange} />
                )}
              </ViewPanel>
              <ViewPanel type="MARKUP" scrollable={false}>
                {(tree) => <MarkupSchemaWidget tree={tree} />}
              </ViewPanel>
              <ViewPanel type="PREVIEW">
                {(tree) => <PreviewWidget tree={tree} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  );
};
