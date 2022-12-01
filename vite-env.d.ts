declare module "virtual:search-data" {
  export default {
    INDEX_DATA: Record<string, any>,
    PREVIEW_LOOKUP: Record<string, any>,
    Options: Record<string, any>
  }
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
