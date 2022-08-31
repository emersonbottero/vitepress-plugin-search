declare module 'virtual:my-module' {
    export const msg: string
}

declare module '*.vue' {
    import {DefineComponent} from 'vue'
    const component : DefineComponent<{},{},any>
    export default component
}