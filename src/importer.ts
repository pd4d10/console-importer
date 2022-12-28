import tiza from "tiza";

const PREFIX_TEXT = "[$i]: ";
const prefix = tiza.color("blue").text;
const strong = tiza.color("blue").bold().text;
const error = tiza.color("red").text;
const log: typeof tiza.log = (...args) =>
  tiza.log(prefix(PREFIX_TEXT), ...args);
const logError: typeof tiza.log = (...args) =>
  tiza.log(error(PREFIX_TEXT), ...args);

let lastGlobalVariableSet: Set<string> | null = null;

function createBeforeLoad(name: string) {
  return () => {
    lastGlobalVariableSet = new Set(Object.keys(window));
    log(strong(name), " is loading, please be patient...");
  };
}

function createOnLoad(name: string, url?: string) {
  return () => {
    const urlText = url ? `(${url})` : "";
    log(strong(name), `${urlText} is loaded.`);

    const currentGlobalVariables = Object.keys(window);
    const newGlobalVariables = currentGlobalVariables.filter(
      (key) => !lastGlobalVariableSet?.has(key)
    );
    if (newGlobalVariables.length > 0) {
      log(
        "The new global variables are as follows: ",
        strong(newGlobalVariables.join(",")),
        " . Maybe you can use them."
      );
    } else {
      // maybe css request or script loaded already
    }
    // Update global variable list
    lastGlobalVariableSet = new Set(currentGlobalVariables);
  };
}

function createOnError(name: string, url?: string) {
  return () => {
    const urlText = url ? `(${strong(url)})` : "";
    logError(
      "Fail to load ",
      strong(name),
      ", is this URL",
      urlText,
      " correct?"
    );
  };
}

// Try to remove referrer for security
// https://imququ.com/post/referrer-policy.html
// https://www.w3.org/TR/referrer-policy/
function addNoReferrerMeta() {
  const originMeta = document.querySelector<HTMLMetaElement>(
    "meta[name=referrer]"
  );

  if (originMeta) {
    // If there is already a referrer policy meta tag, save origin content
    // and then change it, call `remove` to restore it
    const content = originMeta.content;
    originMeta.content = "no-referrer";
    return function remove() {
      originMeta.content = content;
    };
  } else {
    // Else, create a new one, call `remove` to delete it
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);
    return function remove() {
      // Removing meta tag directly not work, should set it to default first
      meta.content = "no-referrer-when-downgrade";
      document.head.removeChild(meta);
    };
  }
}

// Insert script tag
function injectScript(
  url: string,
  onload: ReturnType<typeof createBeforeLoad>,
  onerror: ReturnType<typeof createOnError>
) {
  const remove = addNoReferrerMeta();
  const script = document.createElement("script");
  script.src = url;
  script.onload = onload;
  script.onerror = onerror;
  document.body.appendChild(script);
  remove();
  document.body.removeChild(script);
}

// Insert link tag
function injectStyle(
  url: string,
  onload: ReturnType<typeof createBeforeLoad>,
  onerror: ReturnType<typeof createOnError>
) {
  const remove = addNoReferrerMeta();
  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#Stylesheet_load_events
  link.onload = onload;
  link.onerror = onerror;
  document.head.appendChild(link);
  remove();
  // Should not remove <link> tag, unlike <script>
}

function inject(
  url: string,
  beforeLoad = createBeforeLoad(url),
  onload = createOnLoad(url),
  onerror = createOnError(url)
) {
  beforeLoad();

  // Handle CSS
  if (/\.css$/.test(url)) {
    return injectStyle(url, onload, onerror);
  }

  // Handle JS
  return injectScript(url, onload, onerror);
}

// From cdnjs
// https://cdnjs.com/
function cdnjs(name: string) {
  log("Searching for ", strong(name), ", please be patient...");
  fetch(`https://api.cdnjs.com/libraries?search=${name}`, {
    referrerPolicy: "no-referrer",
  })
    .then((res) => res.json())
    .then(({ results }) => {
      if (results.length === 0) {
        logError(
          "Sorry, ",
          strong(name),
          " not found, please try another keyword."
        );
        return;
      }

      const matchedResult = results.filter((item: any) => item.name === name);
      const { name: exactName, latest: url } = matchedResult[0] || results[0];
      if (name !== exactName) {
        log(
          strong(name),
          " not found, import ",
          strong(exactName),
          " instead."
        );
      }

      inject(
        url,
        createBeforeLoad(exactName),
        createOnLoad(exactName, url),
        createOnError(exactName, url)
      );
    })
    .catch(() => {
      logError(
        "There appears to be some trouble with your network. If you think this is a bug, please report an issue:"
      );
      logError("https://github.com/pd4d10/console-importer/issues");
    });
}

// From unpkg
// https://unpkg.com
function unpkg(name: string) {
  createBeforeLoad(name)();
  const url = `https://unpkg.com/${name}`;
  injectScript(url, createOnLoad(name, url), createOnError(name, url));
}

// https://www.jsdelivr.com/esm
async function esm(name: string) {
  log(strong(name), "(esm) is loading, please be patient...");
  const res = await import(`https://esm.run/${name}`);
  return res;
}

// Entry
function importer(originName: unknown) {
  if (typeof originName !== "string") {
    throw new Error("Argument should be a string, please check it.");
  }

  // Trim string
  const name = originName.trim();

  // If it is a valid URL, inject it directly
  if (/^https?:\/\//.test(name)) {
    return inject(name);
  }

  // If version specified, try unpkg
  if (name.indexOf("@") !== -1) {
    return unpkg(name);
  }

  return cdnjs(name);
}

importer.cdnjs = cdnjs;
importer.unpkg = unpkg;
importer.esm = esm;

// Do not output annoying ugly string of function content
importer.toString = () => "$i";

// Assign to console
(console as any).$i = importer;

// Do not break existing $i
const win = window as any;
if (typeof win.$i === "undefined") {
  win.$i = importer;
} else {
  log("$i is already in use, please use `console.$i` instead");
}
