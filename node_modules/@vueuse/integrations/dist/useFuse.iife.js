(function(exports, fuse_js, vue) {

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
fuse_js = __toESM(fuse_js);
vue = __toESM(vue);

//#region useFuse/index.ts
	function useFuse(search, data, options) {
		const createFuse = () => {
			var _toValue, _toValue2;
			return new fuse_js.default((_toValue = (0, vue.toValue)(data)) !== null && _toValue !== void 0 ? _toValue : [], (_toValue2 = (0, vue.toValue)(options)) === null || _toValue2 === void 0 ? void 0 : _toValue2.fuseOptions);
		};
		const fuse = (0, vue.ref)(createFuse());
		(0, vue.watch)(() => {
			var _toValue3;
			return (_toValue3 = (0, vue.toValue)(options)) === null || _toValue3 === void 0 ? void 0 : _toValue3.fuseOptions;
		}, () => {
			fuse.value = createFuse();
		}, { deep: true });
		(0, vue.watch)(() => (0, vue.toValue)(data), (newData) => {
			fuse.value.setCollection(newData);
		}, { deep: true });
		return {
			fuse,
			results: (0, vue.computed)(() => {
				const resolved = (0, vue.toValue)(options);
				if ((resolved === null || resolved === void 0 ? void 0 : resolved.matchAllWhenSearchEmpty) && !(0, vue.toValue)(search)) return (0, vue.toValue)(data).map((item, index) => ({
					item,
					refIndex: index
				}));
				const limit = resolved === null || resolved === void 0 ? void 0 : resolved.resultLimit;
				return fuse.value.search((0, vue.toValue)(search), limit ? { limit } : void 0);
			})
		};
	}

//#endregion
exports.useFuse = useFuse;
})(this.VueUse = this.VueUse || {}, Fuse, Vue);