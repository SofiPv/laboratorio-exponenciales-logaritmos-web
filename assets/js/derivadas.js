const exercises = [
  {
    id: "lnx",
    title: "Derivar ln(x)",
    rule: "\\[\\frac{d}{dx}\\ln(x)=\\frac{1}{x}\\]",
    original: "\\[f(x)=\\ln(x)\\]",
    derivative: "\\[f'(x)=\\frac{1}{x}\\]",
    domain: x => x > 0,
    fp: x => 1 / x,
    steps: [
      ["Identificar función", "La función es un logaritmo natural directo.", "\\[f(x)=\\ln(x)\\]"],
      ["Aplicar regla", "La derivada de ln(x) es 1/x.", "\\[\\frac{d}{dx}\\ln(x)=\\frac{1}{x}\\]"],
      ["Resultado", "Se obtiene la derivada final.", "\\[f'(x)=\\frac{1}{x}\\]"]
    ]
  },
  {
    id: "logbase",
    title: "Derivar log_a(x)",
    rule: "\\[\\frac{d}{dx}\\log_a(x)=\\frac{1}{x\\ln(a)}\\]",
    original: "\\[f(x)=\\log_a(x)\\]",
    derivative: "\\[f'(x)=\\frac{1}{x\\ln(a)}\\]",
    domain: x => x > 0,
    fp: x => 1 / (x * Math.log(2)),
    steps: [
      ["Cambio de base", "Se expresa el logaritmo en términos de ln.", "\\[\\log_a(x)=\\frac{\\ln(x)}{\\ln(a)}\\]"],
      ["Constante", "ln(a) es constante respecto a x.", "\\[\\frac{d}{dx}\\frac{\\ln(x)}{\\ln(a)}=\\frac{1}{\\ln(a)}\\frac{d}{dx}\\ln(x)\\]"],
      ["Resultado", "Se deriva ln(x).", "\\[f'(x)=\\frac{1}{x\\ln(a)}\\]"]
    ]
  },
  {
    id: "lnchain",
    title: "Derivar ln(x²+1)",
    rule: "\\[\\frac{d}{dx}\\ln(u)=\\frac{u'}{u}\\]",
    original: "\\[f(x)=\\ln(x^2+1)\\]",
    derivative: "\\[f'(x)=\\frac{2x}{x^2+1}\\]",
    domain: () => true,
    fp: x => (2 * x) / (x * x + 1),
    steps: [
      ["Identificar u", "La función interna es x²+1.", "\\[u=x^2+1\\]"],
      ["Derivar u", "Se aplica regla de la potencia.", "\\[u'=2x\\]"],
      ["Aplicar ln(u)", "La derivada de ln(u) es u'/u.", "\\[f'(x)=\\frac{2x}{x^2+1}\\]"]
    ]
  },
  {
    id: "logsqrt",
    title: "Derivar ln(√(3-x²))",
    rule: "\\[\\frac{d}{dx}\\ln(u)=\\frac{u'}{u}\\]",
    original: "\\[f(x)=\\ln\\left(\\sqrt{3-x^2}\\right)\\]",
    derivative: "\\[f'(x)=\\frac{-x}{3-x^2}\\]",
    domain: x => 3 - x * x > 0,
    fp: x => -x / (3 - x * x),
    steps: [
      ["Identificar composición", "Hay un logaritmo natural con una raíz como función interna.", "\\[u=\\sqrt{3-x^2}\\]"],
      ["Derivar u", "Se deriva la raíz usando regla de la cadena.", "\\[u'=\\frac{-x}{\\sqrt{3-x^2}}\\]"],
      ["Aplicar u'/u", "Se divide u' entre u.", "\\[f'(x)=\\frac{\\frac{-x}{\\sqrt{3-x^2}}}{\\sqrt{3-x^2}}\\]"],
      ["Simplificar", "El producto de las raíces produce 3-x².", "\\[f'(x)=\\frac{-x}{3-x^2}\\]"]
    ]
  },
  {
    id: "logdiff",
    title: "Derivación logarítmica: y=xˣ",
    rule: "\\[\\ln(y)=\\ln(f(x))\\]",
    original: "\\[y=x^x\\]",
    derivative: "\\[y'=x^x(\\ln(x)+1)\\]",
    domain: x => x > 0,
    fp: x => Math.pow(x, x) * (Math.log(x) + 1),
    steps: [
      ["Tomar ln", "Se aplican logaritmos naturales a ambos lados.", "\\[\\ln(y)=\\ln(x^x)\\]"],
      ["Usar leyes logarítmicas", "El exponente baja multiplicando.", "\\[\\ln(y)=x\\ln(x)\\]"],
      ["Derivar implícitamente", "El lado izquierdo deriva como y'/y.", "\\[\\frac{y'}{y}=\\ln(x)+1\\]"],
      ["Despejar y'", "Se multiplica por y y se sustituye y=xˣ.", "\\[y'=x^x(\\ln(x)+1)\\]"]
    ]
  }
];

let active = exercises[0];
let activeStep = 0;

function init() {
  const select = qs("#exerciseSelect");
  exercises.forEach(exercise => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = exercise.title;
    select.appendChild(option);
  });

  qs("#solveBtn").addEventListener("click", () => setExercise(select.value));
  qs("#prevBtn").addEventListener("click", () => setStep(activeStep - 1));
  qs("#nextBtn").addEventListener("click", () => setStep(activeStep + 1));
  qs("#evalBtn").addEventListener("click", evaluate);
  qs("#copyBtn").addEventListener("click", copySteps);

  render();
}

function setExercise(id) {
  active = exercises.find(item => item.id === id) || exercises[0];
  activeStep = 0;
  render();
}

function render() {
  setMath(qs("#ruleBox"), active.rule);
  setMath(qs("#originalBox"), active.original);
  setMath(qs("#derivativeBox"), active.derivative);
  renderSteps();
  qs("#evalResult").className = "feedback";
  qs("#evalResult").textContent = "Ingresa un valor de x para evaluar la derivada.";
}

function renderSteps() {
  const index = qs("#stepIndex");
  index.innerHTML = "";

  active.steps.forEach((step, i) => {
    const button = document.createElement("button");
    button.className = "step-tab";
    button.type = "button";
    button.innerHTML = `${i + 1}. ${step[0]}<small>${active.title}</small>`;
    button.addEventListener("click", () => setStep(i));
    if (i === activeStep) button.classList.add("active");
    index.appendChild(button);
  });

  const step = active.steps[activeStep];
  qs("#stepDetail").innerHTML = `
    <h3>${activeStep + 1}. ${step[0]}</h3>
    <p>${step[1]}</p>
    <div class="formula-line">${step[2]}</div>
  `;

  if (window.MathJax) MathJax.typesetPromise([qs("#stepDetail")]);
}

function setStep(index) {
  activeStep = Math.max(0, Math.min(active.steps.length - 1, index));
  renderSteps();
}

function evaluate() {
  const x = Number(qs("#xValue").value);
  const box = qs("#evalResult");

  if (!active.domain(x)) {
    box.className = "feedback error";
    box.textContent = "La derivada no está definida en ese valor para este ejercicio.";
    return;
  }

  box.className = "feedback success";
  box.innerHTML = `Para x=${format(x)}, la derivada vale <strong>${format(active.fp(x))}</strong>.`;
}

async function copySteps() {
  const text = [
    active.title,
    "",
    active.steps.map((step, i) => `${i + 1}. ${step[0]}\n${step[1]}\n${step[2]}`).join("\n\n")
  ].join("\n");

  await navigator.clipboard.writeText(text);
  qs("#copyBtn").textContent = "Copiado";
  setTimeout(() => qs("#copyBtn").textContent = "Copiar pasos", 1200);
}

init();
