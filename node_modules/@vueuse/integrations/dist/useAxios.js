import { noop, until } from "@vueuse/shared";
import { ref, shallowRef } from "vue";
import axios, { AxiosError } from "axios";
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
	let instance = axios;
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
	const { shallow, onSuccess = noop, onError = noop, immediate, resetOnExecute = false } = options;
	const initialData = options.initialData;
	const response = shallowRef();
	const data = (shallow ? shallowRef : ref)(initialData);
	const isFinished = shallowRef(false);
	const isLoading = shallowRef(false);
	const isAborted = shallowRef(false);
	const error = shallowRef();
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
		until(isFinished).toBe(true).then(() => error.value ? reject(error.value) : resolve(result));
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
			error.value = new AxiosError(AxiosError.ERR_INVALID_URL);
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
export { useAxios };
