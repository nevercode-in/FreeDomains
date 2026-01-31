(function(exports, __vueuse_core, sortablejs, vue) {

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
sortablejs = __toESM(sortablejs);
vue = __toESM(vue);

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
exports.insertNodeAt = insertNodeAt;
exports.moveArrayElement = moveArrayElement;
exports.removeNode = removeNode;
exports.useSortable = useSortable;
})(this.VueUse = this.VueUse || {}, VueUse, Sortable, Vue);