import { tryOnScopeDispose } from "@vueuse/shared";
import { shallowRef } from "vue";
import Cookie from "universal-cookie";

//#region useCookies/index.ts
/**
* Creates a new {@link useCookies} function
* @param req - incoming http request (for SSR)
* @see https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie universal-cookie
* @description Creates universal-cookie instance using request (default is window.document.cookie) and returns {@link useCookies} function with provided universal-cookie instance
*/
function createCookies(req) {
	const universalCookie = new Cookie(req ? req.headers.cookie : null);
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
function useCookies(dependencies, { doNotParse = false, autoUpdateDependencies = false } = {}, cookies = new Cookie()) {
	const watchingDependencies = autoUpdateDependencies ? [...dependencies || []] : dependencies;
	let previousCookies = cookies.getAll({ doNotParse: true });
	/**
	* Adds reactivity to get/getAll methods
	*/
	const touches = shallowRef(0);
	const onChange = () => {
		const newCookies = cookies.getAll({ doNotParse: true });
		if (shouldUpdate(watchingDependencies || null, newCookies, previousCookies)) touches.value++;
		previousCookies = newCookies;
	};
	cookies.addChangeListener(onChange);
	tryOnScopeDispose(() => {
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
export { useCookies as n, createCookies as t };