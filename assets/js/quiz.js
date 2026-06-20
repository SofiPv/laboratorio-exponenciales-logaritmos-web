const questions = [
  {
    prompt: "¿Cuál es el dominio de una función exponencial f(x)=a^x con a>0 y a≠1?",
    options: ["ℝ", "(0,∞)", "ℝ⁺ solamente", "Depende de la base"],
    correct: "ℝ",
    explanation: "La función exponencial básica está definida para todo número real x."
  },
  {
    prompt: "¿Cuál es el rango de f(x)=2^x?",
    options: ["ℝ", "(0,∞)", "(-∞,0)", "[0,∞)"],
    correct: "(0,∞)",
    explanation: "Una exponencial positiva nunca toma valores negativos ni cero."
  },
  {
    prompt: "¿Cuál es la asíntota horizontal de f(x)=e^x+1?",
    options: ["y=0", "y=1", "x=1", "x=0"],
    correct: "y=1",
    explanation: "La traslación vertical sube la asíntota de y=0 a y=1."
  },
  {
    prompt: "¿Cuál es el dominio de f(x)=ln(x-3)?",
    options: ["x>0", "x<3", "x>3", "ℝ"],
    correct: "x>3",
    explanation: "El argumento del logaritmo debe ser positivo: x-3>0."
  },
  {
    prompt: "¿Cuál es la derivada de ln(u)?",
    options: ["u/u'", "u'/u", "ln(u')", "1/u'"],
    correct: "u'/u",
    explanation: "La derivada de ln(u) se resuelve con regla de la cadena."
  },
  {
    prompt: "En derivación logarítmica, ¿qué se hace primero?",
    options: ["Se despeja x", "Se toma ln a ambos lados", "Se grafica la función", "Se integra"],
    correct: "Se toma ln a ambos lados",
    explanation: "El método inicia aplicando logaritmos naturales a ambos lados de la ecuación."
  },
  {
    prompt: "¿Cuál es la derivada de log_a(x)?",
    options: ["1/x", "1/(x ln(a))", "ln(a)/x", "a^x"],
    correct: "1/(x ln(a))",
    explanation: "Se obtiene usando cambio de base con log_a(x)=ln(x)/ln(a)."
  }
];

function renderQuiz() {
  const quizArea = qs("#quizArea");
  quizArea.innerHTML = "";

  questions.forEach((question, index) => {
    const div = document.createElement("article");
    div.className = "quiz-question";
    div.innerHTML = `
      <h3>Pregunta ${index + 1}</h3>
      <p>${question.prompt}</p>
      <div class="quiz-options">
        ${question.options.map(option => `
          <label>
            <input type="radio" name="q-${index}" value="${option.replaceAll('"', "&quot;")}">
            <span>${option}</span>
          </label>
        `).join("")}
      </div>
    `;
    quizArea.appendChild(div);
  });

  qs("#resultBox").className = "feedback";
  qs("#resultBox").textContent = "Responde todas las preguntas y presiona Calificar.";
}

function gradeQuiz() {
  let score = 0;
  const feedback = [];

  questions.forEach((question, index) => {
    const selected = document.querySelector(`input[name="q-${index}"]:checked`);
    const answer = selected ? selected.value : "";
    const ok = answer === question.correct;

    if (ok) score++;

    feedback.push(`${ok ? "✅" : "❌"} Pregunta ${index + 1}: ${ok ? "correcta" : `respuesta correcta: ${question.correct}`}. ${question.explanation}`);
  });

  const percent = Math.round((score / questions.length) * 100);
  qs("#resultBox").className = percent >= 70 ? "feedback success" : "feedback warning";
  qs("#resultBox").innerHTML = `Puntaje: <strong>${score}/${questions.length}</strong> (${percent}%).<br><br>${feedback.join("<br>")}`;
}

qs("#gradeBtn").addEventListener("click", gradeQuiz);
qs("#resetBtn").addEventListener("click", renderQuiz);
renderQuiz();
