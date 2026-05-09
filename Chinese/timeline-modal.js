(function () {
  var dialog = document.getElementById("timeline-demo-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  var titleEl = dialog.querySelector(".timeline-modal__title");
  var subtitleEl = dialog.querySelector("#timeline-modal-subtitle");
  var bodyEl = dialog.querySelector(".timeline-modal__body");
  var closeBtn = dialog.querySelector(".timeline-modal__close");
  var flowRoot = document.getElementById("email-flow");
  var lastOpener = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function resetFlowClasses() {
    if (!flowRoot) return;
    flowRoot.classList.remove("email-flow--play", "email-flow--static");
  }

  function applyFlowForOpen() {
    if (!flowRoot) return;
    resetFlowClasses();
    if (prefersReducedMotion()) {
      flowRoot.classList.add("email-flow--static");
      return;
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!dialog.open || !flowRoot) return;
        void flowRoot.offsetWidth;
        flowRoot.classList.add("email-flow--play");
      });
    });
  }

  function openFromCard(card) {
    lastOpener = card;
    if (titleEl) titleEl.textContent = card.getAttribute("data-modal-title") || "";
    if (subtitleEl) subtitleEl.textContent = card.getAttribute("data-modal-subtitle") || "";
    if (bodyEl) bodyEl.textContent = card.getAttribute("data-modal-body") || "";
    dialog.showModal();
    if (flowRoot) {
      flowRoot.setAttribute("aria-hidden", "false");
      applyFlowForOpen();
    }
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
    if (flowRoot) {
      flowRoot.setAttribute("aria-hidden", "true");
      resetFlowClasses();
    }
    if (lastOpener && document.contains(lastOpener)) {
      lastOpener.focus();
    }
    lastOpener = null;
  });
})();
