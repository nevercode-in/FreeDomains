import { Ref, ShallowRef } from "vue";
import { EventHookOn, MaybeComputedElementRef } from "@vueuse/core";
import { Brush, Drauu, Options } from "drauu";

//#region useDrauu/index.d.ts
type UseDrauuOptions = Omit<Options, 'el'>;
interface UseDrauuReturn {
  drauuInstance: Ref<Drauu | undefined>;
  load: (svg: string) => void;
  dump: () => string | undefined;
  clear: () => void;
  cancel: () => void;
  undo: () => boolean | undefined;
  redo: () => boolean | undefined;
  canUndo: ShallowRef<boolean>;
  canRedo: ShallowRef<boolean>;
  brush: Ref<Brush>;
  onChanged: EventHookOn;
  onCommitted: EventHookOn;
  onStart: EventHookOn;
  onEnd: EventHookOn;
  onCanceled: EventHookOn;
}
/**
 * Reactive drauu
 *
 * @see https://vueuse.org/useDrauu
 * @param target The target svg element
 * @param options Drauu Options
 */
declare function useDrauu(target: MaybeComputedElementRef, options?: UseDrauuOptions): UseDrauuReturn;
//#endregion
export { UseDrauuReturn as n, useDrauu as r, UseDrauuOptions as t };