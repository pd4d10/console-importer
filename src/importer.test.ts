import { describe, it, expect, beforeEach, vi } from "vitest";
import "./importer";

const win = window as any;
const { $i } = win;

const TIMEOUT = 2000;
const prefix = "color:blue";
const strong = "color:blue;font-weight:bold";
const error = "color:red";
const jsUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js";
const cssUrl =
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Console Importer", () => {
  it("should append to window", () => {
    expect(typeof $i).toBe("function");
    expect(typeof (console as any).$i).toBe("function");
  });

  it("should throw error when argument is invalid", () => {
    expect(() => $i({})).toThrowError(
      "Argument should be a string, please check it."
    );
  });

  it("should not output ugly string", () => {
    expect($i.toString()).toBe("$i");
  });

  describe("import JS URL", () => {
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i(jsUrl);
    });

    it("should import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${jsUrl}%c is loading, please be patient...`,
        prefix,
        strong,
        ""
      );

      await sleep(TIMEOUT);
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${jsUrl}%c is loaded.`,
        prefix,
        strong,
        ""
      );
      expect(win.$.fn.jquery).toBe("3.1.1");
    });
  });

  describe("import invalid JS URL", () => {
    const url = "https://test.js";
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i(url);
    });

    it("should not import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ""
      );

      await sleep(TIMEOUT);
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %cFail to load %c${url}%c, is this URL%c%c correct?`,
        error,
        "",
        strong,
        "",
        "",
        ""
      );
    });
  });

  describe("import CSS URL", () => {
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i(cssUrl);
    });

    it("should import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${cssUrl}%c is loading, please be patient...`,
        prefix,
        strong,
        ""
      );
      await sleep(TIMEOUT);
      // expect(getComputedStyle(document.body).boxSizing).toBe('border-box') // TODO:
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${cssUrl}%c is loaded.`,
        prefix,
        strong,
        ""
      );
    });
  });

  describe("import invalid CSS URL", () => {
    const url = "https://test.css";

    beforeEach(() => {
      vi.spyOn(console, "log");
      $i(url);
    });

    it("should not import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ""
      );
      await sleep(TIMEOUT);
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %cFail to load %c${url}%c, is this URL%c%c correct?`,
        error,
        "",
        strong,
        "",
        "",
        ""
      );
    });
  });

  describe("import keyword", () => {
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i("jquery");
    });
    it("should import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %cSearching for %cjquery%c, please be patient...`,
        prefix,
        "",
        strong,
        ""
      );
      await sleep(TIMEOUT);
      expect(console.log).toHaveBeenCalledWith(
        "%c[$i]: %cjquery%c is loading, please be patient...",
        prefix,
        strong,
        ""
      );
      // expect(console.log).toHaveBeenCalledWith(
      //   jasmine.any(String),
      //   prefix,
      //   strong,
      //   ''
      // )
      expect(win.$.fn.jquery).toBeDefined();
    });
  });

  describe("import keyword not matching completely", () => {
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i("jq");
    });
    it.todo("should import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %cSearching for %cjq%c, please be patient...`,
        prefix,
        "",
        strong,
        ""
      );

      await sleep(TIMEOUT);
      expect(console.log).toHaveBeenCalledWith(
        "%c[$i]: %cjq%c not found, import %cjquery%c instead.",
        prefix,
        strong,
        "",
        strong,
        ""
      );
      expect(console.log).toHaveBeenCalledWith(
        "%c[$i]: %cjquery%c is loading, please be patient...",
        prefix,
        strong,
        ""
      );
      // expect(console.log).toHaveBeenCalledWith(
      //   jasmine.any(String),
      //   prefix,
      //   strong,
      //   ''
      // )
      expect(win.$.fn.jquery).toBeDefined();
    });
  });

  describe("import keyword with no results", () => {
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    });
    it.todo("should log error", async () => {
      await sleep(TIMEOUT);
      expect(console.log).toHaveBeenCalledWith(
        "%c[$i]: %cSorry, %caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa%c not found, please try another keyword.",
        error,
        "",
        strong,
        ""
      );
    });
  });

  describe.todo("import specific version", () => {
    beforeEach(() => {
      vi.spyOn(console, "log");
      $i("jquery@2");
    });
    it("should import", async () => {
      expect(console.log).toHaveBeenCalledWith(
        "%c[$i]: %cjquery@2%c is loading, please be patient...",
        prefix,
        strong,
        ""
      );

      await sleep(TIMEOUT);
      expect(win.$.fn.jquery[0]).toBe("2");
      expect(console.log).toHaveBeenCalledWith(
        "%c[$i]: %cjquery@2%c(https://unpkg.com/jquery@2) is loaded.",
        prefix,
        strong,
        ""
      );
    });
  });

  it("Remove script tag after injected", async () => {
    $i(jsUrl);
    expect(document.querySelector(`script[src="${jsUrl}"]`)).toBe(null);
    await sleep(TIMEOUT);
    expect(document.querySelector(`script[src="${jsUrl}"]`)).toBe(null);
  });

  describe.todo("Meta tag", () => {
    it("should remove after executed", async () => {
      $i(jsUrl);
      expect(document.querySelector("meta[name=referrer]")).toBe(null);

      await sleep(TIMEOUT);
      expect(document.querySelector("meta[name=referrer]")).toBe(null);
    });
    it("should not be changed if existing", async () => {
      let meta = document.createElement("meta");
      meta.name = "referrer";
      meta.content = "origin";
      document.head.appendChild(meta);
      $i(jsUrl);

      meta = document.querySelector("meta[name=referrer]") as HTMLMetaElement;

      expect(meta.content).toBe("origin");
      await sleep(TIMEOUT);
      expect(meta.content).toBe("origin");
    });
  });
});
