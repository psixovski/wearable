document.addEventListener("DOMContentLoaded", () => {
  const scrollBox = document.getElementById("descScroll");
  if (!scrollBox) return;

  const updateFade = () => {
    const top = scrollBox.scrollTop;
    const max = scrollBox.scrollHeight - scrollBox.clientHeight;

    scrollBox.classList.toggle("fade-top", top > 5);
    scrollBox.classList.toggle("fade-bottom", top < max - 5);
  };

  scrollBox.addEventListener("scroll", updateFade, { passive: true });
  window.addEventListener("resize", updateFade);

  updateFade();
});
