(function(exports, __vueuse_core, idb_keyval, vue) {

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
__vueuse_core = __toESM(__vueuse_core);
idb_keyval = __toESM(idb_keyval);
vue = __toESM(vue);

//#region useIDBKeyval/index.ts
/**
	*
	* @param key
	* @param initialValue
	* @param options
	*/
	function useIDBKeyval(key, initialValue, options = {}) {
		const { flush = "pre", deep = true, shallow = false, onError = (e) => {
			console.error(e);
		}, writeDefaults = true, serializer = {
			read: (raw) => raw,
			write: (value) => value
		} } = options;
		const isFinished = (0, vue.shallowRef)(false);
		const data = (shallow ? vue.shallowRef : vue.ref)(initialValue);
		const rawInit = (0, vue.toValue)(initialValue);
		async function read() {
			try {
				const rawValue = await (0, idb_keyval.get)(key);
				if (rawValue === void 0) {
					if (rawInit !== void 0 && rawInit !== null && writeDefaults) await (0, idb_keyval.set)(key, serializer.write(rawInit));
				} else data.value = serializer.read(rawValue);
			} catch (e) {
				onError(e);
			}
			isFinished.value = true;
		}
		read();
		async function write() {
			try {
				if (data.value == null) await (0, idb_keyval.del)(key);
				else {
					const rawValue = (0, vue.toRaw)(data.value);
					const serializedValue = serializer.write(rawValue);
					await (0, idb_keyval.update)(key, () => serializedValue);
				}
			} catch (e) {
				onError(e);
			}
		}
		const { pause: pauseWatch, resume: resumeWatch } = (0, __vueuse_core.watchPausable)(data, () => write(), {
			flush,
			deep
		});
		async function setData(value) {
			pauseWatch();
			data.value = value;
			await write();
			resumeWatch();
		}
		return {
			set: setData,
			isFinished,
			data
		};
	}

//#endregion
exports.useIDBKeyval = useIDBKeyval;
})(this.VueUse = this.VueUse || {}, VueUse, idbKeyval, Vue);