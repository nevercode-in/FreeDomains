import { ComputedRef, MaybeRefOrGetter } from "vue";
import { JwtHeader, JwtPayload } from "jwt-decode";

//#region useJwt/index.d.ts
interface UseJwtOptions<Fallback> {
  /**
   * Value returned when encounter error on decoding
   *
   * @default null
   */
  fallbackValue?: Fallback;
  /**
   * Error callback for decoding
   */
  onError?: (error: unknown) => void;
}
interface UseJwtReturn<Payload, Header, Fallback> {
  header: ComputedRef<Header | Fallback>;
  payload: ComputedRef<Payload | Fallback>;
}
/**
 * Reactive decoded jwt token.
 *
 * @see https://vueuse.org/useJwt
 */
declare function useJwt<Payload extends object = JwtPayload, Header extends object = JwtHeader, Fallback = null>(encodedJwt: MaybeRefOrGetter<string>, options?: UseJwtOptions<Fallback>): UseJwtReturn<Payload, Header, Fallback>;
//#endregion
export { UseJwtReturn as n, useJwt as r, UseJwtOptions as t };