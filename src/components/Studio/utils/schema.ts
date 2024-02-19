import { Engine } from "@done/core";
import { message } from "antd";
import { transformToSchema, transformToTreeNode } from "./transformer";

export const saveSchema = (designer: Engine) => {
  const tree = transformToSchema(designer.getCurrentTree()!);
  // localStorage.setItem("formily-schema", JSON.stringify(tree));
  return tree;
};

export const loadInitialSchema = (designer: Engine, schema: any) => {
  console.log(`🚀 ~ loadInitialSchema ~ schema:`, schema);
  try {
    designer.setCurrentTree(
      // transformToTreeNode(JSON.parse(localStorage.getItem("formily-schema")!)),
      transformToTreeNode(schema),
    );
  } catch (err) {
    console.log(`🚀 ~ loadInitialSchema ~ err:`, err);
  }
};

export const helper = (designer: Engine) => {
  return {
    get: () => {
      const tree = transformToSchema(designer.getCurrentTree()!);
      return tree;
    },
    set: (schema: any) => {
      designer.setCurrentTree(transformToTreeNode(schema));
    },
  };
};
