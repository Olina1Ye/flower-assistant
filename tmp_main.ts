import "/src/index.css";
import "/src/figma/app.css";
try {
  console.log("[main.ts] boot", { pathname: typeof window !== "undefined" ? window.location.pathname : null });
} catch (e) {
}
import { assistantHtml, homeHtml, identifyHtml, pageMetaByPath } from "/src/figma/pages.ts";
import { mountAssistant } from "/src/pages/assistant.ts";
// 修复：删掉了路径后面的 ?t=1770729108776 缓存参数
import { mountIdentify } from "/src/pages/identify.ts";

const routes = {
  "/": () => renderPage("/", homeHtml),
  "/assistant": () => renderPage("/assistant", assistantHtml),
  "/identify": () => renderPage("/identify", identifyHtml)
};

function getRoot() {
  const el = document.getElementById("root");
  if (!el) throw new Error("Missing #root");
  return el;
}

function setTitle(path) {
  const meta = pageMetaByPath[path];
  if (meta?.title) document.title = meta.title;
}

function applyScale(meta) {
  const baseWidth = meta?.baseWidth ?? 1440;
  const baseHeight = meta?.baseHeight ?? 1300;
  const maxSiteWidth = 1200;
  const maxRenderedWidth = Math.min(meta?.maxRenderedWidth ?? maxSiteWidth, maxSiteWidth);
  const scale = Math.min(window.innerWidth / baseWidth, maxRenderedWidth / baseWidth, 1);
  document.documentElement.style.setProperty("--figma-scale", String(scale));
  document.documentElement.style.setProperty("--figma-base-width", String(baseWidth));
  document.documentElement.style.setProperty("--figma-base-height", String(baseHeight));
}

function renderPage(path, html) {
  try {
    console.log("[main.ts] renderPage called", { path });
  } catch (e) {
  }
  setTitle(path);
  const meta = pageMetaByPath[path];
  applyScale(meta);
  const root = getRoot();
  root.classList.remove("page-enter");
  root.innerHTML = `
    <div class="app-root">
      <div class="figma-viewport">
        <div class="figma-scale">
          <div class="figma-inner">
            <div class="figma-frame" data-path="${path}">${html}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  try {
    console.log("[main.ts] set innerHTML, html length", { len: String(html?.length ?? 0), preview: root.innerHTML.slice(0, 200) });
  } catch (e) {
  }
  requestAnimationFrame(() => root.classList.add("page-enter"));
  bindNav(root);
  if (path === "/assistant") mountAssistant(root);
  if (path === "/identify") mountIdentify(root);
}

function bindNav(root) {
  const navEls = root.querySelectorAll("[data-nav]");
  navEls.forEach((el) => {
    el.style.cursor = "pointer";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    const to = el.getAttribute("data-nav");
    if (!to) return;
    const onActivate = () => navigate(to);
    el.addEventListener("click", onActivate);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    });
  });
}

function normalizePath(path) {
  if (path === "/" || path === "/assistant" || path === "/identify") return path;
  return "/";
}

export function navigate(path) {
  const next = normalizePath(path);
  if (window.location.pathname === next) return;
  window.history.pushState({}, "", next);
  routes[next]();
}

window.addEventListener("popstate", () => {
  routes[normalizePath(window.location.pathname)]();
});

window.addEventListener("resize", () => {
  const meta = pageMetaByPath[window.location.pathname];
  applyScale(meta);
});

try {
  console.log("[main.ts] initial render start", { pathname: window.location.pathname });
} catch (e) {
}

routes[normalizePath(window.location.pathname)]();

try {
  console.log("[main.ts] initial render done");
} catch (e) {
}