// Renders the same two-layer pinwheel used in the Twirlio app into any
// element with class "fanhost" (data-color, data-size, data-dur, data-rev).
(function () {
  const CREAM = "#F7EFE0";
  const hx = h => h.replace("#", "").match(/.{2}/g).map(x => parseInt(x, 16));
  const mix = (a, b, t) => "#" + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  const lighten = h => mix(h, CREAM, 0.42);

  const OUT = "M50,50 C49,33 55,18 52,8 C70,13 76,33 62,46 C57,50 50,50 50,50 Z";
  const INN = "M50,49 C50,36 54,25 52,16 C63,20 68,34 58,44 C55,48 50,49 50,49 Z";

  function fanSVG(color, size, dur, rev) {
    const light = lighten(color);
    let blades = "";
    for (let i = 0; i < 6; i++) {
      blades += `<g transform="rotate(${i * 60} 50 50)"><path d="${OUT}" fill="${color}"/><path d="${INN}" fill="${light}"/></g>`;
    }
    const hub = `<circle cx="50" cy="50" r="10" fill="${CREAM}"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke="#8A5A3C" stroke-width="2.1"/>
      <circle cx="50" cy="50" r="3.2" fill="#8A5A3C"/>`;
    return `<svg class="fan${rev ? " rev" : ""}" width="${size}" height="${size}" viewBox="0 0 100 100"
      style="--dur:${dur}s;filter:drop-shadow(0 6px 6px rgba(90,58,28,.22))">
      <g class="spin">${blades}</g>${hub}</svg>`;
  }

  document.querySelectorAll(".fanhost").forEach(el => {
    const color = el.dataset.color || "#3D7CC4";
    const size = +(el.dataset.size || 200);
    const dur = +(el.dataset.dur || 6);
    const rev = el.dataset.rev != null;
    el.innerHTML = fanSVG(color, size, dur, rev);
  });

  // theme toggle
  const btn = document.getElementById("themeBtn");
  if (btn) {
    const root = document.documentElement;
    const cur = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const sync = () => { btn.textContent = cur() === "dark" ? "☀︎" : "☾"; };
    btn.onclick = () => { root.dataset.theme = cur() === "dark" ? "light" : "dark"; sync(); };
    sync();
  }
})();
