document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("commerceLightbox");
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector(".commerce-lightbox__image");
  const closeButton = lightbox.querySelector(".commerce-lightbox__close");
  const galleryItems = Array.from(document.querySelectorAll(".project-gallery .commerce-gallery-item"));

  if (!lightboxImage || !closeButton || !galleryItems.length) return;

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  const openLightbox = (img) => {
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || "Gallery image";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img) return;
      openLightbox(img);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeLightbox === "true") {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
