(function () {
  "use strict";
  const { $, $$, toast, filterRows, bindActions, dateRange } = window.SB;
  document.addEventListener("DOMContentLoaded", function () {
    bindActions({
      accept: ["Accepted", "Request accepted"],
      reject: ["Rejected", "Request rejected"],
      cancel: ["Cancelled", "Cancelled", true],
      delete: [null, "Review deleted", true],
      send_request: [null, "Partner request sent"]
    });

    const f = $("form[method=get]");
    if (f && $("#min_score")) {
      const tbl = $("table");
      f.addEventListener("submit", e => {
        e.preventDefault();
        const dep = $("#department").value.toLowerCase();
        const course = $("#course").value.split(" ")[0].toLowerCase();
        const method = (f.querySelector("[name=study_method]:checked") || {}).value;
        const min = Number($("#min_score").value) || 0;
        const shown = filterRows(tbl, r => {
          const c = r.children;
          const score = parseInt(c[5].textContent, 10) || 0;
          return (!dep || c[1].textContent.toLowerCase() === dep) &&
            (!course || c[2].textContent.toLowerCase().includes(course)) &&
            (!method || c[4].textContent.toLowerCase().replace("-", "_") === method) &&
            score >= min;
        });
        toast(shown + " partner(s) found", shown ? "ok" : "err");
      });
      f.addEventListener("reset", () => setTimeout(() => filterRows(tbl, () => true)));
    }

    document.addEventListener("sb:submitted", e => {
      const d = e.detail.data;
      if (d.date && d.start_time) toast("Session booked for " + d.date + " at " + d.start_time, "ok");
    });
  });
})();
