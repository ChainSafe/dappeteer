export declare type Path = string | {
    download: string;
    extract: string;
};
declare const _default: (version: string, location?: Path) => Promise<string>;
export default _default;
