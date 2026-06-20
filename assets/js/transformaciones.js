const canvas = qs("#graphCanvas");
const ctx = canvas.getContext("2d");
const bounds = { xMin: -8, xMax: 10, yMin: -8, yMax: 12 };

const transforms = [
  {
    id: "exp-up",
    name: "e^x + 1",
    formula: "\\[f(x)=e^x+1\\]",
    baseLabel: "e^x",
    transformedLabel: "e^x+1",
    baseFn: x => Math.exp(x),
    baseDomain: () => true,
    fn: x => Math.exp(x) + 1,
    domain: () => true,
    asymptote: { type: "horizontal", value: 1, text: "y = 1" },
    domainText: "ℝ",
    rangeText: "(1, ∞)",
    steps: ["Traslación vertical una unidad hacia arriba.", "La asíntota horizontal pasa de y=0 a y=1.", "La función conserva crecimiento."]
  },
  {
    id: "exp-reflect-shift",
    name: "-e^(x-2) - 2",
    formula: "\\[f(x)=-e^{x-2}-2\\]",
    baseLabel: "e^x",
    transformedLabel: "-e^(x-2)-2",
    baseFn: x => Math.exp(x),
    baseDomain: () => true,
    fn: x => -Math.exp(x - 2) - 2,
    domain: () => true,
    asymptote: { type: "horizontal", value: -2, text: "y = -2" },
    domainText: "ℝ",
    rangeText: "(-∞, -2)",
    steps: ["Traslación horizontal 2 unidades a la derecha.", "Reflexión respecto al eje x.", "Traslación vertical 2 unidades hacia abajo.", "La función transformada es decreciente."]
  },
  {
    id: "exp-y-reflect",
    name: "3e^(-(x-1)) - 4",
    formula: "\\[f(x)=3e^{-(x-1)}-4\\]",
    baseLabel: "e^x",
    transformedLabel: "3e^{-(x-1)}-4",
    baseFn: x => Math.exp(x),
    baseDomain: () => true,
    fn: x => 3 * Math.exp(-(x - 1)) - 4,
    domain: () => true,
    asymptote: { type: "horizontal", value: -4, text: "y = -4" },
    domainText: "ℝ",
    rangeText: "(-4, ∞)",
    steps: ["Reflexión respecto al eje y.", "Traslación horizontal 1 unidad a la derecha.", "Dilatación vertical por factor 3.", "Traslación vertical 4 unidades hacia abajo."]
  },
  {
    id: "log-right-up",
    name: "ln(x-3) + 1",
    formula: "\\[f(x)=\\ln(x-3)+1\\]",
    baseLabel: "ln(x)",
    transformedLabel: "ln(x-3)+1",
    baseFn: x => Math.log(x),
    baseDomain: x => x > 0,
    fn: x => Math.log(x - 3) + 1,
    domain: x => x > 3,
    asymptote: { type: "vertical", value: 3, text: "x = 3" },
    domainText: "(3, ∞)",
    rangeText: "ℝ",
    steps: ["Traslación horizontal 3 unidades a la derecha.", "Traslación vertical 1 unidad hacia arriba.", "La asíntota vertical pasa de x=0 a x=3.", "La función conserva crecimiento."]
  },
  {
    id: "log-reflection",
    name: "-log₂(-(x-2))",
    formula: "\\[f(x)=-\\log_2(-(x-2))\\]",
    baseLabel: "log₂(x)",
    transformedLabel: "-log₂(-(x-2))",
    baseFn: x => baseLog(x, 2),
    baseDomain: x => x > 0,
    fn: x => -baseLog(-(x - 2), 2),
    domain: x => x < 2,
    asymptote: { type: "vertical", value: 2, text: "x = 2" },
    domainText: "(-∞, 2)",
    rangeText: "ℝ",
    steps: ["Reflexión respecto al eje y.", "Traslación horizontal 2 unidades a la derecha.", "Reflexión respecto al eje x.", "La asíntota vertical queda en x=2."]
  }
];

function initTransformOptions() {
  const select = qs("#transformSelect");
  transforms.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    select.appendChild(option);
  });
}

function selectedTransform() {
  return transforms.find(item => item.id === qs("#transformSelect").value) || transforms[0];
}

function drawTransform() {
  const item = selectedTransform();
  drawBaseGrid(ctx, canvas, bounds, "Transformaciones");

  if (item.asymptote.type === "horizontal") {
    drawDashedLine(ctx, canvas, bounds, "horizontal", item.asymptote.value, "#f97316");
  } else {
    drawDashedLine(ctx, canvas, bounds, "vertical", item.asymptote.value, "#f97316");
  }

  drawFunction(ctx, canvas, bounds, item.baseFn, item.baseDomain, "#94a3b8", 2);
  drawFunction(ctx, canvas, bounds, item.fn, item.domain, "#2563eb", 3);

  ctx.save();
  ctx.font = "13px Segoe UI";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`Base: ${item.baseLabel}`, 22, 58);
  ctx.fillStyle = "#2563eb";
  ctx.fillText(`Transformada: ${item.transformedLabel}`, 22, 78);
  ctx.fillStyle = "#f97316";
  ctx.fillText(`Asíntota: ${item.asymptote.text}`, 22, 98);
  ctx.restore();

  setMath(qs("#formulaBox"), item.formula);
  qs("#stepsList").innerHTML = item.steps.map(step => `<li>${step}</li>`).join("");
  qs("#domainStat").textContent = item.domainText;
  qs("#rangeStat").textContent = item.rangeText;
  qs("#asymptoteStat").textContent = item.asymptote.text;
}

initTransformOptions();
qs("#drawBtn").addEventListener("click", drawTransform);
qs("#transformSelect").addEventListener("change", drawTransform);
qs("#downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "transformacion_funcion.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

drawTransform();
