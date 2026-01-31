import { notNullish } from "@vueuse/shared";
import { computed, shallowRef, toValue, watch } from "vue";
import { toArray, tryOnScopeDispose as tryOnScopeDispose$1, unrefElement } from "@vueuse/core";
import { createFocusTrap } from "focus-trap";

//#region useFocusTrap/index.ts
/**
* Reactive focus-trap
*
* @see https://vueuse.org/useFocusTrap
*/
function useFocusTrap(target, options = {}) {
	let trap;
	const { immediate,...focusTrapOptions } = options;
	const hasFocus = shallowRef(false);
	const isPaused = shallowRef(false);
	const activate = (opts) => trap && trap.activate(opts);
	const deactivate = (opts) => trap && trap.deactivate(opts);
	const pause = () => {
		if (trap) {
			trap.pause();
			isPaused.value = true;
		}
	};
	const unpause = () => {
		if (trap) {
			trap.unpause();
			isPaused.value = false;
		}
	};
	watch(computed(() => {
		return toArray(toValue(target)).map((el) => {
			const _el = toValue(el);
			return typeof _el === "string" ? _el : unrefElement(_el);
		}).filter(notNullish);
	}), (els) => {
		if (!els.length) return;
		if (!trap) {
			trap = createFocusTrap(els, {
				...focusTrapOptions,
				onActivate() {
					hasFocus.value = true;
					if (options.onActivate) options.onActivate();
				},
				onDeactivate() {
					hasFocus.value = false;
					if (options.onDeactivate) options.onDeactivate();
				}
			});
			if (immediate) activate();
		} else {
			const isActive = trap === null || trap === void 0 ? void 0 : trap.active;
			trap === null || trap === void 0 || trap.updateContainerElements(els);
			if (!isActive && immediate) activate();
		}
	}, { flush: "post" });
	tryOnScopeDispose$1(() => deactivate());
	return {
		hasFocus,
		isPaused,
		activate,
		deactivate,
		pause,
		unpause
	};
}

//#endregion
export { useFocusTrap as t };