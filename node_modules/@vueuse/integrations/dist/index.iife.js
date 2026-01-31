(function(exports, __vueuse_shared, async_validator, vue, axios, change_case, universal_cookie, __vueuse_core, drauu, focus_trap, fuse_js, idb_keyval, jwt_decode, nprogress, qrcode, sortablejs) {

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
__vueuse_shared = __toESM(__vueuse_shared);
async_validator = __toESM(async_validator);
vue = __toESM(vue);
axios = __toESM(axios);
change_case = __toESM(change_case);
universal_cookie = __toESM(universal_cookie);
__vueuse_core = __toESM(__vueuse_core);
drauu = __toESM(drauu);
focus_trap = __toESM(focus_trap);
fuse_js = __toESM(fuse_js);
idb_keyval = __toESM(idb_keyval);
jwt_decode = __toESM(jwt_decode);
nprogress = __toESM(nprogress);
qrcode = __toESM(qrcode);
sortablejs = __toESM(sortablejs);

//#region useAsyncValidator/index.ts
	const AsyncValidatorSchema = async_validator.default.default || async_validator.default;
	/**
	* Wrapper for async-validator.
	*
	* @see https://vueuse.org/useAsyncValidator
	* @see https://github.com/yiminghe/async-validator
	*/
	function useAsyncValidator(value, rules, options = {}) {
		const { validateOption = {}, immediate = true, manual = false } = options;
		const valueRef = (0, __vueuse_shared.toRef)(value);
		const errorInfo = (0, vue.shallowRef)(null);
		const isFinished = (0, vue.shallowRef)(true);
		const pass = (0, vue.shallowRef)(!immediate || manual);
		const errors = (0, vue.computed)(() => {
			var _errorInfo$value;
			return ((_errorInfo$value = errorInfo.value) === null || _errorInfo$value === void 0 ? void 0 : _errorInfo$value.errors) || [];
		});
		const errorFields = (0, vue.computed)(() => {
			var _errorInfo$value2;
			return ((_errorInfo$value2 = errorInfo.value) === null || _errorInfo$value2 === void 0 ? void 0 : _errorInfo$value2.fields) || {};
		});
		const validator = (0, vue.computed)(() => new AsyncValidatorSchema((0, vue.toValue)(rules)));
		const execute = async () => {
			isFinished.value = false;
			pass.value = false;
			try {
				await validator.value.validate(valueRef.value, validateOption);
				pass.value = true;
				errorInfo.value = null;
			} catch (err) {
				errorInfo.value = err;
			} finally {
				isFinished.value = true;
			}
			return {
				pass: pass.value,
				errorInfo: errorInfo.value,
				errors: errors.value,
				errorFields: errorFields.value
			};
		};
		if (!manual) (0, vue.watch)([valueRef, validator], () => execute(), {
			immediate,
			deep: true
		});
		const shell = {
			isFinished,
			pass,
			errors,
			errorInfo,
			errorFields,
			execute
		};
		function waitUntilFinished() {
			return new Promise((resolve, reject) => {
				(0, __vueuse_shared.until)(isFinished).toBe(true).then(() => resolve(shell)).catch((error) => reject(error));
			});
		}
		return {
			...shell,
			then(onFulfilled, onRejected) {
				return waitUntilFinished().then(onFulfilled, onRejected);
			}
		};
	}

//#endregion
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
		const { shallow, onSuccess = __vueuse_shared.noop, onError = __vueuse_shared.noop, immediate, resetOnExecute = false } = options;
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
		const loading = (loading$1) => {
			isLoading.value = loading$1;
			isFinished.value = !loading$1;
		};
		/**
		* Reset data to initialData
		*/
		const resetData = () => {
			if (resetOnExecute) data.value = initialData;
		};
		const waitUntilFinished = () => new Promise((resolve, reject) => {
			(0, __vueuse_shared.until)(isFinished).toBe(true).then(() => error.value ? reject(error.value) : resolve(result));
		});
		const promise = {
			then: (...args$1) => waitUntilFinished().then(...args$1),
			catch: (...args$1) => waitUntilFinished().catch(...args$1)
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
				const result$1 = r.data;
				data.value = result$1;
				onSuccess(result$1);
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
//#region useChangeCase/index.ts
	const changeCaseTransforms = /* @__PURE__ */ Object.entries(change_case).filter(([name, fn]) => typeof fn === "function" && name.endsWith("Case")).reduce((acc, [name, fn]) => {
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
		const typeRef = (0, vue.computed)(() => {
			const t = (0, vue.toValue)(type);
			if (!changeCaseTransforms[t]) throw new Error(`Invalid change case type "${t}"`);
			return t;
		});
		if (typeof input === "function") return (0, vue.computed)(() => changeCaseTransforms[typeRef.value]((0, vue.toValue)(input), (0, vue.toValue)(options)));
		const text = (0, vue.ref)(input);
		return (0, vue.computed)({
			get() {
				return changeCaseTransforms[typeRef.value](text.value, (0, vue.toValue)(options));
			},
			set(value) {
				text.value = value;
			}
		});
	}

//#endregion
//#region useCookies/index.ts
/**
	* Creates a new {@link useCookies} function
	* @param req - incoming http request (for SSR)
	* @see https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie universal-cookie
	* @description Creates universal-cookie instance using request (default is window.document.cookie) and returns {@link useCookies} function with provided universal-cookie instance
	*/
	function createCookies(req) {
		const universalCookie = new universal_cookie.default(req ? req.headers.cookie : null);
		return (dependencies, { doNotParse = false, autoUpdateDependencies = false } = {}) => useCookies(dependencies, {
			doNotParse,
			autoUpdateDependencies
		}, universalCookie);
	}
	/**
	* Reactive methods to work with cookies (use {@link createCookies} method instead if you are using SSR)
	* @param dependencies - array of watching cookie's names. Pass empty array if don't want to watch cookies changes.
	* @param options
	* @param options.doNotParse - don't try parse value as JSON
	* @param options.autoUpdateDependencies - automatically update watching dependencies
	* @param cookies - universal-cookie instance
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function useCookies(dependencies, { doNotParse = false, autoUpdateDependencies = false } = {}, cookies = new universal_cookie.default()) {
		const watchingDependencies = autoUpdateDependencies ? [...dependencies || []] : dependencies;
		let previousCookies = cookies.getAll({ doNotParse: true });
		/**
		* Adds reactivity to get/getAll methods
		*/
		const touches = (0, vue.shallowRef)(0);
		const onChange = () => {
			const newCookies = cookies.getAll({ doNotParse: true });
			if (shouldUpdate(watchingDependencies || null, newCookies, previousCookies)) touches.value++;
			previousCookies = newCookies;
		};
		cookies.addChangeListener(onChange);
		(0, __vueuse_shared.tryOnScopeDispose)(() => {
			cookies.removeChangeListener(onChange);
		});
		return {
			get: (...args) => {
				/**
				* Auto update watching dependencies if needed
				*/
				if (autoUpdateDependencies && watchingDependencies && !watchingDependencies.includes(args[0])) watchingDependencies.push(args[0]);
				touches.value;
				return cookies.get(args[0], {
					doNotParse,
					...args[1]
				});
			},
			getAll: (...args) => {
				touches.value;
				return cookies.getAll({
					doNotParse,
					...args[0]
				});
			},
			set: (...args) => cookies.set(...args),
			remove: (...args) => cookies.remove(...args),
			addChangeListener: (...args) => cookies.addChangeListener(...args),
			removeChangeListener: (...args) => cookies.removeChangeListener(...args)
		};
	}
	function shouldUpdate(dependencies, newCookies, oldCookies) {
		if (!dependencies) return true;
		for (const dependency of dependencies) if (newCookies[dependency] !== oldCookies[dependency]) return true;
		return false;
	}

//#endregion
//#region useDrauu/index.ts
/**
	* Reactive drauu
	*
	* @see https://vueuse.org/useDrauu
	* @param target The target svg element
	* @param options Drauu Options
	*/
	function useDrauu(target, options) {
		const drauuInstance = (0, vue.ref)();
		let disposables = [];
		const onChangedHook = (0, __vueuse_core.createEventHook)();
		const onCanceledHook = (0, __vueuse_core.createEventHook)();
		const onCommittedHook = (0, __vueuse_core.createEventHook)();
		const onStartHook = (0, __vueuse_core.createEventHook)();
		const onEndHook = (0, __vueuse_core.createEventHook)();
		const canUndo = (0, vue.shallowRef)(false);
		const canRedo = (0, vue.shallowRef)(false);
		const altPressed = (0, vue.shallowRef)(false);
		const shiftPressed = (0, vue.shallowRef)(false);
		const brush = (0, vue.ref)({
			color: "black",
			size: 3,
			arrowEnd: false,
			cornerRadius: 0,
			dasharray: void 0,
			fill: "transparent",
			mode: "draw",
			...options === null || options === void 0 ? void 0 : options.brush
		});
		(0, vue.watch)(brush, () => {
			const instance = drauuInstance.value;
			if (instance) {
				instance.brush = brush.value;
				instance.mode = brush.value.mode;
			}
		}, { deep: true });
		const undo = () => {
			var _drauuInstance$value;
			return (_drauuInstance$value = drauuInstance.value) === null || _drauuInstance$value === void 0 ? void 0 : _drauuInstance$value.undo();
		};
		const redo = () => {
			var _drauuInstance$value2;
			return (_drauuInstance$value2 = drauuInstance.value) === null || _drauuInstance$value2 === void 0 ? void 0 : _drauuInstance$value2.redo();
		};
		const clear = () => {
			var _drauuInstance$value3;
			return (_drauuInstance$value3 = drauuInstance.value) === null || _drauuInstance$value3 === void 0 ? void 0 : _drauuInstance$value3.clear();
		};
		const cancel = () => {
			var _drauuInstance$value4;
			return (_drauuInstance$value4 = drauuInstance.value) === null || _drauuInstance$value4 === void 0 ? void 0 : _drauuInstance$value4.cancel();
		};
		const load = (svg) => {
			var _drauuInstance$value5;
			return (_drauuInstance$value5 = drauuInstance.value) === null || _drauuInstance$value5 === void 0 ? void 0 : _drauuInstance$value5.load(svg);
		};
		const dump = () => {
			var _drauuInstance$value6;
			return (_drauuInstance$value6 = drauuInstance.value) === null || _drauuInstance$value6 === void 0 ? void 0 : _drauuInstance$value6.dump();
		};
		const cleanup = () => {
			var _drauuInstance$value7;
			disposables.forEach((dispose) => dispose());
			(_drauuInstance$value7 = drauuInstance.value) === null || _drauuInstance$value7 === void 0 || _drauuInstance$value7.unmount();
		};
		const syncStatus = () => {
			if (drauuInstance.value) {
				canUndo.value = drauuInstance.value.canUndo();
				canRedo.value = drauuInstance.value.canRedo();
				altPressed.value = drauuInstance.value.altPressed;
				shiftPressed.value = drauuInstance.value.shiftPressed;
			}
		};
		(0, vue.watch)(() => (0, __vueuse_core.unrefElement)(target), (el) => {
			if (!el || typeof SVGSVGElement === "undefined" || !(el instanceof SVGSVGElement)) return;
			if (drauuInstance.value) cleanup();
			drauuInstance.value = (0, drauu.createDrauu)({
				el,
				...options
			});
			syncStatus();
			disposables = [
				drauuInstance.value.on("canceled", () => onCanceledHook.trigger()),
				drauuInstance.value.on("committed", (node) => onCommittedHook.trigger(node)),
				drauuInstance.value.on("start", () => onStartHook.trigger()),
				drauuInstance.value.on("end", () => onEndHook.trigger()),
				drauuInstance.value.on("changed", () => {
					syncStatus();
					onChangedHook.trigger();
				})
			];
		}, { flush: "post" });
		(0, __vueuse_shared.tryOnScopeDispose)(() => cleanup());
		return {
			drauuInstance,
			load,
			dump,
			clear,
			cancel,
			undo,
			redo,
			canUndo,
			canRedo,
			brush,
			onChanged: onChangedHook.on,
			onCommitted: onCommittedHook.on,
			onStart: onStartHook.on,
			onEnd: onEndHook.on,
			onCanceled: onCanceledHook.on
		};
	}

//#endregion
//#region useFocusTrap/index.ts
/**
	* Reactive focus-trap
	*
	* @see https://vueuse.org/useFocusTrap
	*/
	function useFocusTrap(target, options = {}) {
		let trap;
		const { immediate,...focusTrapOptions } = options;
		const hasFocus = (0, vue.shallowRef)(false);
		const isPaused = (0, vue.shallowRef)(false);
		const activate = (opts) => trap && trap.activate(opts);
		const deactivate = (opts) => trap && trap.deactivate(opts);
		const pause = () => {
			if (trap) {
				trap.pause();
				isPaused.value = true;
			}
		};
		const unpause = () => {
			if (trap) {
				trap.unpause();
				isPaused.value = false;
			}
		};
		(0, vue.watch)((0, vue.computed)(() => {
			return (0, __vueuse_core.toArray)((0, vue.toValue)(target)).map((el) => {
				const _el = (0, vue.toValue)(el);
				return typeof _el === "string" ? _el : (0, __vueuse_core.unrefElement)(_el);
			}).filter(__vueuse_shared.notNullish);
		}), (els) => {
			if (!els.length) return;
			if (!trap) {
				trap = (0, focus_trap.createFocusTrap)(els, {
					...focusTrapOptions,
					onActivate() {
						hasFocus.value = true;
						if (options.onActivate) options.onActivate();
					},
					onDeactivate() {
						hasFocus.value = false;
						if (options.onDeactivate) options.onDeactivate();
					}
				});
				if (immediate) activate();
			} else {
				const isActive = trap === null || trap === void 0 ? void 0 : trap.active;
				trap === null || trap === void 0 || trap.updateContainerElements(els);
				if (!isActive && immediate) activate();
			}
		}, { flush: "post" });
		(0, __vueuse_core.tryOnScopeDispose)(() => deactivate());
		return {
			hasFocus,
			isPaused,
			activate,
			deactivate,
			pause,
			unpause
		};
	}

//#endregion
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
//#region useNProgress/index.ts
/**
	* Reactive progress bar.
	*
	* @see https://vueuse.org/useNProgress
	*/
	function useNProgress(currentProgress = null, options) {
		const progress = (0, __vueuse_shared.toRef)(currentProgress);
		const isLoading = (0, vue.computed)({
			set: (load) => load ? nprogress.default.start() : nprogress.default.done(),
			get: () => typeof progress.value === "number" && progress.value < 1
		});
		if (options) nprogress.default.configure(options);
		const setProgress = nprogress.default.set;
		nprogress.default.set = (n) => {
			progress.value = n;
			return setProgress.call(nprogress.default, n);
		};
		(0, vue.watchEffect)(() => {
			if (typeof progress.value === "number" && __vueuse_shared.isClient) setProgress.call(nprogress.default, progress.value);
		});
		(0, __vueuse_shared.tryOnScopeDispose)(nprogress.default.remove);
		return {
			isLoading,
			progress,
			start: nprogress.default.start,
			done: nprogress.default.done,
			remove: () => {
				progress.value = null;
				nprogress.default.remove();
			}
		};
	}

//#endregion
//#region useQRCode/index.ts
/**
	* Wrapper for qrcode.
	*
	* @see https://vueuse.org/useQRCode
	* @param text
	* @param options
	*/
	function useQRCode(text, options) {
		const src = (0, __vueuse_shared.toRef)(text);
		const result = (0, vue.shallowRef)("");
		(0, vue.watch)(src, async (value) => {
			if (src.value && __vueuse_shared.isClient) result.value = await qrcode.default.toDataURL(value, options);
		}, { immediate: true });
		return result;
	}

//#endregion
//#region useSortable/index.ts
/**
	* Wrapper for sortablejs.
	* @param el
	* @param list
	* @param options
	*/
	function useSortable(el, list, options = {}) {
		let sortable;
		const { document = __vueuse_core.defaultDocument, watchElement = false,...resetOptions } = options;
		const defaultOptions = { onUpdate: (e) => {
			moveArrayElement(list, e.oldIndex, e.newIndex, e);
		} };
		const element = (0, vue.computed)(() => typeof el === "string" ? document === null || document === void 0 ? void 0 : document.querySelector(el) : (0, __vueuse_core.unrefElement)(el));
		const cleanup = () => {
			sortable === null || sortable === void 0 || sortable.destroy();
			sortable = void 0;
		};
		const initSortable = (target) => {
			if (!target || sortable !== void 0) return;
			sortable = new sortablejs.default(target, {
				...defaultOptions,
				...resetOptions
			});
		};
		const start = () => {
			const target = element.value;
			if (target) initSortable(target);
		};
		const option = (name, value) => {
			if (value !== void 0) sortable === null || sortable === void 0 || sortable.option(name, value);
			else return sortable === null || sortable === void 0 ? void 0 : sortable.option(name);
		};
		let stopWatch;
		if (watchElement && typeof el !== "string") stopWatch = (0, vue.watch)(element, (newElement) => {
			cleanup();
			if (newElement) initSortable(newElement);
		}, {
			immediate: true,
			flush: "post"
		});
		else (0, __vueuse_core.tryOnMounted)(start);
		const stop = () => {
			cleanup();
		};
		(0, __vueuse_core.tryOnScopeDispose)(() => {
			stopWatch === null || stopWatch === void 0 || stopWatch();
			cleanup();
		});
		return {
			stop,
			start,
			option
		};
	}
	/**
	* Inserts a element into the DOM at a given index.
	* @param parentElement
	* @param element
	* @param {number} index
	* @see https://github.com/Alfred-Skyblue/vue-draggable-plus/blob/a3829222095e1949bf2c9a20979d7b5930e66f14/src/utils/index.ts#L81C1-L94C2
	*/
	function insertNodeAt(parentElement, element, index) {
		const refElement = parentElement.children[index];
		parentElement.insertBefore(element, refElement);
	}
	/**
	* Removes a node from the DOM.
	* @param {Node} node
	* @see https://github.com/Alfred-Skyblue/vue-draggable-plus/blob/a3829222095e1949bf2c9a20979d7b5930e66f14/src/utils/index.ts#L96C1-L102C2
	*/
	function removeNode(node) {
		if (node.parentNode) node.parentNode.removeChild(node);
	}
	function moveArrayElement(list, from, to, e = null) {
		if (e != null) {
			removeNode(e.item);
			insertNodeAt(e.from, e.item, from);
		}
		const _valueIsRef = (0, vue.isRef)(list);
		const array = _valueIsRef ? [...(0, vue.toValue)(list)] : (0, vue.toValue)(list);
		if (to >= 0 && to < array.length) {
			const element = array.splice(from, 1)[0];
			(0, vue.nextTick)(() => {
				array.splice(to, 0, element);
				if (_valueIsRef) list.value = array;
			});
		}
	}

//#endregion
exports.createCookies = createCookies;
exports.insertNodeAt = insertNodeAt;
exports.moveArrayElement = moveArrayElement;
exports.removeNode = removeNode;
exports.useAsyncValidator = useAsyncValidator;
exports.useAxios = useAxios;
exports.useChangeCase = useChangeCase;
exports.useCookies = useCookies;
exports.useDrauu = useDrauu;
exports.useFocusTrap = useFocusTrap;
exports.useFuse = useFuse;
exports.useIDBKeyval = useIDBKeyval;
exports.useJwt = useJwt;
exports.useNProgress = useNProgress;
exports.useQRCode = useQRCode;
exports.useSortable = useSortable;
})(this.VueUse = this.VueUse || {}, VueUse, AsyncValidator, Vue, axios, changeCase, UniversalCookie, VueUse, Drauu, focusTrap, Fuse, idbKeyval, jwt_decode, nprogress, QRCode, Sortable);