import { tryOnScopeDispose } from "@vueuse/shared";
import { ref, shallowRef, watch } from "vue";
import { createEventHook, unrefElement } from "@vueuse/core";
import { createDrauu } from "drauu";

//#region useDrauu/index.ts
/**
* Reactive drauu
*
* @see https://vueuse.org/useDrauu
* @param target The target svg element
* @param options Drauu Options
*/
function useDrauu(target, options) {
	const drauuInstance = ref();
	let disposables = [];
	const onChangedHook = createEventHook();
	const onCanceledHook = createEventHook();
	const onCommittedHook = createEventHook();
	const onStartHook = createEventHook();
	const onEndHook = createEventHook();
	const canUndo = shallowRef(false);
	const canRedo = shallowRef(false);
	const altPressed = shallowRef(false);
	const shiftPressed = shallowRef(false);
	const brush = ref({
		color: "black",
		size: 3,
		arrowEnd: false,
		cornerRadius: 0,
		dasharray: void 0,
		fill: "transparent",
		mode: "draw",
		...options === null || options === void 0 ? void 0 : options.brush
	});
	watch(brush, () => {
		const instance = drauuInstance.value;
		if (instance) {
			instance.brush = brush.value;
			instance.mode = brush.value.mode;
		}
	}, { deep: true });
	const undo = () => {
		var _drauuInstance$value;
		return (_drauuInstance$value = drauuInstance.value) === null || _drauuInstance$value === void 0 ? void 0 : _drauuInstance$value.undo();
	};
	const redo = () => {
		var _drauuInstance$value2;
		return (_drauuInstance$value2 = drauuInstance.value) === null || _drauuInstance$value2 === void 0 ? void 0 : _drauuInstance$value2.redo();
	};
	const clear = () => {
		var _drauuInstance$value3;
		return (_drauuInstance$value3 = drauuInstance.value) === null || _drauuInstance$value3 === void 0 ? void 0 : _drauuInstance$value3.clear();
	};
	const cancel = () => {
		var _drauuInstance$value4;
		return (_drauuInstance$value4 = drauuInstance.value) === null || _drauuInstance$value4 === void 0 ? void 0 : _drauuInstance$value4.cancel();
	};
	const load = (svg) => {
		var _drauuInstance$value5;
		return (_drauuInstance$value5 = drauuInstance.value) === null || _drauuInstance$value5 === void 0 ? void 0 : _drauuInstance$value5.load(svg);
	};
	const dump = () => {
		var _drauuInstance$value6;
		return (_drauuInstance$value6 = drauuInstance.value) === null || _drauuInstance$value6 === void 0 ? void 0 : _drauuInstance$value6.dump();
	};
	const cleanup = () => {
		var _drauuInstance$value7;
		disposables.forEach((dispose) => dispose());
		(_drauuInstance$value7 = drauuInstance.value) === null || _drauuInstance$value7 === void 0 || _drauuInstance$value7.unmount();
	};
	const syncStatus = () => {
		if (drauuInstance.value) {
			canUndo.value = drauuInstance.value.canUndo();
			canRedo.value = drauuInstance.value.canRedo();
			altPressed.value = drauuInstance.value.altPressed;
			shiftPressed.value = drauuInstance.value.shiftPressed;
		}
	};
	watch(() => unrefElement(target), (el) => {
		if (!el || typeof SVGSVGElement === "undefined" || !(el instanceof SVGSVGElement)) return;
		if (drauuInstance.value) cleanup();
		drauuInstance.value = createDrauu({
			el,
			...options
		});
		syncStatus();
		disposables = [
			drauuInstance.value.on("canceled", () => onCanceledHook.trigger()),
			drauuInstance.value.on("committed", (node) => onCommittedHook.trigger(node)),
			drauuInstance.value.on("start", () => onStartHook.trigger()),
			drauuInstance.value.on("end", () => onEndHook.trigger()),
			drauuInstance.value.on("changed", () => {
				syncStatus();
				onChangedHook.trigger();
			})
		];
	}, { flush: "post" });
	tryOnScopeDispose(() => cleanup());
	return {
		drauuInstance,
		load,
		dump,
		clear,
		cancel,
		undo,
		redo,
		canUndo,
		canRedo,
		brush,
		onChanged: onChangedHook.on,
		onCommitted: onCommittedHook.on,
		onStart: onStartHook.on,
		onEnd: onEndHook.on,
		onCanceled: onCanceledHook.on
	};
}

//#endregion
export { useDrauu as t };