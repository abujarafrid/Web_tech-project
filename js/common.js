
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupNav();
    setupToasts();
    setupBadges();
    setupCollapsibleForms();
    setupPasswordTools();
    setupCharCounters();
    setupDateTimeRules();
    setupFormValidation();
    setupProfilePicture();
    setupVisuals();
    setupExtras();
  }

  
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function toast(msg, type) {
    const box = $("#toast-box");
    const t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
  function setupToasts() {
    const box = document.createElement("div");
    box.id = "toast-box";
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }

  
  function setupNav() {
    const nav = $("header nav");
    if (!nav) return;
    Array.from(nav.childNodes).forEach(n => { if (n.nodeType === 3) n.remove(); });
    const here = location.pathname.split("/").slice(-2).join("/");
    $$("a", nav).forEach(a => {
      const target = a.getAttribute("href").split("/").slice(-2).join("/");
      const sameFolder = a.pathname.split("/").slice(-2).join("/") === here;
      if (sameFolder || target === here) a.classList.add("active");
    });
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.textContent = "\u2630";
    btn.setAttribute("aria-label", "Toggle menu");
    btn.addEventListener("click", () => nav.classList.toggle("open"));
    nav.parentNode.insertBefore(btn, nav);
  }

  
  const BADGES = {
    ok: ["confirmed", "completed", "active", "accepted", "approved", "verified", "resolved"],
    warn: ["pending", "open", "waiting", "warned"],
    bad: ["rejected", "declined", "cancelled", "suspended", "removed"],
    info: ["rescheduled", "dismissed"]
  };
  function badgeClass(text) {
    const t = text.trim().toLowerCase();
    for (const k in BADGES) if (BADGES[k].includes(t)) return "badge-" + k;
    return null;
  }
  function makeBadge(cell, text) {
    const cls = badgeClass(text);
    if (!cls) return;
    cell.innerHTML = "";
    const s = document.createElement("span");
    s.className = "badge " + cls;
    s.textContent = text;
    cell.appendChild(s);
  }
  function setupBadges() {
    $$("table").forEach(tbl => {
      const wrap = document.createElement("div");
      wrap.className = "table-wrap";
      tbl.parentNode.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
      const heads = $$("thead th", tbl).map(th => th.textContent.trim().toLowerCase());
      const si = heads.indexOf("status");
      if (si > -1) $$("tbody tr", tbl).forEach(tr => {
        const c = tr.children[si];
        if (c) makeBadge(c, c.textContent);
      });
    });
    const v = $$("main p b").find(b => /verified/i.test(b.textContent));
    if (v) { v.className = "badge badge-ok"; }
  }

  
  function setupCollapsibleForms() {
    const forms = $$("form[id^='edit-'], form#reschedule");
    forms.forEach(f => f.classList.add("js-collapsible"));
    function sync() {
      const id = location.hash.slice(1);
      forms.forEach(f => f.classList.toggle("open", f.id === id));
    }
    $$("a[href^='#']").forEach(a => {
      const id = a.getAttribute("href").slice(1);
      const f = id && document.getElementById(id);
      if (f && f.classList.contains("js-collapsible")) {
        a.addEventListener("click", e => {
          e.preventDefault();
          const open = f.classList.toggle("open");
          if (open) {
            f.scrollIntoView({ behavior: "smooth", block: "center" });
            const first = $("input:not([type=hidden]),select,textarea", f);
            if (first) first.focus();
          }
        });
      }
    });
    $$("form.js-collapsible button[type=reset]").forEach(b =>
      b.addEventListener("click", () => b.closest("form").classList.remove("open")));
    sync();
  }

  
  function setupPasswordTools() {
    $$("input[type=password]").forEach(inp => {
      const wrap = document.createElement("span");
      wrap.className = "pw-wrap";
      wrap.style.display = "block";
      inp.parentNode.insertBefore(wrap, inp);
      wrap.appendChild(inp);
      inp.style.maxWidth = "100%";
      const t = document.createElement("button");
      t.type = "button";
      t.className = "pw-toggle";
      t.textContent = "Show";
      t.addEventListener("click", () => {
        const show = inp.type === "password";
        inp.type = show ? "text" : "password";
        t.textContent = show ? "Hide" : "Show";
      });
      wrap.appendChild(t);
    });
    $$("input[name=password], input[name=new_password]").forEach(inp => {
      if (!inp.closest("form").querySelector("[name=confirm_password]")) return;
      const bar = document.createElement("div");
      bar.className = "strength";
      bar.innerHTML = "<span></span>";
      const lbl = document.createElement("span");
      lbl.className = "strength-label";
      const host = inp.closest(".pw-wrap");
      host.after(bar);
      bar.after(lbl);
      inp.addEventListener("input", () => {
        const s = strength(inp.value);
        const levels = [["Too short", "#ef4444", 15], ["Weak", "#f97316", 35], ["Fair", "#eab308", 60], ["Good", "#22c55e", 80], ["Strong", "#15803d", 100]];
        const l = inp.value ? levels[s] : ["", "#e5e7eb", 0];
        bar.firstChild.style.width = l[2] + "%";
        bar.firstChild.style.background = l[1];
        lbl.textContent = l[0] ? "Password strength: " + l[0] : "";
      });
    });
  }
  function strength(p) {
    if (p.length < 8) return 0;
    let s = 1;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) s++;
    return Math.min(s, 4);
  }

  
  function setupCharCounters() {
    $$("textarea[maxlength], input[type=text][maxlength]").forEach(el => {
      const c = document.createElement("small");
      c.className = "char-count";
      const upd = () => (c.textContent = el.value.length + " / " + el.maxLength);
      el.after(c);
      el.addEventListener("input", upd);
      el.form && el.form.addEventListener("reset", () => setTimeout(upd));
      upd();
    });
  }

  
  function setupDateTimeRules() {
    const today = new Date().toISOString().slice(0, 10);
    $$("input[type=date]").forEach(d => {
      if (["date", "until"].includes(d.name)) d.min = today;
    });
  }

  
  function filterRows(tbl, test) {
    let shown = 0;
    $$("tbody tr:not(.empty-row)", tbl).forEach(r => {
      const ok = test(r);
      r.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    let empty = $("tbody .empty-row", tbl);
    if (!shown && !empty) {
      empty = document.createElement("tr");
      empty.className = "empty-row";
      empty.innerHTML = "<td colspan='" + tbl.tHead.rows[0].cells.length + "'>No matching records</td>";
      tbl.tBodies[0].appendChild(empty);
    }
    if (empty) empty.style.display = shown ? "none" : "";
    return shown;
  }

  
  function bindActions(ACTIONS) {
    $$("table form").forEach(form => {
      const a = form.querySelector("input[name=action]");
      if (!a || !ACTIONS[a.value]) return;
      form.addEventListener("submit", e => {
        e.preventDefault();
        const [status, msg, confirmIt] = ACTIONS[a.value];
        if (confirmIt && !confirm("Are you sure? (" + a.value + ")")) return;
        const row = form.closest("tr");
        if (a.value === "delete") {
          row.remove();
          toast(msg, "ok");
          return;
        }
        if (a.value === "send_request") {
          const b = form.querySelector("button");
          b.textContent = "Request sent";
          b.disabled = true;
          b.style.opacity = ".6";
          toast(msg, "ok");
          return;
        }
        const tbl = row.closest("table");
        const si = $$("thead th", tbl).findIndex(th => /status/i.test(th.textContent));
        if (si > -1 && status) makeBadge(row.children[si], status);
        $$("form", row.lastElementChild).forEach(f => f !== form && a.value !== "complete" && f.remove());
        form.remove();
        toast(msg, "ok");
      });
    });
  }

  
  function fieldError(el, msg) {
    clearError(el);
    el.classList.add("invalid");
    el.classList.remove("valid");
    const s = document.createElement("small");
    s.className = "error-msg";
    s.textContent = msg;
    (el.closest(".pw-wrap") || el).after(s);
  }
  function clearError(el) {
    el.classList.remove("invalid");
    const host = el.closest(".pw-wrap") || el;
    const nx = host.nextElementSibling;
    if (nx && nx.classList.contains("error-msg")) nx.remove();
    const nx2 = host.nextElementSibling && host.nextElementSibling.nextElementSibling;
    if (nx2 && nx2.classList.contains("error-msg")) nx2.remove();
  }
  function messageFor(el) {
    const v = el.validity;
    if (v.valueMissing) return "This field is required";
    if (v.typeMismatch) return el.type === "email" ? "Enter a valid email address" : "Invalid value";
    if (v.patternMismatch) return el.title || ({ student_id: "Format: 23-12345-1", phone: "Format: 01XXXXXXXXX", code: "Format: CSE101" }[el.name] || "Invalid format");
    if (v.tooShort) return "Must be at least " + el.minLength + " characters";
    if (v.rangeUnderflow) return "Must be at least " + el.min;
    if (v.rangeOverflow) return "Must be at most " + el.max;
    return "Invalid value";
  }
  function checkField(el) {
    clearError(el);
    el.setCustomValidity("");
    const f = el.form;
    if (el.name === "confirm_password") {
      const pw = f.querySelector("[name=password],[name=new_password]");
      if (pw && el.value !== pw.value) el.setCustomValidity("Passwords do not match");
    }
    if (el.name === "new_password" && f.querySelector("[name=current_password]") &&
        el.value && el.value === f.querySelector("[name=current_password]").value)
      el.setCustomValidity("New password must differ from the current one");
    if (el.name === "end_time" || el.name === "to_time") {
      const s = f.querySelector("[name=start_time],[name=from_time]");
      if (s && s.value && el.value && el.value <= s.value) el.setCustomValidity("End time must be after start time");
    }
    if (el.name === "date" && el.value && el.min && el.value < el.min) el.setCustomValidity("Date cannot be in the past");
    if (el.type === "file" && el.files[0] && el.files[0].size > 5 * 1024 * 1024)
      el.setCustomValidity("File must be smaller than 5 MB");
    if (el.checkValidity()) { if (el.value) el.classList.add("valid"); return true; }
    fieldError(el, el.validationMessage && el.willValidate && el.validity.customError ? el.validationMessage : messageFor(el));
    return false;
  }
  function setupFormValidation() {
    $$("form").forEach(form => {
      if (form.method.toLowerCase() === "get" && form.querySelector("[name=from],#min_score,[type=search]")) return;
      if (form.closest("table") && form.querySelector("input[name=action]") && !form.querySelector("[required]")) return;
      form.noValidate = true;
      const fields = () => $$("input:not([type=hidden]):not([type=reset]),select,textarea", form).filter(x => x.type !== "radio" && x.type !== "checkbox");
      fields().forEach(el => {
        el.addEventListener("blur", () => { if (el.value || el.classList.contains("invalid")) checkField(el); });
        el.addEventListener("input", () => { if (el.classList.contains("invalid")) checkField(el); });
        el.addEventListener("change", () => checkField(el));
      });
      const cp = form.querySelector("[name=confirm_password]");
      const np = form.querySelector("[name=password],[name=new_password]");
      if (cp && np) np.addEventListener("input", () => cp.value && checkField(cp));
      form.addEventListener("reset", () => setTimeout(() => {
        $$(".error-msg", form).forEach(x => x.remove());
        fields().forEach(x => x.classList.remove("invalid", "valid"));
      }));
      form.addEventListener("submit", e => {
        e.preventDefault();
        let ok = true, firstBad = null;
        fields().forEach(el => { if (!checkField(el)) { ok = false; firstBad = firstBad || el; } });
        const seen = {};
        $$("input[type=radio][required]", form).forEach(r => {
          if (seen[r.name]) return;
          seen[r.name] = 1;
          const grp = $$("input[type=radio][name='" + r.name + "']", form);
          const fs = r.closest("fieldset");
          const old = fs.querySelector(":scope > .error-msg");
          if (old) old.remove();
          if (!grp.some(x => x.checked)) {
            ok = false;
            const s = document.createElement("small");
            s.className = "error-msg";
            s.textContent = "Please choose an option";
            fs.appendChild(s);
            firstBad = firstBad || r;
          }
        });
        if (!ok) { firstBad.focus(); toast("Please fix the highlighted fields", "err"); return; }
        const act = form.querySelector("input[name=action]");
        if (act && act.value === "delete_account" && !confirm("This will permanently delete your account. Continue?")) return;
        success(form);
      });
    });
  }
  function success(form) {
    form.dispatchEvent(new CustomEvent("sb:submitted", { bubbles: true, detail: { form: form, data: Object.fromEntries(new FormData(form)) } }));
    const title = (form.querySelector("legend") || {}).textContent || "Form";
    toast(title.trim() + " submitted successfully (demo, no server yet)", "ok");
    if (form.classList.contains("js-collapsible")) form.classList.remove("open");
    if (form.id === "" || !form.classList.contains("js-collapsible")) form.reset();
  }

  
  function setupProfilePicture() {
    const inp = $("input[type=file][name=picture]");
    const img = $("main img");
    if (!inp || !img) return;
    inp.addEventListener("change", () => {
      const f = inp.files[0];
      if (f && f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024) img.src = URL.createObjectURL(f);
    });
  }

  
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = String(el.dataset.count).includes(".") ? 1 : 0;
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = (end * p).toFixed(dec) + (el.dataset.suffix || "");
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  function setupVisuals() {
    const main = $("main");
    if (!main) return;
    const ul = $("main > ul");
    if (/dashboard\.html$/.test(location.pathname) && ul) {
      const grid = document.createElement("div");
      grid.className = "stat-grid";
      let any = false;
      $$("li", ul).forEach(li => {
        const m = li.textContent.match(/^(.*?):\s*(\d+(?:\.\d+)?)(.*)$/);
        if (!m) return;
        any = true;
        const c = document.createElement("div");
        c.className = "stat-card reveal";
        c.innerHTML = "<b data-count='" + m[2] + "' data-suffix='" + m[3].trim() + "'>0</b><span></span>";
        c.querySelector("span").textContent = m[1];
        grid.appendChild(c);
      });
      if (any) { ul.replaceWith(grid); }
    }
    const h2 = $("main > h2");
    if (h2 && !main.classList.contains("home")) {
      const b = document.createElement("div");
      b.className = "page-banner";
      b.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#e0e7ff"/><circle cx="24" cy="28" r="7" fill="#fcd9b6"/><path d="M15 27a9 9 0 0 1 18 0z" fill="#312e81"/><rect x="14" y="36" width="20" height="16" rx="7" fill="#6366f1"/><circle cx="42" cy="30" r="7" fill="#f2c29b"/><path d="M34 29a8 8 0 0 1 16 0z" fill="#92400e"/><rect x="32" y="38" width="20" height="14" rx="7" fill="#f59e0b"/></svg><div><strong></strong><small>StudyBuddy</small></div>';
      b.querySelector("strong").textContent = h2.textContent;
      h2.before(b);
    }
    $$("fieldset, .table-wrap, main h3").forEach(e => e.classList.add("reveal"));
    const io = window.IntersectionObserver && new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.dataset && e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    }), { threshold: .15 });
    $$(".reveal, .stats").forEach(e => io ? io.observe(e) : e.classList.add("in"));
  }

  
  const ICONS = { dashboard: "\u{1F3E0}", "find-partners": "\u{1F50D}", "partner-requests": "\u{1F91D}", "book-session": "\u{1F4C5}", "my-sessions": "\u{1F5D3}\uFE0F", review: "\u2B50", "tutor-profile": "\u{1F393}", availability: "\u23F0", "session-requests": "\u{1F4E9}", resources: "\u{1F4DA}", "tutor-applications": "\u2705", courses: "\u{1F4D6}", reports: "\u{1F6A9}", activity: "\u{1F4C8}", users: "\u{1F465}", departments: "\u{1F3DB}\uFE0F", announcements: "\u{1F4E2}", analytics: "\u{1F4CA}", login: "\u{1F510}", register: "\u{1F4DD}", profile: "\u{1F464}", "forgot-password": "\u{1F511}", "reset-password": "\u{1F511}", "change-password": "\u{1F511}" };
  const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#0ea5e9", "#a855f7", "#ec4899"];
  function setupExtras() {
    const page = location.pathname.split("/").pop().replace(".html", "") || "index";
    const ban = $(".page-banner");
    if (ban && ICONS[page]) {
      const old = $("svg", ban), ico = document.createElement("span");
      ico.className = "banner-ico";
      ico.textContent = ICONS[page];
      if (old) old.replaceWith(ico);
      const folder = location.pathname.split("/").slice(-2, -1)[0];
      const roles = { student: "Student area", tutor: "Tutor area", coordinator: "Coordinator area", admin: "Admin area" };
      $("small", ban).textContent = "StudyBuddy \u2022 " + (roles[folder] || "Welcome");
    }
    $$("table").forEach(tbl => {
      const heads = $$("thead th", tbl);
      heads.forEach((th, i) => {
        const h = th.textContent.trim().toLowerCase();
        const rows = $$("tbody tr:not(.empty-row)", tbl);
        if (/^(name|student|tutor|partner|user|requested by|from|reported user|author)$/.test(h))
          rows.forEach(r => {
            const c = r.children[i];
            if (!c || c.querySelector(".avatar") || !c.textContent.trim()) return;
            const nm = c.textContent.trim(), a = document.createElement("span");
            a.className = "avatar";
            a.textContent = nm.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
            a.style.background = COLORS[(nm.charCodeAt(0) + nm.length) % COLORS.length];
            c.insertBefore(a, c.firstChild);
          });
        if (/score|match|compat/.test(h))
          rows.forEach(r => {
            const c = r.children[i], n = parseFloat(c && c.textContent);
            if (isNaN(n)) return;
            const b = document.createElement("span");
            b.className = "bar";
            b.innerHTML = "<i></i>";
            c.appendChild(b);
            const f = b.firstChild;
            f.style.background = n >= 75 ? "#22c55e" : n >= 50 ? "#f59e0b" : "#ef4444";
            setTimeout(() => (f.style.width = Math.min(n, 100) + "%"), 200);
          });
        if (!/^(action|actions)$/.test(h) && h) {
          th.classList.add("sortable");
          th.addEventListener("click", () => {
            const asc = !th.classList.contains("asc");
            heads.forEach(x => x.classList.remove("asc", "desc"));
            th.classList.add(asc ? "asc" : "desc");
            const body = tbl.tBodies[0], rs = $$("tr:not(.empty-row)", body);
            rs.sort((a, b) => {
              const x = a.children[i].textContent.trim(), y = b.children[i].textContent.trim();
              const nx = parseFloat(x), ny = parseFloat(y);
              const r = !isNaN(nx) && !isNaN(ny) ? nx - ny : x.localeCompare(y);
              return asc ? r : -r;
            }).forEach(r => body.appendChild(r));
          });
        }
      });
    });
    $$("select[name=rating], input[name=rating]").forEach(inp => {
      const wrap = document.createElement("div");
      wrap.className = "stars";
      for (let n = 1; n <= 5; n++) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = "\u2605";
        b.setAttribute("aria-label", n + " star");
        b.addEventListener("click", () => {
          inp.value = n;
          inp.dispatchEvent(new Event("change", { bubbles: true }));
          paint(n);
          toast("Rated " + n + " / 5", "ok");
        });
        wrap.appendChild(b);
      }
      const paint = v => $$("button", wrap).forEach((b, i) => b.classList.toggle("on", i < v));
      inp.before(wrap);
      inp.addEventListener("change", () => paint(Number(inp.value) || 0));
      paint(Number(inp.value) || 0);
    });
    const hd = $("header");
    if (hd) {
      const t = document.createElement("button");
      t.type = "button";
      t.className = "theme-toggle";
      t.setAttribute("aria-label", "Toggle dark mode");
      const apply = d => { document.documentElement.dataset.theme = d ? "dark" : "light"; t.textContent = d ? "\u2600\uFE0F" : "\u{1F319}"; };
      let dark = false;
      try { dark = localStorage.getItem("sb-theme") === "dark"; } catch (e) {}
      apply(dark);
      t.addEventListener("click", () => {
        dark = !dark; apply(dark);
        try { localStorage.setItem("sb-theme", dark ? "dark" : "light"); } catch (e) {}
      });
      hd.appendChild(t);
    }
    const up = document.createElement("button");
    up.type = "button";
    up.className = "to-top";
    up.textContent = "\u2191";
    up.setAttribute("aria-label", "Back to top");
    up.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(up);
    window.addEventListener("scroll", () => up.classList.toggle("show", window.scrollY > 300));
  }

  function dateRange() {
    $$("form[method=get]").forEach(form => {
      const from = form.querySelector("[name=from]"), to = form.querySelector("[name=to]");
      if (!from || !to) return;
      form.addEventListener("submit", e => {
        e.preventDefault();
        if (from.value && to.value && from.value > to.value) {
          fieldError(to, "End date must be after start date");
        } else {
          clearError(to);
          toast("Filter applied", "ok");
        }
      });
    });
  }

  window.SB = { $: $, $$: $$, toast: toast, makeBadge: makeBadge, filterRows: filterRows, bindActions: bindActions, dateRange: dateRange };
})();
