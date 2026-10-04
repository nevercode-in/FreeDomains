import { MaybeRefOrGetter, Ref, WritableComputedRef } from "vue";
import { NProgress, NProgressOptions } from "nprogress";
//#region useNProgress/index.d.ts
type UseNProgressOptions = Partial<NProgressOptions>;
interface UseNProgressReturn {
  isLoading: WritableComputedRef<boolean, boolean>;
  progress: Ref<number | null | undefined>;
  start: () => NProgress;
  done: (force?: boolean) => NProgress;
  remove: () => void;
}
/**
 * Reactive progress bar.
 *
 * @see https://vueuse.org/useNProgress
 */
declare function useNProgress(currentProgress?: MaybeRefOrGetter<number | null | undefined>, options?: UseNProgressOptions): UseNProgressReturn;
//#endregion
export { UseNProgressOptions, UseNProgressReturn, useNProgress };