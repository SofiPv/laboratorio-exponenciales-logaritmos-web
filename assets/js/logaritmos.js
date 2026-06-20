const canvas = qs("#graphCanvas");
const ctx = canvas.getContext("2d");
const bounds = { xMin: -6, xMax: 10, yMin: -8, yMax: 8 };

function readLogParams() {
  let base = Math.abs(parseNumber(qs("#baseInput").value, 2));
  if (base === 1 || base <= 0) base = 2;

  const A = parseNumber(qs("#aInput").value, 1);
  let b = parseNumber(qs("#bInput").value, 1);
  if (b === 0) b = 1;

  const h = parseNumber(qs("#hInput").value, 0);
  const k = parseNumber(qs("#kInput").value, 0);

  qs("#baseInput").value = format(base);
  qs("#bInput").value = format(b);

  return { base, A, b, h, k };
}

function logDomain(p, x) {
  return p.b * (x - p.h) > 0;
}

function logFunction(p, x) {
  return p.A * baseLog(p.b * (x - p.h), p.base) + p.k;
}

function formulaLatex(p) {
  const baseText = Math.abs(p.base - Math.E) < 0.001 ? "e" : format(p.base);
  const logText = Math.abs(p.base - Math.E) < 0.001 ? "\\ln" : `\\log_{${baseText}}`;
  return `\\[f(x)=${format(p.A)}${logText}\\left(${format(p.b)}(x-${format(p.h)})\\right)+${format(p.k)}\\]`;
}

function drawLog() {
  const p = readLogParams();
  drawBaseGrid(ctx, canvas, bounds, "Función logarítmica");
  drawDashedLine(ctx, canvas, bounds, "vertical", p.h, "#f97316");
  drawFunction(ctx, canvas, bounds, x => logFunction(p, x), x => logDomain(p, x), "#2563eb", 3);
  drawLegend(p);
  renderLogStats(p);
  renderTable(p);
  setMath(qs("#formulaBox"), formulaLatex(p));
}

function drawLegend(p) {
  ctx.save();
  ctx.font = "13px Segoe UI";
  ctx.fillStyle = "#2563eb";
  ctx.fillText("f(x)", 22, 58);
  ctx.fillStyle = "#f97316";
  ctx.fillText(`asíntota x=${format(p.h)}`, 22, 78);
  ctx.restore();
}

function renderLogStats(p) {
  const domain = p.b > 0 ? `(${format(p.h)}, ∞)` : `(-∞, ${format(p.h)})`;
  const growthPositive = (p.base > 1 && p.A * p.b > 0) || (p.base < 1 && p.A * p.b < 0);

  qs("#domainStat").textContent = domain;
  qs("#asymptoteStat").textContent = `x = ${format(p.h)}`;
  qs("#growthStat").textContent = growthPositive ? "Creciente" : "Decreciente";

  const x0 = p.h + Math.pow(p.base, -p.k / p.A) / p.b;
  qs("#xInterceptStat").textContent = `(${format(x0)}, 0)`;

  if (logDomain(p, 0)) {
    qs("#yInterceptStat").textContent = `(0, ${format(logFunction(p, 0))})`;
  } else {
    qs("#yInterceptStat").textContent = "No hay";
  }
}

function renderTable(p) {
  const tbody = qs("#valuesTable");
  tbody.innerHTML = "";
  const samples = [-2, -1, 0, 0.5, 1, 2, 3, 5, 8];

  samples.forEach(x => {
    const value = logDomain(p, x) ? format(logFunction(p, x)) : "No definido";
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${format(x)}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  });
}

qs("#drawBtn").addEventListener("click", drawLog);
qs("#presetLnBtn").addEventListener("click", () => {
  qs("#baseInput").value = Math.E.toFixed(4);
  qs("#aInput").value = 1;
  qs("#bInput").value = 1;
  qs("#hInput").value = 0;
  qs("#kInput").value = 0;
  drawLog();
});
qs("#downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "funcion_logaritmica.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

drawLog();
