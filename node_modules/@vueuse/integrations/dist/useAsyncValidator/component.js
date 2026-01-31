import { t as useAsyncValidator } from "../useAsyncValidator-pcZPyeq7.js";
import { defineComponent, reactive } from "vue";

//#region useAsyncValidator/component.ts
const UseAsyncValidator = /* @__PURE__ */ defineComponent((props, { slots }) => {
	const data = reactive(useAsyncValidator(props.form, props.rules));
	return () => {
		if (slots.default) return slots.default(data);
	};
}, {
	name: "UseAsyncValidator",
	props: [
		"form",
		"options",
		"rules"
	]
});

//#endregion
export { UseAsyncValidator };