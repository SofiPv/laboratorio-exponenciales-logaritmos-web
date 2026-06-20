function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function format(value, digits = 4) {
  if (!Number.isFinite(value)) return "No definido";
  const rounded = Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  if (Object.is(rounded, -0)) return "0";
  return String(rounded);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toScreenX(x, bounds, width, margin) {
  return margin + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * (width - margin * 2);
}

function toScreenY(y, bounds, height, margin) {
  return height - margin - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * (height - margin * 2);
}

function chooseStep(min, max) {
  const range = max - min;
  if (range <= 6) return 0.5;
  if (range <= 14) return 1;
  if (range <= 26) return 2;
  return 5;
}

function drawBaseGrid(ctx, canvas, bounds, title) {
  const width = canvas.width;
  const height = canvas.height;
  const margin = 58;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "#e7eef8";
  ctx.lineWidth = 1;

  const xStep = chooseStep(bounds.xMin, bounds.xMax);
  const yStep = chooseStep(bounds.yMin, bounds.yMax);

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const sx = toScreenX(x, bounds, width, margin);
    ctx.beginPath();
    ctx.moveTo(sx, margin);
    ctx.lineTo(sx, height - margin);
    ctx.stroke();
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const sy = toScreenY(y, bounds, height, margin);
    ctx.beginPath();
    ctx.moveTo(margin, sy);
    ctx.lineTo(width - margin, sy);
    ctx.stroke();
  }

  ctx.strokeStyle = "#152033";
  ctx.lineWidth = 2;

  const xAxis = toScreenY(0, bounds, height, margin);
  const yAxis = toScreenX(0, bounds, width, margin);

  ctx.beginPath();
  ctx.moveTo(margin, xAxis);
  ctx.lineTo(width - margin, xAxis);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(yAxis, margin);
  ctx.lineTo(yAxis, height - margin);
  ctx.stroke();

  ctx.fillStyle = "#152033";
  ctx.font = "13px Segoe UI";

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const sx = toScreenX(x, bounds, width, margin);
    ctx.beginPath();
    ctx.moveTo(sx, xAxis - 4);
    ctx.lineTo(sx, xAxis + 4);
    ctx.stroke();

    if (Math.abs(x) > 0.001) ctx.fillText(format(x, 2), sx - 10, xAxis + 20);
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const sy = toScreenY(y, bounds, height, margin);
    ctx.beginPath();
    ctx.moveTo(yAxis - 4, sy);
    ctx.lineTo(yAxis + 4, sy);
    ctx.stroke();

    if (Math.abs(y) > 0.001) ctx.fillText(format(y, 2), yAxis + 8, sy + 4);
  }

  ctx.font = "bold 18px Segoe UI";
  ctx.fillText(title, 22, 34);
  ctx.restore();
}

function drawFunction(ctx, canvas, bounds, fn, domainFn, color = "#2563eb", widthLine = 3) {
  const width = canvas.width;
  const height = canvas.height;
  const margin = 58;
  const samples = 1800;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = widthLine;
  ctx.beginPath();

  let started = false;
  let previousY = null;

  for (let i = 0; i <= samples; i++) {
    const x = bounds.xMin + ((bounds.xMax - bounds.xMin) * i) / samples;

    if (!domainFn(x)) {
      started = false;
      previousY = null;
      continue;
    }

    const y = fn(x);

    if (!Number.isFinite(y) || y < bounds.yMin - 20 || y > bounds.yMax + 20) {
      started = false;
      previousY = null;
      continue;
    }

    if (previousY !== null && Math.abs(y - previousY) > (bounds.yMax - bounds.yMin) * 0.55) {
      started = false;
    }

    const sx = toScreenX(x, bounds, width, margin);
    const sy = toScreenY(y, bounds, height, margin);

    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }

    previousY = y;
  }

  ctx.stroke();
  ctx.restore();
}

function drawDashedLine(ctx, canvas, bounds, mode, value, color = "#f97316") {
  const width = canvas.width;
  const height = canvas.height;
  const margin = 58;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  ctx.beginPath();

  if (mode === "horizontal") {
    const y = toScreenY(value, bounds, height, margin);
    ctx.moveTo(margin, y);
    ctx.lineTo(width - margin, y);
  } else {
    const x = toScreenX(value, bounds, width, margin);
    ctx.moveTo(x, margin);
    ctx.lineTo(x, height - margin);
  }

  ctx.stroke();
  ctx.restore();
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function baseLog(x, base) {
  return Math.log(x) / Math.log(base);
}

function setMath(element, latex) {
  element.innerHTML = latex;
  if (window.MathJax) {
    MathJax.typesetPromise([element]);
  }
}
