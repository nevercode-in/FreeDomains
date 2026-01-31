import { t as useFocusTrap } from "../useFocusTrap-lXZ_YG-8.js";
import { defineComponent, h, reactive, shallowRef } from "vue";

//#region useFocusTrap/component.ts
const UseFocusTrap = /* @__PURE__ */ defineComponent((props, { slots }) => {
	const target = shallowRef();
	const data = reactive(useFocusTrap(target, props.options));
	return () => {
		if (slots.default) return h(props.as || "div", { ref: target }, slots.default(data));
	};
}, {
	name: "UseFocusTrap",
	props: ["as", "options"]
});

//#endregion
export { UseFocusTrap };