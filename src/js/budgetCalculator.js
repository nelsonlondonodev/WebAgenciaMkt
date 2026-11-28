// src/js/budgetCalculator.js
// Interfaz de presupuesto.html. Las reglas de precio están en budgetRules.js.
import {
  calculateBudget,
  formatAmount,
  leadMessage,
  leadService,
  visibleSteps,
  whatsappUrl,
} from './budgetRules.js';

function renderTotal(box, amount, monthly) {
  box.hidden = amount === 0;
  box.querySelector('[data-total-value]').textContent = formatAmount(amount, monthly);
}

function renderResult(result, budget) {
  const template = result.querySelector('[data-line-template]');
  const items = [
    ...budget.lines.map((item) => ({
      label: item.label,
      amount: formatAmount(item.amount, item.monthly),
      note: item.note,
    })),
    ...budget.custom.map((label) => ({ label, amount: 'A presupuestar', note: '' })),
  ];

  result.querySelector('[data-lines]').replaceChildren(
    ...items.map(({ label, amount, note }) => {
      const node = template.content.cloneNode(true);
      node.querySelector('[data-line-label]').textContent = label;
      node.querySelector('[data-line-amount]').textContent = amount;
      node.querySelector('[data-line-note]').textContent = note;
      return node;
    })
  );
  renderTotal(result.querySelector('[data-total-once]'), budget.once, false);
  renderTotal(result.querySelector('[data-total-monthly]'), budget.monthly, true);
  result.querySelector('[data-empty]').hidden = items.length > 0;
}

/** El contacto viaja con las respuestas: en los campos ocultos y en el enlace de WhatsApp. */
function fillLead(result, answers, budget) {
  result.querySelector('[name="service"]').value = leadService(answers);
  result.querySelector('[name="message"]').value = leadMessage(budget);
  result.querySelector('[data-budget-whatsapp]').href = whatsappUrl(budget);
}

function attachCalculator(root) {
  const steps = [...root.querySelectorAll('[data-step]')];
  const result = root.querySelector('[data-result]');
  const progress = root.querySelector('[data-progress]');
  const back = root.querySelector('[data-budget-back]');
  const restart = root.querySelector('[data-budget-restart]');
  let answers = {};
  let index = 0;

  const show = () => {
    const order = visibleSteps(answers);
    const isDone = index >= order.length;

    steps.forEach((step) => {
      step.hidden = isDone || step.dataset.step !== order[index];
    });
    result.hidden = !isDone;
    progress.hidden = isDone;
    progress.textContent = isDone ? '' : `Pregunta ${index + 1} de ${order.length}`;
    back.hidden = index === 0;
    restart.hidden = !isDone;
    if (isDone) {
      const budget = calculateBudget(answers);
      renderResult(result, budget);
      fillLead(result, answers, budget);
    }

    const title = isDone
      ? result.querySelector('[data-result-title]')
      : root.querySelector(`[data-step="${order[index]}"] h2`);
    title.focus();
  };

  root.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.answer;
      answers[name] = button.value;
      root.querySelectorAll(`[data-answer="${name}"]`).forEach((option) => {
        option.setAttribute('aria-pressed', String(option === button));
      });
      index += 1;
      show();
    });
  });

  back.addEventListener('click', () => {
    index -= 1;
    show();
  });

  restart.addEventListener('click', () => {
    answers = {};
    index = 0;
    root.querySelectorAll('[data-answer]').forEach((option) => option.setAttribute('aria-pressed', 'false'));
    show();
  });
}

export function initBudgetCalculator() {
  const root = document.querySelector('[data-budget]');
  if (root) attachCalculator(root);
}
