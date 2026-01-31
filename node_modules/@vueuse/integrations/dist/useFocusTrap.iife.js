(function(exports, __vueuse_core, __vueuse_shared, focus_trap, vue) {

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
focus_trap = __toESM(focus_trap);
vue = __toESM(vue);

//#region useFocusTrap/index.ts
/**
	* Reactive focus-trap
	*
	* @see https://vueuse.org/useFocusTrap
	*/
	function useFocusTrap(target, options = {}) {
		let trap;
		const { immediate,...focusTrapOptions } = options;
		const hasFocus = (0, vue.shallowRef)(false);
		const isPaused = (0, vue.shallowRef)(false);
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
		(0, vue.watch)((0, vue.computed)(() => {
			return (0, __vueuse_core.toArray)((0, vue.toValue)(target)).map((el) => {
				const _el = (0, vue.toValue)(el);
				return typeof _el === "string" ? _el : (0, __vueuse_core.unrefElement)(_el);
			}).filter(__vueuse_shared.notNullish);
		}), (els) => {
			if (!els.length) return;
			if (!trap) {
				trap = (0, focus_trap.createFocusTrap)(els, {
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
		(0, __vueuse_core.tryOnScopeDispose)(() => deactivate());
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
exports.useFocusTrap = useFocusTrap;
})(this.VueUse = this.VueUse || {}, VueUse, VueUse, focusTrap, Vue);