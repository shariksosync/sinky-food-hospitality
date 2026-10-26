import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialData } from "./data.js";

const KEY = "sinky-demo-data-v1";
const AUTH_KEY = "sinky-demo-admin-session";
export const DEMO_EMAIL = "admin@sinkyindustries.local";
export const DEMO_PASSWORD = "SinkyDemo@2026";

const clone = (o) => JSON.parse(JSON.stringify(o));

export const storage = {
  load() {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return { ...clone(initialData), ...parsed };
    } catch {
      return null;
    }
  },
  save(data) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* storage full or unavailable */
    }
  },
};

export const uid = (p = "id") => `${p}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;

/* ---------------- Router (History API) ---------------- */
const RouterCtx = createContext({ path: "/", search: new URLSearchParams(), navigate: () => {} });

export function RouterProvider({ initialPath, children }) {
  const [path, setPath] = useState(() => (typeof window !== "undefined" ? window.location.pathname + window.location.search : initialPath || "/"));

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPath(window.location.pathname + window.location.search);
    const onPop = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, { replace } = {}) => {
    if (!to) return;
    if (/^(https?:|mailto:|tel:)/.test(to)) {
      if (typeof window !== "undefined") window.location.href = to;
      return;
    }
    const [p, hash] = to.split("#");
    if (typeof window !== "undefined") {
      if (replace) window.history.replaceState({}, "", to);
      else window.history.pushState({}, "", to);
      setPath(to);
      if (hash) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 60);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setPath(to);
    }
  }, []);

  const [pathname, searchStr = ""] = path.split("?");
  const search = useMemo(() => new URLSearchParams(searchStr), [searchStr]);

  return <RouterCtx.Provider value={{ path: pathname || "/", search, navigate }}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || /^(https?:|mailto:|tel:)/.test(to)) return;
        e.preventDefault();
        onClick?.(e);
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function matchPath(pattern, path) {
  const a = pattern.split("/").filter(Boolean);
  const b = path.replace(/\/+$/, "").split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

/* ---------------- App data ---------------- */
const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => clone(initialData));
  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = storage.load();
    if (saved) setData(saved);
    try {
      if (typeof window !== "undefined") {
        setAuthed(window.localStorage.getItem(AUTH_KEY) === "1");
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) storage.save(data);
  }, [data, loaded]);

  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const log = (d, text) => ({
    ...d,
    activity: [{ id: uid("a"), text, date: new Date().toISOString() }, ...(d.activity || [])].slice(0, 40),
  });

  const actions = useMemo(
    () => ({
      setSection(key, value, label) {
        setData((d) => log({ ...d, [key]: value }, label || `Updated ${key}`));
      },
      upsert(key, item, label) {
        setData((d) => {
          const list = d[key] || [];
          const exists = list.some((x) => x.id === item.id);
          const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, { ...item, id: item.id || uid(key.slice(0, 2)) }];
          return log(
            { ...d, [key]: next },
            `${exists ? "Updated" : "Added"} ${label || key}: ${item.title || item.name || item.label || item.caption || item.id}`
          );
        });
      },
      remove(key, id, label) {
        setData((d) => log({ ...d, [key]: d[key].filter((x) => x.id !== id) }, `Deleted ${label || key} item`));
      },
      patch(key, id, changes) {
        setData((d) => log({ ...d, [key]: d[key].map((x) => (x.id === id ? { ...x, ...changes } : x)) }, `Changed ${key} item`));
      },
      reorder(key, id, direction) {
        setData((d) => {
          const list = [...(d[key] || [])];
          const idx = list.findIndex((x) => x.id === id);
          if (idx === -1) return d;
          const targetIdx = direction === "up" ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= list.length) return d;
          const temp = list[idx];
          list[idx] = list[targetIdx];
          list[targetIdx] = temp;
          // If items have order attribute, normalize order
          if ("order" in list[0]) {
            list.forEach((item, i) => {
              item.order = i + 1;
            });
          }
          return log({ ...d, [key]: list }, `Reordered ${key}`);
        });
      },
      canDeleteCategory(catId) {
        const count = (data.products || []).filter((p) => p.category === catId).length;
        return { allowed: count === 0, count };
      },
      addEnquiry(enq) {
        const item = { ...enq, id: `ENQ-${Date.now().toString().slice(-6)}`, date: new Date().toISOString(), status: "New" };
        setData((d) => log({ ...d, enquiries: [item, ...d.enquiries] }, `New enquiry from ${enq.name}`));
        return item;
      },
      reset() {
        const fresh = clone(initialData);
        fresh.activity = [{ id: uid("a"), text: "Reset all website data to factory defaults", date: new Date().toISOString() }];
        setData(fresh);
      },
      login(email, password) {
        if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
          try {
            if (typeof window !== "undefined") window.localStorage.setItem(AUTH_KEY, "1");
          } catch {}
          setAuthed(true);
          return true;
        }
        return false;
      },
      logout() {
        try {
          if (typeof window !== "undefined") window.localStorage.removeItem(AUTH_KEY);
        } catch {}
        setAuthed(false);
      },
    }),
    [data]
  );

  const value = useMemo(
    () => ({ data, loaded, authed, toast, notify, ...actions }),
    [data, loaded, authed, toast, notify, actions]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);
export const catName = (data, id) => data.categories.find((c) => c.id === id)?.name || "Uncategorized";
export const lines = (s) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);
