const canvas = qs("#graphCanvas");
const ctx = canvas.getContext("2d");
const bounds = { xMin: -6, xMax: 6, yMin: -8, yMax: 12 };

function readExpParams() {
  let base = Math.abs(parseNumber(qs("#baseInput").value, 2));
  if (base === 1) base = 2;
  if (base <= 0) base = 2;

  const A = parseNumber(qs("#aInput").value, 1);
  const b = parseNumber(qs("#bInput").value, 1);
  const h = parseNumber(qs("#hInput").value, 0);
  const k = parseNumber(qs("#kInput").value, 0);

  qs("#baseInput").value = format(base);
  return { base, A, b, h, k };
}

function expFunction(p, x) {
  return p.A * Math.pow(p.base, p.b * (x - p.h)) + p.k;
}

function formulaLatex(p) {
  const baseText = Math.abs(p.base - Math.E) < 0.001 ? "e" : format(p.base);
  return `\\[f(x)=${format(p.A)}\\cdot ${baseText}^{${format(p.b)}(x-${format(p.h)})}+${format(p.k)}\\]`;
}

function drawExp() {
  const p = readExpParams();
  drawBaseGrid(ctx, canvas, bounds, "Función exponencial");
  drawDashedLine(ctx, canvas, bounds, "horizontal", p.k, "#f97316");
  drawFunction(ctx, canvas, bounds, x => expFunction(p, x), () => true, "#2563eb", 3);
  drawLegend(p);
  renderExpStats(p);
  renderTable(p);
  setMath(qs("#formulaBox"), formulaLatex(p));
}

function drawLegend(p) {
  ctx.save();
  ctx.font = "13px Segoe UI";
  ctx.fillStyle = "#2563eb";
  ctx.fillText("f(x)", 22, 58);
  ctx.fillStyle = "#f97316";
  ctx.fillText(`asíntota y=${format(p.k)}`, 22, 78);
  ctx.restore();
}

function renderExpStats(p) {
  const range = p.A >= 0 ? `(${format(p.k)}, ∞)` : `(-∞, ${format(p.k)})`;
  const growthPositive = (p.base > 1 && p.A * p.b > 0) || (p.base < 1 && p.A * p.b < 0);

  qs("#rangeStat").textContent = range;
  qs("#asymptoteStat").textContent = `y = ${format(p.k)}`;
  qs("#growthStat").textContent = growthPositive ? "Creciente" : "Decreciente";
  qs("#yInterceptStat").textContent = `(0, ${format(expFunction(p, 0))})`;

  if ((-p.k / p.A) > 0) {
    const x0 = p.h + Math.log(-p.k / p.A) / (p.b * Math.log(p.base));
    qs("#xInterceptStat").textContent = `(${format(x0)}, 0)`;
  } else {
    qs("#xInterceptStat").textContent = "No hay";
  }
}

function renderTable(p) {
  const tbody = qs("#valuesTable");
  tbody.innerHTML = "";
  for (let x = -3; x <= 3; x++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${x}</td><td>${format(expFunction(p, x))}</td>`;
    tbody.appendChild(tr);
  }
}

qs("#drawBtn").addEventListener("click", drawExp);
qs("#presetNaturalBtn").addEventListener("click", () => {
  qs("#baseInput").value = Math.E.toFixed(4);
  qs("#aInput").value = 1;
  qs("#bInput").value = 1;
  qs("#hInput").value = 0;
  qs("#kInput").value = 0;
  drawExp();
});
qs("#downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "funcion_exponencial.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

drawExp();
