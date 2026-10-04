(function(exports, _vueuse_shared, universal_cookie, vue) {
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
	universal_cookie = __toESM(universal_cookie, 1);
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
		(0, _vueuse_shared.tryOnScopeDispose)(() => {
			cookies.removeChangeListener(onChange);
		});
		return {
			/**
			* Reactive get cookie by name. If **autoUpdateDependencies = true** then it will update watching dependencies
			*/
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
			/**
			* Reactive get all cookies
			*/
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
	exports.createCookies = createCookies;
	exports.useCookies = useCookies;
})(this.VueUse = this.VueUse || {}, VueUse, UniversalCookie, Vue);
