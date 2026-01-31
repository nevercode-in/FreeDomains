import { computed, ref, toValue, watch } from "vue";
import Fuse from "fuse.js";

//#region useFuse/index.ts
function useFuse(search, data, options) {
	const createFuse = () => {
		var _toValue, _toValue2;
		return new Fuse((_toValue = toValue(data)) !== null && _toValue !== void 0 ? _toValue : [], (_toValue2 = toValue(options)) === null || _toValue2 === void 0 ? void 0 : _toValue2.fuseOptions);
	};
	const fuse = ref(createFuse());
	watch(() => {
		var _toValue3;
		return (_toValue3 = toValue(options)) === null || _toValue3 === void 0 ? void 0 : _toValue3.fuseOptions;
	}, () => {
		fuse.value = createFuse();
	}, { deep: true });
	watch(() => toValue(data), (newData) => {
		fuse.value.setCollection(newData);
	}, { deep: true });
	return {
		fuse,
		results: computed(() => {
			const resolved = toValue(options);
			if ((resolved === null || resolved === void 0 ? void 0 : resolved.matchAllWhenSearchEmpty) && !toValue(search)) return toValue(data).map((item, index) => ({
				item,
				refIndex: index
			}));
			const limit = resolved === null || resolved === void 0 ? void 0 : resolved.resultLimit;
			return fuse.value.search(toValue(search), limit ? { limit } : void 0);
		})
	};
}

//#endregion
export { useFuse as t };