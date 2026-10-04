(function(exports, jwt_decode, vue) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region useJwt/index.ts
	/**
	* Reactive decoded jwt token.
	*
	* @see https://vueuse.org/useJwt
	*/
	function useJwt(encodedJwt, options = {}) {
		const { onError, fallbackValue = null } = options;
		const decodeWithFallback = (encodedJwt, options) => {
			try {
				return (0, jwt_decode.jwtDecode)(encodedJwt, options);
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
