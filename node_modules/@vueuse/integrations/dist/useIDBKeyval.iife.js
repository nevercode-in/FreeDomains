(function(exports, _vueuse_core, idb_keyval, vue) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
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
		const { pause: pauseWatch, resume: resumeWatch } = (0, _vueuse_core.watchPausable)(data, () => write(), {
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
