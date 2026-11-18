(function () {
  "use strict";
  const { $, $$, toast, filterRows, bindActions, dateRange } = window.SB;
  document.addEventListener("DOMContentLoaded", function () {
    bindActions({
      accept: ["Confirmed", "Session accepted"],
      decline: ["Declined", "Session declined"],
      complete: ["Completed", "Session marked as completed"],
      delete: [null, "Item deleted", true]
    });

    document.addEventListener("sb:submitted", e => {
      const d = e.detail.data;
      if (d.day && d.start_time && d.end_time) toast("Slot added: " + d.day + " " + d.start_time + " to " + d.end_time, "ok");
    });
  });
})();
