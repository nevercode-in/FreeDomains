import * as vue8 from "vue";
import { MaybeRefOrGetter } from "vue";
import QRCode from "qrcode";

//#region useQRCode/index.d.ts

/**
 * Wrapper for qrcode.
 *
 * @see https://vueuse.org/useQRCode
 * @param text
 * @param options
 */
declare function useQRCode(text: MaybeRefOrGetter<string>, options?: QRCode.QRCodeToDataURLOptions): vue8.ShallowRef<string, string>;
//#endregion
export { useQRCode as t };