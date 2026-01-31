import { computed, ref, toValue } from "vue";
import * as changeCase from "change-case";

//#region useChangeCase/index.ts
const changeCaseTransforms = /* @__PURE__ */ Object.entries(changeCase).filter(([name, fn]) => typeof fn === "function" && name.endsWith("Case")).reduce((acc, [name, fn]) => {
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
	const typeRef = computed(() => {
		const t = toValue(type);
		if (!changeCaseTransforms[t]) throw new Error(`Invalid change case type "${t}"`);
		return t;
	});
	if (typeof input === "function") return computed(() => changeCaseTransforms[typeRef.value](toValue(input), toValue(options)));
	const text = ref(input);
	return computed({
		get() {
			return changeCaseTransforms[typeRef.value](text.value, toValue(options));
		},
		set(value) {
			text.value = value;
		}
	});
}

//#endregion
export { useChangeCase as t };