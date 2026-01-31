import { toRef, until } from "@vueuse/shared";
import Schema from "async-validator";
import { computed, shallowRef, toValue, watch } from "vue";

//#region useAsyncValidator/index.ts
const AsyncValidatorSchema = Schema.default || Schema;
/**
* Wrapper for async-validator.
*
* @see https://vueuse.org/useAsyncValidator
* @see https://github.com/yiminghe/async-validator
*/
function useAsyncValidator(value, rules, options = {}) {
	const { validateOption = {}, immediate = true, manual = false } = options;
	const valueRef = toRef(value);
	const errorInfo = shallowRef(null);
	const isFinished = shallowRef(true);
	const pass = shallowRef(!immediate || manual);
	const errors = computed(() => {
		var _errorInfo$value;
		return ((_errorInfo$value = errorInfo.value) === null || _errorInfo$value === void 0 ? void 0 : _errorInfo$value.errors) || [];
	});
	const errorFields = computed(() => {
		var _errorInfo$value2;
		return ((_errorInfo$value2 = errorInfo.value) === null || _errorInfo$value2 === void 0 ? void 0 : _errorInfo$value2.fields) || {};
	});
	const validator = computed(() => new AsyncValidatorSchema(toValue(rules)));
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
	if (!manual) watch([valueRef, validator], () => execute(), {
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
			until(isFinished).toBe(true).then(() => resolve(shell)).catch((error) => reject(error));
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
export { useAsyncValidator as t };