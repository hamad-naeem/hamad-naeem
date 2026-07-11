import { writeFileSync } from "node:fs";

const W = 880;
const H = 120;
const T = 9;
const ROW_Y = 60;
const START = -42;
const END = 990;
const RUN_END = 92.5;
const PACMAN_FRONT = 17;
const N = 22;
const x0 = 70;
const x1 = 810;

const dots = Array.from({ length: N }, (_, i) => x0 + (i * (x1 - x0)) / (N - 1));
const travelPct = (x) => (RUN_END * ((x - START) / (END - START)));

let dotCss = "";
let dotEls = "";
dots.forEach((cx, i) => {
  const big = i % 6 === 0;
  const r = big ? 8 : 4.5;
  const eatStart = travelPct(cx - r - PACMAN_FRONT);
  const eatEnd = Math.min(eatStart + 0.8, RUN_END - 1);
  const loadStart = 93.35 + (i * 4.6) / (N - 1);
  const loadPop = loadStart + 0.28;
  const loadEnd = loadStart + 0.62;
  dotCss += `@keyframes eat${i}{0%,${eatStart.toFixed(2)}%{opacity:1;transform:scale(1)}${eatEnd.toFixed(2)}%,${loadStart.toFixed(2)}%{opacity:0;transform:scale(.2)}${loadPop.toFixed(2)}%{opacity:.85;transform:scale(1.25)}${loadEnd.toFixed(2)}%,100%{opacity:1;transform:scale(1)}}\n.d${i}{animation:eat${i} ${T}s ease-in-out infinite}\n`;
  dotEls += `  <circle class="dot d${i}" cx="${cx.toFixed(2)}" cy="${ROW_Y}" r="${r}" fill="${big ? "#e0855c" : "#c15f3c"}"/>\n`;
});

const pacman = (extraClass = "") => `
  <g class="${extraClass}">
    <g transform="translate(0 ${ROW_Y})">
      <path class="jawT" d="M -17 0 A 17 17 0 0 1 17 0 L 0 0 Z" fill="#e0855c"/>
      <path class="jawB" d="M -17 0 A 17 17 0 0 0 17 0 L 0 0 Z" fill="#e0855c"/>
      <circle cx="-4" cy="-9" r="2.4" fill="#151110"/>
    </g>
  </g>`;

const ghost = (extraClass = "") => `
  <g class="${extraClass}" transform="translate(-72 0)">
    <g class="bob">
      <g transform="translate(0 ${ROW_Y})">
        <path d="M -13 4 L -13 -4 A 13 13 0 0 1 13 -4 L 13 4 L 8.5 9 L 4.5 4 L 0 9 L -4.5 4 L -8.5 9 Z" fill="#c15f3c" opacity=".85"/>
        <circle cx="-5" cy="-4" r="3.4" fill="#f4f3ee"/>
        <circle cx="5" cy="-4" r="3.4" fill="#f4f3ee"/>
        <circle cx="-3.8" cy="-4" r="1.7" fill="#151110"/>
        <circle cx="6.2" cy="-4" r="1.7" fill="#151110"/>
      </g>
    </g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="Pac-Man smoothly looping through a terracotta dot trail">
<style>
.runner{animation:run ${T}s linear infinite}
@keyframes run{0%{transform:translateX(${START}px)}${RUN_END}%,100%{transform:translateX(${END}px)}}
.dot{transform-box:fill-box;transform-origin:center}
.jawT{animation:chompT .28s linear infinite alternate;transform-origin:0 0}
.jawB{animation:chompB .28s linear infinite alternate;transform-origin:0 0}
@keyframes chompT{from{transform:rotate(0deg)}to{transform:rotate(-28deg)}}
@keyframes chompB{from{transform:rotate(0deg)}to{transform:rotate(28deg)}}
.bob{animation:bob 1s ease-in-out infinite alternate}
@keyframes bob{from{transform:translateY(-2px)}to{transform:translateY(2px)}}
${dotCss}</style>

<rect width="${W}" height="${H}" rx="18" fill="#151110"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="17.5" stroke="#322921"/>

<!-- dots -->
${dotEls}

<!-- pacman exits fully off the right edge; reset happens while off-canvas -->
<g class="runner">
${pacman()}
</g>

<!-- ghost also clears the right edge before the loop resets -->
<g class="runner">
${ghost()}
</g>
</svg>
`;

writeFileSync(new URL("../assets/pacman.svg", import.meta.url), svg);
console.log(`assets/pacman.svg written (${svg.length} bytes)`);
