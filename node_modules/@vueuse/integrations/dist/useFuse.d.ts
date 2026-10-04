import { ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
//#region useFuse/index.d.ts
type FuseOptions<T> = IFuseOptions<T>;
interface UseFuseOptions<T> {
  fuseOptions?: FuseOptions<T>;
  resultLimit?: number;
  matchAllWhenSearchEmpty?: boolean;
}
interface UseFuseReturn<DataItem> {
  fuse: Ref<Fuse<DataItem>>;
  results: ComputedRef<FuseResult<DataItem>[]>;
}
declare function useFuse<DataItem>(search: MaybeRefOrGetter<string>, data: MaybeRefOrGetter<DataItem[]>, options?: MaybeRefOrGetter<UseFuseOptions<DataItem>>): UseFuseReturn<DataItem>;
//#endregion
export { FuseOptions, UseFuseOptions, UseFuseReturn, useFuse };