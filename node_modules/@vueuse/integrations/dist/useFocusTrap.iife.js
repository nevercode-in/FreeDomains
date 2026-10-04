(function(exports, _vueuse_core, _vueuse_shared, focus_trap, vue) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region useFocusTrap/index.ts
	/**
	* Reactive focus-trap
	*
	* @see https://vueuse.org/useFocusTrap
	*/
	function useFocusTrap(target, options = {}) {
		let trap;
		const { immediate, ...focusTrapOptions } = options;
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
			return (0, _vueuse_core.toArray)((0, vue.toValue)(target)).map((el) => {
				const _el = (0, vue.toValue)(el);
				return typeof _el === "string" ? _el : (0, _vueuse_core.unrefElement)(_el);
			}).filter(_vueuse_shared.notNullish);
		}), (els) => {
			if (!els.length) return;
			if (!trap) {
				trap = (0, focus_trap.createFocusTrap)(els, {
					...focusTrapOptions,
					onActivate(params) {
						hasFocus.value = true;
						if (options.onActivate) options.onActivate(params);
					},
					onDeactivate(params) {
						hasFocus.value = false;
						if (options.onDeactivate) options.onDeactivate(params);
					}
				});
				if (immediate) activate();
			} else {
				const isActive = trap === null || trap === void 0 ? void 0 : trap.active;
				trap === null || trap === void 0 || trap.updateContainerElements(els);
				if (!isActive && immediate) activate();
			}
		}, { flush: "post" });
		(0, _vueuse_core.tryOnScopeDispose)(() => deactivate());
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
