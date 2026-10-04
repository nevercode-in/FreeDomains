(function(exports, _vueuse_shared, qrcode, vue) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region \0rolldown/runtime.js
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
	qrcode = __toESM(qrcode, 1);
	//#region useQRCode/index.ts
	/**
	* Wrapper for qrcode.
	*
	* @see https://vueuse.org/useQRCode
	* @param text
	* @param options
	*/
	function useQRCode(text, options) {
		const src = (0, _vueuse_shared.toRef)(text);
		const result = (0, vue.shallowRef)("");
		(0, vue.watch)(src, async (value) => {
			if (src.value && _vueuse_shared.isClient) result.value = await qrcode.default.toDataURL(value, options);
		}, { immediate: true });
		return result;
	}
	//#endregion
	exports.useQRCode = useQRCode;
})(this.VueUse = this.VueUse || {}, VueUse, QRCode, Vue);
