import { ComputedRef, MaybeRef, MaybeRefOrGetter, WritableComputedRef } from "vue";
import * as changeCase from "change-case";
import { Options } from "change-case";

//#region useChangeCase/index.d.ts
type EndsWithCase<T> = T extends `${infer _}Case` ? T : never;
type FilterKeys<T> = { [K in keyof T as K extends string ? K : never]: EndsWithCase<K> };
type ChangeCaseKeys = FilterKeys<typeof changeCase>;
type ChangeCaseType = ChangeCaseKeys[keyof ChangeCaseKeys];
declare function useChangeCase(input: MaybeRef<string>, type: MaybeRefOrGetter<ChangeCaseType>, options?: MaybeRefOrGetter<Options> | undefined): WritableComputedRef<string>;
declare function useChangeCase(input: MaybeRefOrGetter<string>, type: MaybeRefOrGetter<ChangeCaseType>, options?: MaybeRefOrGetter<Options> | undefined): ComputedRef<string>;
//#endregion
export { useChangeCase as n, ChangeCaseType as t };