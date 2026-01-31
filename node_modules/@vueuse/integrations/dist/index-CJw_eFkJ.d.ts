import { MaybeRefOrGetter, ShallowRef } from "vue";
import { Arrayable, Fn, MaybeComputedElementRef } from "@vueuse/core";
import { ActivateOptions, DeactivateOptions, Options } from "focus-trap";

//#region useFocusTrap/index.d.ts
interface UseFocusTrapOptions extends Options {
  /**
   * Immediately activate the trap
   */
  immediate?: boolean;
}
interface UseFocusTrapReturn {
  /**
   * Indicates if the focus trap is currently active
   */
  hasFocus: ShallowRef<boolean>;
  /**
   * Indicates if the focus trap is currently paused
   */
  isPaused: ShallowRef<boolean>;
  /**
   * Activate the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapactivateactivateoptions
   * @param opts Activate focus trap options
   */
  activate: (opts?: ActivateOptions) => void;
  /**
   * Deactivate the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapdeactivatedeactivateoptions
   * @param opts Deactivate focus trap options
   */
  deactivate: (opts?: DeactivateOptions) => void;
  /**
   * Pause the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trappause
   */
  pause: Fn;
  /**
   * Unpauses the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapunpause
   */
  unpause: Fn;
}
/**
 * Reactive focus-trap
 *
 * @see https://vueuse.org/useFocusTrap
 */
declare function useFocusTrap(target: MaybeRefOrGetter<Arrayable<MaybeRefOrGetter<string> | MaybeComputedElementRef>>, options?: UseFocusTrapOptions): UseFocusTrapReturn;
//#endregion
export { UseFocusTrapReturn as n, useFocusTrap as r, UseFocusTrapOptions as t };