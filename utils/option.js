import { readFile, readFileAsync, writeFile } from "astal";
import { Variable } from "astal";
import { GLib, Gio } from "astal";
import { monitorFile } from "astal";
import { cacheDir, ensureDirectory } from ".";

function getNestedValue(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;

  for (let key of keys) {
    if (current && current.hasOwnProperty(key)) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

export class Opt extends Variable {
  constructor(initial, { cached = false }) {
    super(initial);
    this.initial = initial;
    this.cached = cached;
  }

  initial;
  id = "";
  cached = false;

  init(configFile) {
    const dir = this.cached ? `${cacheDir}/options.json` : configFile;

    if (GLib.file_test(dir, GLib.FileTest.EXISTS)) {
      const config = JSON.parse(readFile(dir) || {});
      const configV = this.cached
        ? config[this.id]
        : getNestedValue(config, this.id);
      if (configV !== undefined) {
        this.set(configV);
      }
    }

    if (this.cached) {
      this.subscribe((value) => {
        readFileAsync(`${cacheDir}/options.json`)
          .then((content) => {
            const cache = JSON.parse(content);
            cache[this.id] = value;
            writeFile(
              `${cacheDir}/options.json`,
              JSON.stringify(cache, null, 2),
            );
          })
          .catch(() => "");
      });
    }
  }
}

export const opt = (initial, opts = {}) => new Opt(initial, opts);

function getOptions(object, path = "") {
  return Object.keys(object).flatMap((key) => {
    const obj = object[key];
    const id = path ? path + "." + key : key;

    if (obj instanceof Variable) {
      obj.id = id;
      return obj;
    }

    if (typeof obj === "object") return getOptions(obj, id);

    return [];
  });
}

function transformObject(obj) {
  if (obj instanceof Opt) {
    return obj.cached ? undefined : obj.get();
  }

  if (typeof obj !== "object") return;

  const newObj = {};

  Object.keys(obj).forEach((key) => {
    newObj[key] = transformObject(obj[key]);
  });

  const length = Object.keys(JSON.parse(JSON.stringify(newObj))).length;

  return length > 0 ? newObj : undefined;
}

export function mkOptions(configFile, object) {
  for (const opt of getOptions(object)) {
    opt.init(configFile);
  }

  ensureDirectory(configFile.split("/").slice(0, -1).join("/"));
  const configVar = Variable(transformObject(object));

  if (GLib.file_test(configFile, GLib.FileTest.EXISTS)) {
    configVar.set(JSON.parse(readFile(configFile)));
  }

  function updateConfig(oldConfig, newConfig, path = "") {
    for (const key in newConfig) {
      const fullPath = path ? `${path}.${key}` : key;
      if (
        typeof newConfig[key] === "object" &&
        !Array.isArray(newConfig[key])
      ) {
        updateConfig(oldConfig[key], newConfig[key], fullPath);
      } else if (
        JSON.stringify(oldConfig[key]) != JSON.stringify(newConfig[key])
      ) {
        const conf = getOptions(object).find((c) => c.id == fullPath);
        console.log(`${fullPath} updated`);
        if (conf) {
          const newC = configVar.get();
          setNestedValue(newC, fullPath, newConfig[key]);
          configVar.set(newC);
          conf.set(newConfig[key]);
        }
      }
    }
  }

  monitorFile(configFile, (_, event) => {
    if (event == Gio.FileMonitorEvent.CHANGED) {
      const cache = JSON.parse(readFile(configFile) || "{}");
      updateConfig(configVar.get(), cache);
    }
  });

  return Object.assign(object, {
    configFile,
    handler(deps, callback) {
      for (const opt of getOptions(object)) {
        if (deps.some((i) => opt.id.startsWith(i))) opt.subscribe(callback);
      }
    },
  });
}
