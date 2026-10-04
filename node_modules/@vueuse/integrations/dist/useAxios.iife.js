(function(exports, _vueuse_shared, axios, vue) {
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
	axios = __toESM(axios, 1);
	//#region useAxios/index.ts
	/**
	* Wrapper for axios.
	*
	* @see https://vueuse.org/useAxios
	*/
	function useAxios(...args) {
		const url = typeof args[0] === "string" ? args[0] : void 0;
		const argsPlaceholder = typeof url === "string" ? 1 : 0;
		const defaultOptions = {
			immediate: !!argsPlaceholder,
			shallow: true,
			abortPrevious: true
		};
		let defaultConfig = {};
		let instance = axios.default;
		let options = defaultOptions;
		const isAxiosInstance = (val) => !!(val === null || val === void 0 ? void 0 : val.request);
		if (args.length > 0 + argsPlaceholder)
 /**
		* Unable to use `instanceof` here because of (https://github.com/axios/axios/issues/737)
		* so instead we are checking if there is a `request` on the object to see if it is an
		* axios instance
		*/
		if (isAxiosInstance(args[0 + argsPlaceholder])) instance = args[0 + argsPlaceholder];
		else defaultConfig = args[0 + argsPlaceholder];
		if (args.length > 1 + argsPlaceholder) {
			if (isAxiosInstance(args[1 + argsPlaceholder])) instance = args[1 + argsPlaceholder];
		}
		if (args.length === 2 + argsPlaceholder && !isAxiosInstance(args[1 + argsPlaceholder]) || args.length === 3 + argsPlaceholder) options = args[args.length - 1] || defaultOptions;
		const { shallow, onSuccess = _vueuse_shared.noop, onError = _vueuse_shared.noop, immediate, resetOnExecute = false } = options;
		const initialData = options.initialData;
		const response = (0, vue.shallowRef)();
		const data = (shallow ? vue.shallowRef : vue.ref)(initialData);
		const isFinished = (0, vue.shallowRef)(false);
		const isLoading = (0, vue.shallowRef)(false);
		const isAborted = (0, vue.shallowRef)(false);
		const error = (0, vue.shallowRef)();
		let abortController = new AbortController();
		const abort = (message) => {
			if (isFinished.value || !isLoading.value) return;
			abortController.abort(message);
			abortController = new AbortController();
			isAborted.value = true;
			isLoading.value = false;
			isFinished.value = false;
		};
		const loading = (loading) => {
			isLoading.value = loading;
			isFinished.value = !loading;
		};
		/**
		* Reset data to initialData
		*/
		const resetData = () => {
			if (resetOnExecute) data.value = initialData;
		};
		const waitUntilFinished = () => new Promise((resolve, reject) => {
			(0, _vueuse_shared.until)(isFinished).toBe(true).then(() => error.value ? reject(error.value) : resolve(result));
		});
		const promise = {
			then: (...args) => waitUntilFinished().then(...args),
			catch: (...args) => waitUntilFinished().catch(...args)
		};
		let executeCounter = 0;
		const execute = (executeUrl = url, config = {}) => {
			error.value = void 0;
			const _url = typeof executeUrl === "string" ? executeUrl : url !== null && url !== void 0 ? url : config.url;
			if (_url === void 0) {
				error.value = new axios.AxiosError(axios.AxiosError.ERR_INVALID_URL);
				isFinished.value = true;
				return promise;
			}
			resetData();
			if (options.abortPrevious !== false) abort();
			loading(true);
			executeCounter += 1;
			const currentExecuteCounter = executeCounter;
			isAborted.value = false;
			instance(_url, {
				...defaultConfig,
				...typeof executeUrl === "object" ? executeUrl : config,
				signal: abortController.signal
			}).then((r) => {
				if (isAborted.value) return;
				response.value = r;
				const result = r === null || r === void 0 ? void 0 : r.data;
				data.value = result;
				onSuccess(result);
			}).catch((e) => {
				error.value = e;
				onError(e);
			}).finally(() => {
				var _options$onFinish;
				(_options$onFinish = options.onFinish) === null || _options$onFinish === void 0 || _options$onFinish.call(options);
				if (currentExecuteCounter === executeCounter) loading(false);
			});
			return promise;
		};
		if (immediate && url) execute();
		const result = {
			response,
			data,
			error,
			isFinished,
			isLoading,
			cancel: abort,
			isAborted,
			isCanceled: isAborted,
			abort,
			execute
		};
		return {
			...result,
			...promise
		};
	}
	//#endregion
	exports.useAxios = useAxios;
})(this.VueUse = this.VueUse || {}, VueUse, axios, Vue);
