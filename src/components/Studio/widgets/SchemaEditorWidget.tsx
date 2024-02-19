import { ITreeNode, TreeNode } from "@done/core";
import { MonacoInput } from "@done/settings-form";
import React from "react";
import { transformToSchema, transformToTreeNode } from "../utils/transformer";

export interface ISchemaEditorWidgetProps {
  tree: TreeNode;
  onChange?: (tree: ITreeNode) => void;
}

export const SchemaEditorWidget: React.FC<
  React.PropsWithChildren<ISchemaEditorWidgetProps>
> = (props) => {
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(transformToSchema(props.tree), null, 2)}
      onChange={(value) => {
        props.onChange?.(transformToTreeNode(JSON.parse(value)));
      }}
      language="json"
    />
  );
};
