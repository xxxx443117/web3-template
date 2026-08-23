import { ref } from "vue";

/** localStorage 存储主题模式的 key */
export const THEME_KEY = "THEME_v2";

/** 主题模式：light 白天 / dark 黑夜 / auto 跟随系统 */
export type ThemeMode = "light" | "dark" | "auto";

// 读取上次保存的主题，默认跟随系统
const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
const initialMode: ThemeMode = saved === "light" || saved === "dark" || saved === "auto" ? saved : "auto";

/** 当前主题模式 */
export const themeMode = ref<ThemeMode>(initialMode);
/** 实际生效的主题值（light / dark） */
export const theme = ref<"light" | "dark">(resolve(initialMode));

// 监听系统主题变化，auto 模式下自动切换
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (themeMode.value === "auto") apply(e.matches ? "dark" : "light");
});

/** 将主题模式解析为实际值，auto 时读取系统偏好 */
function resolve(mode: ThemeMode): "light" | "dark" {
  return mode === "auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
}

/** 将主题应用到页面（通过 <html> 的 .dark class 配合 Tailwind） */
function apply(resolved: "light" | "dark") {
  theme.value = resolved;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

/** 设置主题模式，供 UI 调用 */
export function setTheme(newMode: ThemeMode) {
  themeMode.value = newMode;
  localStorage.setItem(THEME_KEY, newMode);
  apply(resolve(newMode));
}

// 页面加载时初始化主题
apply(resolve(initialMode));

export const themeVars = {
  // textColor: "white"
};

// 仅在深色模式下生效的主题变量
export const themeVarsDark = {
  // textPrimary: "white",
  // subText: "#FFFFFF99",
  // BgPrimary: "#030306",
  // bg1: "#FFFFFF1A",
};

// 仅在浅色模式下生效的主题变量
export const themeVarsLight = {
  // textPrimary: "black",
  // subText: "#FFFFFF99",
  // BgPrimary: "white",
  // bg1: "#0000000F",
};
