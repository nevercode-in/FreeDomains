import * as universal_cookie0 from "universal-cookie";
import Cookie from "universal-cookie";
import { IncomingMessage } from "node:http";

//#region useCookies/index.d.ts

/**
 * Creates a new {@link useCookies} function
 * @param req - incoming http request (for SSR)
 * @see https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie universal-cookie
 * @description Creates universal-cookie instance using request (default is window.document.cookie) and returns {@link useCookies} function with provided universal-cookie instance
 */
declare function createCookies(req?: IncomingMessage): (dependencies?: string[] | null, {
  doNotParse,
  autoUpdateDependencies
}?: {
  doNotParse?: boolean | undefined;
  autoUpdateDependencies?: boolean | undefined;
}) => {
  /**
   * Reactive get cookie by name. If **autoUpdateDependencies = true** then it will update watching dependencies
   */
  get: <T = any>(name: string, options?: universal_cookie0.CookieGetOptions | undefined) => T;
  /**
   * Reactive get all cookies
   */
  getAll: <T = any>(options?: universal_cookie0.CookieGetOptions | undefined) => T;
  set: (name: string, value: any, options?: universal_cookie0.CookieSetOptions | undefined) => void;
  remove: (name: string, options?: universal_cookie0.CookieSetOptions | undefined) => void;
  addChangeListener: (callback: universal_cookie0.CookieChangeListener) => void;
  removeChangeListener: (callback: universal_cookie0.CookieChangeListener) => void;
};
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
declare function useCookies(dependencies?: string[] | null, {
  doNotParse,
  autoUpdateDependencies
}?: {
  doNotParse?: boolean | undefined;
  autoUpdateDependencies?: boolean | undefined;
}, cookies?: Cookie): {
  /**
   * Reactive get cookie by name. If **autoUpdateDependencies = true** then it will update watching dependencies
   */
  get: <T = any>(name: string, options?: universal_cookie0.CookieGetOptions | undefined) => T;
  /**
   * Reactive get all cookies
   */
  getAll: <T = any>(options?: universal_cookie0.CookieGetOptions | undefined) => T;
  set: (name: string, value: any, options?: universal_cookie0.CookieSetOptions | undefined) => void;
  remove: (name: string, options?: universal_cookie0.CookieSetOptions | undefined) => void;
  addChangeListener: (callback: universal_cookie0.CookieChangeListener) => void;
  removeChangeListener: (callback: universal_cookie0.CookieChangeListener) => void;
};
//#endregion
export { useCookies as n, createCookies as t };