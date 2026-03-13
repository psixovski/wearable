document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const descriptionBlock = document.querySelector("[data-project-description]");
  const topCardToggles = Array.from(document.querySelectorAll("[data-top-card-toggle]"));
  const topCardPanels = Array.from(document.querySelectorAll("[data-top-card-panel]"));
  const servicesCatalog = document.querySelector("[data-services-catalog]");
  const panelById = new Map(topCardPanels.map((panel) => [panel.id, panel]));

  if (descriptionBlock) {
    if (prefersReducedMotion) {
      descriptionBlock.classList.add("home-services--visible");
    } else if ("IntersectionObserver" in window) {
      const descriptionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("home-services--visible");
              descriptionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );

      descriptionObserver.observe(descriptionBlock);
    } else {
      descriptionBlock.classList.add("home-services--visible");
    }
  }

  let syncTopPanelsHeights = () => {};

  if (topCardToggles.length && topCardPanels.length) {
    const getPanelForToggle = (toggle) => panelById.get(toggle.getAttribute("aria-controls"));

    const applyCatalogFadeState = () => {
      if (!servicesCatalog) return;
      servicesCatalog.classList.toggle("home-services-catalog--open", servicesCatalog.classList.contains("is-open"));
    };

    const animateOpen = (panel) => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    };

    const animateClose = (panel) => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => {
        panel.style.maxHeight = "0px";
      });
    };

    const closeTopCard = (toggle, panel) => {
      if (!toggle || !panel) return;
      const wasOpen = panel.classList.contains("is-open");
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (wasOpen) {
        animateClose(panel);
      } else {
        panel.style.maxHeight = "0px";
      }
    };

    const openTopCard = (toggle, panel) => {
      if (!toggle || !panel) return;
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      animateOpen(panel);
    };

    syncTopPanelsHeights = () => {
      topCardPanels.forEach((panel) => {
        if (panel.classList.contains("is-open")) {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
      applyCatalogFadeState();
    };

    topCardToggles.forEach((toggle) => {
      const panel = getPanelForToggle(toggle);
      if (!panel) return;
      panel.classList.remove("is-open");
      panel.style.maxHeight = "0px";
      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("click", () => {
        const isOpen = panel.classList.contains("is-open");
        topCardToggles.forEach((otherToggle) => {
          if (otherToggle === toggle) return;
          closeTopCard(otherToggle, getPanelForToggle(otherToggle));
        });

        if (isOpen) {
          closeTopCard(toggle, panel);
        } else {
          openTopCard(toggle, panel);
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(syncTopPanelsHeights);
        });
      });
    });

    topCardPanels.forEach((panel) => {
      panel.addEventListener("transitionend", syncTopPanelsHeights);
    });
    window.addEventListener("resize", syncTopPanelsHeights);
  }

  if (servicesCatalog) {
    const accordionItems = Array.from(servicesCatalog.querySelectorAll(".home-services-accordion"));
    const designSubItems = Array.from(servicesCatalog.querySelectorAll("[data-design-sub-item]"));

    const animateOpen = (el) => {
      el.style.maxHeight = `${el.scrollHeight}px`;
    };

    const animateClose = (el) => {
      el.style.maxHeight = `${el.scrollHeight}px`;
      requestAnimationFrame(() => {
        el.style.maxHeight = "0px";
      });
    };

    const syncHeights = () => {
      designSubItems.forEach((item) => {
        const panel = item.querySelector("[data-design-sub-panel]");
        if (!panel) return;
        if (item.classList.contains("is-open")) {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });

      accordionItems.forEach((item) => {
        const panel = item.querySelector("[data-accordion-panel]");
        if (!panel) return;
        if (item.classList.contains("is-open")) {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });

      if (servicesCatalog.classList.contains("is-open")) {
        servicesCatalog.style.maxHeight = `${servicesCatalog.scrollHeight}px`;
      }
      syncTopPanelsHeights();
    };

    const queueSync = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(syncHeights);
      });
    };

    const closeAccordion = (item) => {
      const wasOpen = item.classList.contains("is-open");
      item.classList.remove("is-open");
      const trigger = item.querySelector("[data-accordion-trigger]");
      trigger?.setAttribute("aria-expanded", "false");
      const panel = item.querySelector("[data-accordion-panel]");
      if (!panel) return;
      if (wasOpen) {
        animateClose(panel);
      } else {
        panel.style.maxHeight = "0px";
      }
    };

    const openAccordion = (item) => {
      item.classList.add("is-open");
      const trigger = item.querySelector("[data-accordion-trigger]");
      trigger?.setAttribute("aria-expanded", "true");
      const panel = item.querySelector("[data-accordion-panel]");
      if (panel) animateOpen(panel);
    };

    const closeDesignSub = (item) => {
      const wasOpen = item.classList.contains("is-open");
      const trigger = item.querySelector("[data-design-sub-trigger]");
      const panel = item.querySelector("[data-design-sub-panel]");
      item.classList.remove("is-open");
      trigger?.setAttribute("aria-expanded", "false");
      if (!panel) return;
      if (wasOpen) {
        animateClose(panel);
      } else {
        panel.style.maxHeight = "0px";
      }
    };

    const openDesignSub = (item) => {
      const trigger = item.querySelector("[data-design-sub-trigger]");
      const panel = item.querySelector("[data-design-sub-panel]");
      item.classList.add("is-open");
      trigger?.setAttribute("aria-expanded", "true");
      if (!panel) return;
      animateOpen(panel);
    };

    servicesCatalog.style.maxHeight = "0px";
    accordionItems.forEach((item) => {
      const panel = item.querySelector("[data-accordion-panel]");
      if (panel) panel.style.maxHeight = "0px";
    });
    designSubItems.forEach((item) => {
      const trigger = item.querySelector("[data-design-sub-trigger]");
      const panel = item.querySelector("[data-design-sub-panel]");
      item.classList.remove("is-open");
      trigger?.setAttribute("aria-expanded", "false");
      if (panel) panel.style.maxHeight = "0px";
    });

    accordionItems.forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isCurrentOpen = item.classList.contains("is-open");
        accordionItems.forEach((otherItem) => closeAccordion(otherItem));

        if (!isCurrentOpen) {
          openAccordion(item);
        }

        queueSync();
      });

      const panel = item.querySelector("[data-accordion-panel]");
      panel?.addEventListener("transitionend", queueSync);
    });

    designSubItems.forEach((item) => {
      const trigger = item.querySelector("[data-design-sub-trigger]");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isCurrentOpen = item.classList.contains("is-open");
        designSubItems.forEach((otherItem) => {
          if (otherItem !== item) {
            closeDesignSub(otherItem);
          }
        });

        if (isCurrentOpen) {
          closeDesignSub(item);
        } else {
          openDesignSub(item);
        }

        queueSync();
      });

      const panel = item.querySelector("[data-design-sub-panel]");
      panel?.addEventListener("transitionend", queueSync);
    });

    servicesCatalog.addEventListener("transitionend", queueSync);
    window.addEventListener("resize", queueSync);
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
