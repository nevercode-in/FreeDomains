import { computed, toValue } from "vue";
import { jwtDecode } from "jwt-decode";
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
			return jwtDecode(encodedJwt, options);
		} catch (err) {
			onError === null || onError === void 0 || onError(err);
			return fallbackValue;
		}
	};
	return {
		header: computed(() => decodeWithFallback(toValue(encodedJwt), { header: true })),
		payload: computed(() => decodeWithFallback(toValue(encodedJwt)))
	};
}
//#endregion
export { useJwt };
