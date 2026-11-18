(function () {
  "use strict";
  const { $, $$, toast, filterRows, bindActions, dateRange } = window.SB;
  document.addEventListener("DOMContentLoaded", function () {
    bindActions({
      delete: [null, "Course deleted", true],
      dismiss: ["Dismissed", "Report dismissed"],
      remove: ["Removed", "Content removed", true],
      warn: ["Warned", "User warned"]
    });
    dateRange();

    document.addEventListener("sb:submitted", e => {
      const d = e.detail.data;
      if (!d.decision) return;
      const row = e.detail.form.closest("tr");
      const tbl = row.closest("table");
      const si = $$("thead th", tbl).findIndex(th => /status/i.test(th.textContent));
      if (si > -1) window.SB.makeBadge(row.children[si], d.decision === "approve" ? "Approved" : "Rejected");
      toast("Tutor application " + (d.decision === "approve" ? "approved" : "rejected"), "ok");
    });
  });
})();
