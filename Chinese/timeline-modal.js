(function () {
  var dialog = document.getElementById("timeline-demo-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  var titleEl = dialog.querySelector(".timeline-modal__title");
  var bodyEl = dialog.querySelector(".timeline-modal__body");
  var closeBtn = dialog.querySelector(".timeline-modal__close");
  var lastOpener = null;

  function openFromCard(card) {
    if (!titleEl || !bodyEl) return;
    lastOpener = card;
    titleEl.textContent = card.getAttribute("data-modal-title") || "";
    bodyEl.textContent = card.getAttribute("data-modal-body") || "";
    dialog.showModal();
    if (closeBtn) closeBtn.focus();
  }

  document.querySelectorAll(".timeline__card--clickable").forEach(function (card) {
    card.addEventListener("click", function () {
      openFromCard(card);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromCard(card);
      }
    });
  });

  function closeModal() {
    dialog.close();
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeModal();
  });

  dialog.addEventListener("close", function () {
    if (lastOpener && document.contains(lastOpener)) {
      lastOpener.focus();
    }
    lastOpener = null;
  });
})();
