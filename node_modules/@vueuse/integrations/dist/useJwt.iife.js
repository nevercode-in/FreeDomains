(function(exports, jwt_decode, vue) {

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
jwt_decode = __toESM(jwt_decode);
vue = __toESM(vue);

//#region useJwt/index.ts
/**
	* Reactive decoded jwt token.
	*
	* @see https://vueuse.org/useJwt
	*/
	function useJwt(encodedJwt, options = {}) {
		const { onError, fallbackValue = null } = options;
		const decodeWithFallback = (encodedJwt$1, options$1) => {
			try {
				return (0, jwt_decode.jwtDecode)(encodedJwt$1, options$1);
			} catch (err) {
				onError === null || onError === void 0 || onError(err);
				return fallbackValue;
			}
		};
		return {
			header: (0, vue.computed)(() => decodeWithFallback((0, vue.toValue)(encodedJwt), { header: true })),
			payload: (0, vue.computed)(() => decodeWithFallback((0, vue.toValue)(encodedJwt)))
		};
	}

//#endregion
exports.useJwt = useJwt;
})(this.VueUse = this.VueUse || {}, jwt_decode, Vue);