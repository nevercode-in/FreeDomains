(function(exports, __vueuse_core, __vueuse_shared, drauu, vue) {

//#region rolldown:runtime
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));

//#endregion
__vueuse_core = __toESM(__vueuse_core);
__vueuse_shared = __toESM(__vueuse_shared);
drauu = __toESM(drauu);
vue = __toESM(vue);

//#region useDrauu/index.ts
/**
	* Reactive drauu
	*
	* @see https://vueuse.org/useDrauu
	* @param target The target svg element
	* @param options Drauu Options
	*/
	function useDrauu(target, options) {
		const drauuInstance = (0, vue.ref)();
		let disposables = [];
		const onChangedHook = (0, __vueuse_core.createEventHook)();
		const onCanceledHook = (0, __vueuse_core.createEventHook)();
		const onCommittedHook = (0, __vueuse_core.createEventHook)();
		const onStartHook = (0, __vueuse_core.createEventHook)();
		const onEndHook = (0, __vueuse_core.createEventHook)();
		const canUndo = (0, vue.shallowRef)(false);
		const canRedo = (0, vue.shallowRef)(false);
		const altPressed = (0, vue.shallowRef)(false);
		const shiftPressed = (0, vue.shallowRef)(false);
		const brush = (0, vue.ref)({
			color: "black",
			size: 3,
			arrowEnd: false,
			cornerRadius: 0,
			dasharray: void 0,
			fill: "transparent",
			mode: "draw",
			...options === null || options === void 0 ? void 0 : options.brush
		});
		(0, vue.watch)(brush, () => {
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
		(0, vue.watch)(() => (0, __vueuse_core.unrefElement)(target), (el) => {
			if (!el || typeof SVGSVGElement === "undefined" || !(el instanceof SVGSVGElement)) return;
			if (drauuInstance.value) cleanup();
			drauuInstance.value = (0, drauu.createDrauu)({
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
		(0, __vueuse_shared.tryOnScopeDispose)(() => cleanup());
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
exports.useDrauu = useDrauu;
})(this.VueUse = this.VueUse || {}, VueUse, VueUse, Drauu, Vue);