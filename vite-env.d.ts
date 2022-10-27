declare module "virtual:my-module" {
  export const INDEX_DATA: Object;
  export const PREVIEW_LOOKUP: Object;
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
