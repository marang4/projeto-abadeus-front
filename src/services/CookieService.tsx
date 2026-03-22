import Cookies from "js-cookie";

class CookieService {
  private readonly defaultOptions: Cookies.CookieAttributes = {
    secure: import.meta.env.PROD,

    sameSite: "strict",

    path: "/",
  };

  set(name: string, value: string, options?: Cookies.CookieAttributes): void {
    Cookies.set(name, value, {
      ...this.defaultOptions,

      ...options,
    });
  }

  get(name: string): string | undefined {
    return Cookies.get(name);
  }

  remove(name: string): void {
    Cookies.remove(name, { path: "/" });
  }

  setObject<T>(
    name: string,
    value: T,
    options?: Cookies.CookieAttributes,
  ): void {
    this.set(name, JSON.stringify(value), options);
  }

  getObject<T>(name: string): T | undefined {
    const value = this.get(name);

    if (!value) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
}

export const cookieService = new CookieService();

export default cookieService;
