import { Signale } from "signale";
import fs from "fs";

const logStream = fs.createWriteStream("logs/server.log", { flags: "a" }) as any;

const fileLog = (level: string, ...args: any[]) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const message = args.join(" ");
  logStream.write(`[${date}] [${time}] ${level.toUpperCase()}: ${message}\n`);
};

export const signale = new Signale({
  scope: "API",
  types: {
    log: {
      badge: "",
      color: "white",
      label: "",
    },
    success: {
      badge: "🚀",
      color: "green",
      label: "SUCCESS:",
    },
    error: {
      badge: "🚨",
      color: "red",
      label: "ERROR:",
    },
    warn: {
      badge: "⚠️",
      color: "yellow",
      label: "WARNING:",
    },
    info: {
      badge: "ℹ️",
      color: "cyan",
      label: "INFO:",
    },
    debug: {
      badge: "🐛",
      color: "magenta",
      label: "DEBUG:",
    },
  },
  config: {
    displayTimestamp: true,
    displayDate: true,
    displayScope: false,
  },
});

declare global {
  interface Console {
    success: (...args: any[]) => void;
  }
}

console.log = (...args) => {
  signale.log(...args);
  fileLog("🤖 log", ...args);
};
console.error = (...args) => {
  signale.error(...args);
  fileLog("🚨 error", ...args);
};
console.warn = (...args) => {
  signale.warn(...args);
  fileLog("⚠️ warn", ...args);
};
console.info = (...args) => {
  signale.info(...args);
  fileLog("ℹ️ info", ...args);
};
console.debug = (...args) => {
  signale.debug(...args);
  fileLog("🐛 debug", ...args);
};
console.success = (...args) => {
  signale.success(...args);
  fileLog("🚀 success", ...args);
};

console.clear = function () {
  process.stdout.write("\x1Bc");
  logStream.write(`${new Array(90).join("=")}\n`);
};
