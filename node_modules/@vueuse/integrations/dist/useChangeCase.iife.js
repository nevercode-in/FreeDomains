(function(exports, change_case, vue) {

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
change_case = __toESM(change_case);
vue = __toESM(vue);

//#region useChangeCase/index.ts
	const changeCaseTransforms = /* @__PURE__ */ Object.entries(change_case).filter(([name, fn]) => typeof fn === "function" && name.endsWith("Case")).reduce((acc, [name, fn]) => {
		acc[name] = fn;
		return acc;
	}, {});
	/**
	* Reactive wrapper for `change-case`
	*
	* @see https://vueuse.org/useChangeCase
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function useChangeCase(input, type, options) {
		const typeRef = (0, vue.computed)(() => {
			const t = (0, vue.toValue)(type);
			if (!changeCaseTransforms[t]) throw new Error(`Invalid change case type "${t}"`);
			return t;
		});
		if (typeof input === "function") return (0, vue.computed)(() => changeCaseTransforms[typeRef.value]((0, vue.toValue)(input), (0, vue.toValue)(options)));
		const text = (0, vue.ref)(input);
		return (0, vue.computed)({
			get() {
				return changeCaseTransforms[typeRef.value](text.value, (0, vue.toValue)(options));
			},
			set(value) {
				text.value = value;
			}
		});
	}

//#endregion
exports.useChangeCase = useChangeCase;
})(this.VueUse = this.VueUse || {}, changeCase, Vue);