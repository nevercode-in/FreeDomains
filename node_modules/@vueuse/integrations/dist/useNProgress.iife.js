(function(exports, __vueuse_shared, nprogress, vue) {

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
__vueuse_shared = __toESM(__vueuse_shared);
nprogress = __toESM(nprogress);
vue = __toESM(vue);

//#region useNProgress/index.ts
/**
	* Reactive progress bar.
	*
	* @see https://vueuse.org/useNProgress
	*/
	function useNProgress(currentProgress = null, options) {
		const progress = (0, __vueuse_shared.toRef)(currentProgress);
		const isLoading = (0, vue.computed)({
			set: (load) => load ? nprogress.default.start() : nprogress.default.done(),
			get: () => typeof progress.value === "number" && progress.value < 1
		});
		if (options) nprogress.default.configure(options);
		const setProgress = nprogress.default.set;
		nprogress.default.set = (n) => {
			progress.value = n;
			return setProgress.call(nprogress.default, n);
		};
		(0, vue.watchEffect)(() => {
			if (typeof progress.value === "number" && __vueuse_shared.isClient) setProgress.call(nprogress.default, progress.value);
		});
		(0, __vueuse_shared.tryOnScopeDispose)(nprogress.default.remove);
		return {
			isLoading,
			progress,
			start: nprogress.default.start,
			done: nprogress.default.done,
			remove: () => {
				progress.value = null;
				nprogress.default.remove();
			}
		};
	}

//#endregion
exports.useNProgress = useNProgress;
})(this.VueUse = this.VueUse || {}, VueUse, nprogress, Vue);