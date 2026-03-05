document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setCollapsibleState = (el, open) => {
    if (!el) return;

    el.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in el) el.inert = !open;

    if (open) {
      el.hidden = false;
      if (prefersReducedMotion) {
        el.style.height = "auto";
        el.style.opacity = "1";
        return;
      }

      el.style.height = "0px";
      el.style.opacity = "0";
      requestAnimationFrame(() => {
        el.style.height = `${el.scrollHeight}px`;
        el.style.opacity = "1";
      });

      const onOpenEnd = (event) => {
        if (event.propertyName !== "height") return;
        if (el.getAttribute("aria-hidden") === "false") {
          el.style.height = "auto";
          el.style.opacity = "1";
        }
        el.removeEventListener("transitionend", onOpenEnd, true);
      };
      el.addEventListener("transitionend", onOpenEnd, true);
      return;
    }

    if (prefersReducedMotion) {
      el.style.height = "0px";
      el.style.opacity = "0";
      el.hidden = true;
      return;
    }

    el.style.height = `${el.scrollHeight}px`;
    el.style.opacity = "1";
    requestAnimationFrame(() => {
      el.style.height = "0px";
      el.style.opacity = "0";
    });

    window.setTimeout(() => {
      if (el.getAttribute("aria-hidden") === "true") {
        el.hidden = true;
      }
    }, 300);
  };

  const syncExpandedHeight = (el) => {
    if (!el || prefersReducedMotion || el.getAttribute("aria-hidden") !== "false") return;
    if (el.style.height === "auto") return;
    requestAnimationFrame(() => {
      el.style.height = `${el.scrollHeight}px`;
    });
  };

  const servicesToggle = document.getElementById("servicesToggle");
  const catalogPanel = document.getElementById("servicesCatalogPanel");
  const contactToggle = document.getElementById("contactToggle");
  const contactBlock = document.getElementById("contactBlock");
  const categories = Array.from(document.querySelectorAll(".catalog-cat"));

  const setSubState = (catBody, subRow, open) => {
    const subBtn = subRow.querySelector(".sub-button");
    const desc = subRow.querySelector(".desc");
    if (!subBtn || !desc) return;

    subBtn.setAttribute("aria-expanded", open ? "true" : "false");
    subRow.classList.toggle("is-open", open);
    desc.classList.toggle("is-open", open);
    setCollapsibleState(desc, open);
    syncExpandedHeight(catBody);
    syncExpandedHeight(catalogPanel);
  };

  const closeCategory = (cat) => {
    const catBtn = cat.querySelector(".cat-button");
    const catBody = cat.querySelector(".cat-body");
    if (!catBtn || !catBody) return;

    catBtn.setAttribute("aria-expanded", "false");
    const subRows = cat.querySelectorAll(".sub-row");
    subRows.forEach((subRow) => setSubState(catBody, subRow, false));
    setCollapsibleState(catBody, false);
  };

  const openCategory = (cat) => {
    const catBtn = cat.querySelector(".cat-button");
    const catBody = cat.querySelector(".cat-body");
    if (!catBtn || !catBody) return;

    catBtn.setAttribute("aria-expanded", "true");
    setCollapsibleState(catBody, true);
    syncExpandedHeight(catalogPanel);
  };

  categories.forEach((cat) => {
    const catBtn = cat.querySelector(".cat-button");
    const catBody = cat.querySelector(".cat-body");
    if (!catBtn || !catBody) return;

    closeCategory(cat);

    catBtn.addEventListener("click", () => {
      const isOpen = catBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeCategory(cat);
        syncExpandedHeight(catalogPanel);
        return;
      }

      categories.forEach((other) => {
        if (other !== cat) closeCategory(other);
      });
      openCategory(cat);
    });

    const subRows = Array.from(cat.querySelectorAll(".sub-row"));
    subRows.forEach((subRow) => {
      const subBtn = subRow.querySelector(".sub-button");
      if (!subBtn) return;

      setSubState(catBody, subRow, false);
      subBtn.addEventListener("click", () => {
        const isOpen = subBtn.getAttribute("aria-expanded") === "true";
        subRows.forEach((other) => {
          if (other !== subRow) setSubState(catBody, other, false);
        });
        setSubState(catBody, subRow, !isOpen);
      });
    });
  });

  if (servicesToggle && catalogPanel) {
    servicesToggle.setAttribute("aria-expanded", "false");
    setCollapsibleState(catalogPanel, false);

    servicesToggle.addEventListener("click", () => {
      const shouldOpen = servicesToggle.getAttribute("aria-expanded") !== "true";
      servicesToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");

      if (shouldOpen) {
        setCollapsibleState(catalogPanel, true);
        return;
      }

      categories.forEach((cat) => closeCategory(cat));
      setCollapsibleState(catalogPanel, false);
    });
  }

  if (contactToggle && contactBlock) {
    contactToggle.setAttribute("aria-expanded", "false");
    setCollapsibleState(contactBlock, false);

    contactToggle.addEventListener("click", () => {
      const shouldOpen = contactToggle.getAttribute("aria-expanded") !== "true";
      contactToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      setCollapsibleState(contactBlock, shouldOpen);
    });
  }

  const galleryModal = document.getElementById("galleryModal");
  const galleryClose = document.getElementById("galleryClose");
  const galleryImage = document.getElementById("galleryImage");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const galleryTitle = document.getElementById("galleryTitle");
  const galleryDescription = document.getElementById("galleryDescription");
  const galleryYear = document.getElementById("galleryYear");
  const galleryCity = document.getElementById("galleryCity");
  const galleryOverlay = galleryModal?.querySelector(".gallery-overlay");
  const galleryGrids = Array.from(document.querySelectorAll(".gallery-grid"));

  if (
    galleryModal &&
    galleryClose &&
    galleryImage &&
    galleryThumbs &&
    galleryTitle &&
    galleryDescription &&
    galleryYear &&
    galleryCity &&
    galleryGrids.length
  ) {
    const sinevaGallery = [
      {
        image: "../assets/sineva/sineva1.webp",
        title: "Синева",
        description: "Commercial visual story.",
        location: "Санкт-Петербург",
        date: "2025"
      },
      {
        image: "../assets/sineva/sineva2.webp",
        title: "Синева",
        description: "Commercial visual story.",
        location: "Санкт-Петербург",
        date: "2025"
      },
      {
        image: "../assets/sineva/sineva3.webp",
        title: "Синева",
        description: "Commercial visual story.",
        location: "Санкт-Петербург",
        date: "2025"
      },
      {
        image: "../assets/sineva/sineva4.webp",
        title: "Синева",
        description: "Commercial visual story.",
        location: "Санкт-Петербург",
        date: "2025"
      },
      {
        image: "../assets/sineva/sineva5.webp",
        title: "Синева",
        description: "Commercial visual story.",
        location: "Санкт-Петербург",
        date: "2025"
      },
      {
        image: "../assets/sineva/sineva6.webp",
        title: "Синева",
        description: "Commercial visual story.",
        location: "Санкт-Петербург",
        date: "2025"
      }
    ];

    const galleryByProject = {
      sineva: sinevaGallery
    };

    let activeItems = sinevaGallery;
    let currentIndex = 0;
    let lastTrigger = null;

    const updateGallery = () => {
      if (!activeItems.length) return;
      currentIndex = Math.max(0, Math.min(currentIndex, activeItems.length - 1));
      const item = activeItems[currentIndex];
      galleryImage.src = item.image;
      galleryImage.alt = item.title;
      galleryTitle.textContent = item.title;
      galleryDescription.textContent = item.description;
      galleryYear.textContent = item.date;
      galleryCity.textContent = item.location;

      const thumbs = Array.from(galleryThumbs.querySelectorAll(".thumb"));
      thumbs.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("active", thumbIndex === currentIndex);
      });
    };

    const renderThumbs = () => {
      galleryThumbs.replaceChildren();
      activeItems.forEach((item, idx) => {
        const thumbButton = document.createElement("button");
        thumbButton.type = "button";
        thumbButton.className = "thumb";
        thumbButton.setAttribute("aria-label", `Open image ${idx + 1}`);

        const thumb = document.createElement("img");
        thumb.src = item.image;
        thumb.alt = `${item.title} ${idx + 1}`;
        thumb.decoding = "async";
        thumb.loading = "lazy";
        thumbButton.addEventListener("click", () => {
          currentIndex = idx;
          updateGallery();
        });
        thumbButton.append(thumb);
        galleryThumbs.append(thumbButton);
      });
    };

    const closeGallery = () => {
      galleryModal.classList.remove("active");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    };

    const openGallery = (project, index, trigger) => {
      activeItems = galleryByProject[project] || [];
      currentIndex = Number(index) || 0;
      lastTrigger = trigger || null;
      if (!activeItems.length) {
        console.error(`Gallery data not found for project: ${project}`);
        return;
      }
      renderThumbs();
      updateGallery();
      galleryModal.classList.add("active");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    };

    galleryGrids.forEach((grid) => {
      const buttons = Array.from(grid.querySelectorAll(".gallery-item"));
      buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          const project = button.dataset.project || grid.dataset.project || "sineva";
          openGallery(project, button.dataset.index, button);
        });
      });
    });

    galleryClose.addEventListener("click", closeGallery);
    galleryOverlay?.addEventListener("click", closeGallery);
    galleryModal.addEventListener("click", (event) => {
      if (event.target === galleryModal) closeGallery();
    });

    document.addEventListener("keydown", (event) => {
      if (!galleryModal.classList.contains("active")) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") {
        currentIndex = Math.max(0, currentIndex - 1);
        updateGallery();
      }
      if (event.key === "ArrowRight") {
        currentIndex = Math.min(activeItems.length - 1, currentIndex + 1);
        updateGallery();
      }
    });
  } else {
    console.error("Gallery modal initialization failed: required DOM elements are missing.");
  }

  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  els.forEach((el) => io.observe(el));

  setTimeout(() => {
    els.forEach((el) => el.classList.add("reveal--visible"));
  }, 1200);
});
