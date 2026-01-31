(function(exports, __vueuse_shared, async_validator, vue) {

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
exports.useAsyncValidator = useAsyncValidator;
})(this.VueUse = this.VueUse || {}, VueUse, AsyncValidator, Vue);