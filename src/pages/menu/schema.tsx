import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ISchema } from "@formily/react";

export const schema: ISchema = {
  type: "object",
  properties: {
    querylist: {
      type: "void",
      "x-component": "QueryList",
      "x-component-props": {
        service: "{{service}}",
        queryRef: "{{querylist}}",
      },
      properties: {
        list: {
          type: "array",
          "x-component": "QueryTable",
          "x-component-props": {
            rowKey: "id",
            onRemove: "{{onRemove}}",
            onSortEnd: "{{onSortEnd}}",
            onMoveUp: "{{onMoveUp}}",
            onMoveDown: "{{onMoveDown}}",
          },
          items: {
            type: "object",
            properties: {
              _id: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  width: 200,
                  title: "ID",
                },
                properties: {
                  sorter: {
                    type: "void",
                    "x-component": "ProArrayTable.SortHandle",
                  },
                  indent: {
                    type: "void",
                    "x-component": "Indent",
                  },
                  name: {
                    type: "string",
                    "x-component": "Input",
                    "x-read-pretty": true,
                  },

                  // indent: {
                  //   type: "number",
                  //   "x-component": "Indent",
                  // },
                },
              },
              _move: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  width: 80,
                  title: "排序",
                },
                properties: {
                  _indent: {
                    type: "void",
                    "x-component": "Indent",
                    properties: {
                      _moveup: {
                        type: "void",
                        "x-display":
                          "{{$record.canMoveUp ? 'visible': 'hidden'}}",
                        "x-component": "ProArrayTable.MoveUp",
                        "x-component-props": {
                          confirm: true,
                        },
                      },
                      _movedown: {
                        type: "void",
                        "x-display":
                          "{{$record.canMoveDown ? 'visible': 'hidden'}}",
                        "x-component": "ProArrayTable.MoveDown",
                        "x-component-props": {
                          confirm: true,
                        },
                      },
                    },
                  },
                },
              },
              _order: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  align: "left",
                  title: "排序",
                },
                properties: {
                  indent: {
                    type: "number",
                    "x-component": "Indent",
                  },
                  order: {
                    type: "string",
                    "x-component": "Input",
                    "x-read-pretty": true,
                  },
                },
              },
              _code: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": {
                  title: "名称",
                },
                properties: {
                  code: {
                    type: "string",
                    "x-component": "Input",
                    "x-read-pretty": true,
                  },
                },
              },
              // _name: {
              //   type: "void",
              //   "x-component": "ProArrayTable.Column",
              //   "x-component-props": {
              //     title: "名称",
              //   },
              //   properties: {
              //     name: {
              //       type: "string",
              //       "x-component": "Input",
              //       "x-read-pretty": true,
              //     },
              //   },
              // },
              // _created_at: {
              //   type: "void",
              //   "x-component": "ProArrayTable.Column",
              //   "x-component-props": {
              //     title: "创建时间",
              //   },
              //   properties: {
              //     created_at: {
              //       type: "string",
              //       "x-component": "Input",
              //       "x-read-pretty": true,
              //     },
              //   },
              // },
              _action: {
                type: "void",
                "x-component": "ProArrayTable.Column",
                "x-component-props": { title: "操作", align: "right" },
                properties: {
                  _edit: {
                    type: "void",
                    "x-decorator": "ProArrayTable.DelegateAction",
                    "x-decorator-props": {
                      act: "edit",
                    },
                    "x-component": "Button",
                    "x-component-props": {
                      type: "link",
                      icon: <EditOutlined></EditOutlined>,
                      // children: "编辑",
                    },
                  },
                  _addsub: {
                    type: "void",
                    "x-decorator": "ProArrayTable.DelegateAction",
                    "x-decorator-props": {
                      act: "addsub",
                      initLoader: (parent: any) => {
                        console.log(`🚀 ~ parent:`, parent);
                        return {
                          parent_id: parent.id,
                        };
                      },
                    },
                    "x-component": "Button",
                    "x-component-props": {
                      type: "link",
                      icon: <PlusOutlined></PlusOutlined>,
                      // children: "编辑",
                    },
                  },

                  _rm: {
                    type: "void",
                    "x-component": "ProArrayTable.Remove",
                    "x-component-props": {
                      confirm: true,
                    },
                  },
                },
              },
            },
          },
          properties: {
            // ↓ 不填写 act 属性的话, 就读这个 modal 字段
            edit: {
              type: "void",
              "x-component": "ProArrayTable.ShadowModal",
              "x-component-props": {
                onOk: "{{onUpsert}}",
                // act: "edit", // 这里不填写的话, 就读取上面
                schema: {
                  type: "void",
                  properties: {
                    id: {
                      title: "ID",
                      type: "string",
                      "x-read-pretty": true,
                      "x-decorator": "FormItem",
                      "x-component": "Input",
                    },
                    name: {
                      title: "名称",
                      "x-decorator": "FormItem",
                      type: "string",
                      "x-component": "Input",
                    },
                  },
                },
              },
            },
            addsub: {
              type: "void",
              "x-component": "ProArrayTable.ShadowModal",
              "x-component-props": {
                onOk: "{{onAddSub}}",
                schema: {
                  type: "void",
                  properties: {
                    parentCode: {
                      title: "上级code",
                      type: "string",
                      "x-read-pretty": true,
                      "x-decorator": "FormItem",
                      "x-component": "Input",
                    },
                    name: {
                      title: "名称",
                      "x-decorator": "FormItem",
                      type: "string",
                      "x-component": "Input",
                    },
                  },
                },
              },
            },
            add: {
              type: "void",
              "x-component": "ProArrayTable.ProAddition",
              "x-component-props": {
                onOk: "{{onUpsert}}",
                schema: {
                  type: "void",
                  properties: {
                    name: {
                      title: "名称",
                      "x-decorator": "FormItem",
                      type: "string",
                      "x-component": "Input",
                    },
                  },
                },
              },
              title: "添加菜单",
            },
          },
        },
      },
    },
  },
};
