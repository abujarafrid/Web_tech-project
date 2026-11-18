(function () {
  "use strict";
  const { $, $$, toast, filterRows, bindActions, dateRange } = window.SB;
  document.addEventListener("DOMContentLoaded", function () {
    bindActions({
      suspend: ["Suspended", "User suspended", true],
      delete: [null, "Deleted", true]
    });
    dateRange();

    const q = $("input[type=search]");
    if (q) {
      const tbl = $("table");
      const run = () => filterRows(tbl, r => r.textContent.toLowerCase().includes(q.value.trim().toLowerCase()));
      q.addEventListener("input", run);
      q.form.addEventListener("submit", e => { e.preventDefault(); run(); });
    }
  });
})();
