const state = {
  currentInput: '0',
  previousInput: '',
  operation: null,
  shouldResetInput: false,
  history: [],
  rates: {},
  ratesBase: 'USD',
  lastRatesUpdate: null,
  activeTab: 'standard',
  theme: 'dark'
};

const displayMain = document.getElementById('displayMain');
const displayExpression = document.getElementById('displayExpression');
const apiStatus = document.getElementById('apiStatus');
const apiStatusText = document.getElementById('apiStatusText');
const copyBtn = document.getElementById('copyBtn');
const themeToggle = document.getElementById('themeToggle');
const historyToggle = document.getElementById('historyToggle');
const historyDrawer = document.getElementById('historyDrawer');
const historyBackdrop = document.getElementById('historyBackdrop');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const toastEl = document.getElementById('toast');
const calculatorApp = document.querySelector('.calculator-app');

const tabBtns = document.querySelectorAll('.tab-btn');
const calcKeypad = document.getElementById('calcKeypad');
const converterPanel = document.getElementById('converterPanel');

const currencyAmount = document.getElementById('currencyAmount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const swapCurrenciesBtn = document.getElementById('swapCurrenciesBtn');
const converterResult = document.getElementById('converterResult');
const converterTimestamp = document.getElementById('converterTimestamp');
const converterRateCaption = document.getElementById('converterRateCaption');
const fetchRatesBtn = document.getElementById('fetchRatesBtn');
const cloudEvalBtn = document.getElementById('cloudEvalBtn');
const useCalcResultBtn = document.getElementById('useCalcResultBtn');

let toastTimeout;

function showToast(message) {
  clearTimeout(toastTimeout);
  toastEl.textContent = message;
  toastEl.classList.add('show');
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2200);
}

function updateDisplay() {
  displayMain.textContent = state.currentInput;
  displayMain.classList.remove('animate-pop');
  void displayMain.offsetWidth;
  displayMain.classList.add('animate-pop');

  if (state.operation && state.previousInput !== '') {
    const symbol = getOperatorSymbol(state.operation);
    displayExpression.textContent = `${state.previousInput} ${symbol}`;
  } else {
    displayExpression.textContent = '';
  }

  highlightActiveOperator();
}

function getOperatorSymbol(op) {
  switch (op) {
    case '+': return '+';
    case '-': return '−';
    case '*': return '×';
    case '/': return '÷';
    case '^': return '^';
    default: return op;
  }
}

function highlightActiveOperator() {
  const opKeys = document.querySelectorAll('.operator-key');
  opKeys.forEach(btn => {
    if (state.operation && btn.dataset.operator === state.operation && state.shouldResetInput) {
      btn.classList.add('active-op');
    } else {
      btn.classList.remove('active-op');
    }
  });
}

function handleNumber(num) {
  if (state.currentInput === 'Error') {
    state.currentInput = '0';
  }

  if (num === '.') {
    if (state.shouldResetInput) {
      state.currentInput = '0.';
      state.shouldResetInput = false;
      updateDisplay();
      return;
    }
    if (state.currentInput.includes('.')) return;
    state.currentInput += '.';
    updateDisplay();
    return;
  }

  if (state.currentInput === '0' || state.shouldResetInput) {
    state.currentInput = num;
    state.shouldResetInput = false;
  } else {
    if (state.currentInput.length >= 14) return;
    state.currentInput += num;
  }

  updateDisplay();
}

function handleOperator(op) {
  if (state.currentInput === 'Error') return;

  if (state.operation && !state.shouldResetInput) {
    executeCalculation();
  }

  state.previousInput = state.currentInput;
  state.operation = op;
  state.shouldResetInput = true;
  updateDisplay();
}

function executeCalculation() {
  if (!state.operation || state.previousInput === '' || state.shouldResetInput) return;

  const prev = parseFloat(state.previousInput);
  const current = parseFloat(state.currentInput);
  let result = 0;

  if (isNaN(prev) || isNaN(current)) return;

  switch (state.operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        state.currentInput = 'Error';
        state.previousInput = '';
        state.operation = null;
        state.shouldResetInput = true;
        updateDisplay();
        showToast('No es posible dividir por cero');
        return;
      }
      result = prev / current;
      break;
    case '^':
      result = Math.pow(prev, current);
      break;
    default:
      return;
  }

  const formattedResult = formatCalcResult(result);
  const expression = `${state.previousInput} ${getOperatorSymbol(state.operation)} ${state.currentInput}`;

  addHistoryEntry(expression, formattedResult);

  state.currentInput = formattedResult;
  state.previousInput = '';
  state.operation = null;
  state.shouldResetInput = true;
  updateDisplay();
}

function formatCalcResult(num) {
  if (!isFinite(num) || isNaN(num)) return 'Error';
  const rounded = Number(Math.round(Number(num + 'e+10')) + 'e-10');
  const str = rounded.toString();
  if (str.length > 14) {
    return rounded.toExponential(6);
  }
  return str;
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      state.currentInput = '0';
      state.previousInput = '';
      state.operation = null;
      state.shouldResetInput = false;
      updateDisplay();
      break;

    case 'backspace':
      if (state.currentInput === 'Error' || state.shouldResetInput) {
        state.currentInput = '0';
        state.shouldResetInput = false;
      } else if (state.currentInput.length > 1) {
        state.currentInput = state.currentInput.slice(0, -1);
      } else {
        state.currentInput = '0';
      }
      updateDisplay();
      break;

    case 'percent':
      if (state.currentInput === 'Error') return;
      const currentVal = parseFloat(state.currentInput);
      if (isNaN(currentVal)) return;
      state.currentInput = formatCalcResult(currentVal / 100);
      updateDisplay();
      break;

    case 'negate':
      if (state.currentInput === '0' || state.currentInput === 'Error') return;
      if (state.currentInput.startsWith('-')) {
        state.currentInput = state.currentInput.slice(1);
      } else {
        state.currentInput = '-' + state.currentInput;
      }
      updateDisplay();
      break;

    case 'equals':
      executeCalculation();
      break;
  }
}

function handleScientific(action) {
  if (state.currentInput === 'Error') return;
  const current = parseFloat(state.currentInput);
  let result = null;
  let label = '';

  switch (action) {
    case 'sin':
      result = Math.sin((current * Math.PI) / 180);
      label = `sin(${current}°)`;
      break;
    case 'cos':
      result = Math.cos((current * Math.PI) / 180);
      label = `cos(${current}°)`;
      break;
    case 'tan':
      if (Math.abs(current % 180) === 90) {
        result = NaN;
      } else {
        result = Math.tan((current * Math.PI) / 180);
      }
      label = `tan(${current}°)`;
      break;
    case 'pi':
      state.currentInput = Math.PI.toString().slice(0, 11);
      state.shouldResetInput = false;
      updateDisplay();
      return;
    case 'sqrt':
      if (current < 0) {
        state.currentInput = 'Error';
        updateDisplay();
        showToast('Raíz de número negativo no permitida');
        return;
      }
      result = Math.sqrt(current);
      label = `√(${current})`;
      break;
    case 'pow2':
      result = Math.pow(current, 2);
      label = `sqr(${current})`;
      break;
    case 'pow':
      handleOperator('^');
      return;
    case 'log':
      if (current <= 0) {
        state.currentInput = 'Error';
        updateDisplay();
        return;
      }
      result = Math.log10(current);
      label = `log(${current})`;
      break;
    case 'ln':
      if (current <= 0) {
        state.currentInput = 'Error';
        updateDisplay();
        return;
      }
      result = Math.log(current);
      label = `ln(${current})`;
      break;
    case 'reciprocal':
      if (current === 0) {
        state.currentInput = 'Error';
        updateDisplay();
        showToast('División por cero');
        return;
      }
      result = 1 / current;
      label = `1/(${current})`;
      break;
    case 'openParen':
    case 'closeParen':
      showToast('Usa el modo Cloud API para expresiones algebraicas con paréntesis');
      return;
  }

  if (result !== null) {
    const formatted = formatCalcResult(result);
    addHistoryEntry(label, formatted);
    state.currentInput = formatted;
    state.shouldResetInput = true;
    updateDisplay();
  }
}

function addHistoryEntry(expression, result) {
  const item = {
    expression,
    result,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  state.history.unshift(item);
  if (state.history.length > 25) {
    state.history.pop();
  }
  saveHistory();
  renderHistory();
}

function saveHistory() {
  try {
    localStorage.setItem('calc_history', JSON.stringify(state.history));
  } catch (e) {}
}

function loadHistory() {
  try {
    const stored = localStorage.getItem('calc_history');
    if (stored) {
      state.history = JSON.parse(stored);
      renderHistory();
    }
  } catch (e) {}
}

function renderHistory() {
  if (state.history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">Sin cálculos recientes</div>';
    return;
  }

  historyList.innerHTML = '';
  state.history.forEach(item => {
    const el = document.createElement('div');
    el.className = 'history-item';
    el.innerHTML = `
      <span class="history-item-exp">${escapeHtml(item.expression)}</span>
      <span class="history-item-val">${escapeHtml(item.result)}</span>
    `;
    el.addEventListener('click', () => {
      state.currentInput = item.result;
      state.shouldResetInput = true;
      updateDisplay();
      closeHistoryDrawer();
      showToast('Resultado cargado');
    });
    historyList.appendChild(el);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function openHistoryDrawer() {
  historyDrawer.classList.add('open');
  historyBackdrop.classList.add('open');
}

function closeHistoryDrawer() {
  historyDrawer.classList.remove('open');
  historyBackdrop.classList.remove('open');
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function setTheme(theme) {
  state.theme = theme;
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem('calc_theme', theme);
  } catch (e) {}
}

function loadTheme() {
  try {
    const storedTheme = localStorage.getItem('calc_theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  } catch (e) {}
}

function switchTab(targetTab) {
  state.activeTab = targetTab;

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === targetTab);
  });

  if (targetTab === 'standard') {
    calculatorApp.classList.remove('scientific-mode');
    calcKeypad.classList.add('active');
    converterPanel.classList.remove('active');
  } else if (targetTab === 'scientific') {
    calculatorApp.classList.add('scientific-mode');
    calcKeypad.classList.add('active');
    converterPanel.classList.remove('active');
  } else if (targetTab === 'converter') {
    calculatorApp.classList.remove('scientific-mode');
    calcKeypad.classList.remove('active');
    converterPanel.classList.add('active');

    if (!currencyAmount.value || currencyAmount.value === '0') {
      currencyAmount.value = state.currentInput !== '0' && state.currentInput !== 'Error' ? state.currentInput : '100';
    }
    convertCurrencies();
  }
}

async function fetchExchangeRates(base = 'USD', force = false) {
  apiStatus.classList.add('syncing');
  apiStatusText.textContent = 'Consultando Web Service...';
  fetchRatesBtn.classList.add('loading');

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.result === 'success') {
      state.rates = data.rates;
      state.ratesBase = base;
      state.lastRatesUpdate = new Date();

      apiStatus.classList.remove('syncing');
      apiStatusText.textContent = `Tasas sincronizadas (${base})`;
      converterTimestamp.textContent = `Última actualización: ${state.lastRatesUpdate.toLocaleTimeString()}`;
      converterRateCaption.textContent = `Tasa en vivo (Base: ${base}) vía Open Exchange API`;

      convertCurrencies();
      if (force) {
        showToast('Tasas de cambio actualizadas con éxito');
      }
    } else {
      throw new Error('API response invalid');
    }
  } catch (error) {
    apiStatus.classList.remove('syncing');
    apiStatusText.textContent = 'Modo local (Fallback)';
    showToast('Error al conectar con Web Service de divisas');
    fallbackExchangeRates(base);
  } finally {
    fetchRatesBtn.classList.remove('loading');
  }
}

function fallbackExchangeRates(base) {
  state.rates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    MXN: 17.15,
    COP: 3950.0,
    ARS: 850.0,
    CLP: 980.0,
    BRL: 4.95,
    JPY: 151.2,
    CAD: 1.35,
    AUD: 1.52,
    CHF: 0.88
  };
  state.ratesBase = 'USD';
  state.lastRatesUpdate = new Date();
  converterRateCaption.textContent = 'Tasas locales estimadas';
  converterTimestamp.textContent = 'Modo sin conexión';
  convertCurrencies();
}

function convertCurrencies() {
  const amount = parseFloat(currencyAmount.value);
  if (isNaN(amount)) {
    converterResult.textContent = '0.00 ' + toCurrency.value;
    return;
  }

  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (Object.keys(state.rates).length === 0) {
    fetchExchangeRates(from);
    return;
  }

  if (state.ratesBase !== from && !state.rates[from]) {
    fetchExchangeRates(from);
    return;
  }

  let rate = 1;
  if (state.ratesBase === from) {
    rate = state.rates[to] || 1;
  } else {
    const rateToBase = 1 / (state.rates[from] || 1);
    const rateToTarget = state.rates[to] || 1;
    rate = rateToBase * rateToTarget;
  }

  const converted = amount * rate;
  const formatted = converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });

  converterResult.textContent = `${formatted} ${to}`;
}

async function evaluateWithCloudAPI() {
  let expr = '';
  if (state.previousInput && state.operation) {
    expr = `${state.previousInput} ${state.operation} ${state.currentInput}`;
  } else {
    expr = state.currentInput;
  }

  if (!expr || expr === 'Error') {
    showToast('Ingresa una expresión para calcular');
    return;
  }

  apiStatus.classList.add('syncing');
  apiStatusText.textContent = 'Calculando en Cloud...';
  cloudEvalBtn.disabled = true;

  try {
    const cleanExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    const endpoint = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(cleanExpr)}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const cloudResult = await response.text();
    const formatted = formatCalcResult(parseFloat(cloudResult));

    addHistoryEntry(`${cleanExpr} (Cloud API)`, formatted);
    state.currentInput = formatted;
    state.previousInput = '';
    state.operation = null;
    state.shouldResetInput = true;
    updateDisplay();

    apiStatus.classList.remove('syncing');
    apiStatusText.textContent = 'Resuelto vía MathJS Cloud';
    showToast('Cálculo verificado con Web Service Cloud');
  } catch (error) {
    apiStatus.classList.remove('syncing');
    apiStatusText.textContent = 'Error Cloud, calculando local';
    executeCalculation();
    showToast('Fallo Web Service, calculado en motor local');
  } finally {
    cloudEvalBtn.disabled = false;
  }
}

function copyCurrentResult() {
  const text = state.currentInput;
  if (!navigator.clipboard) {
    showToast('Portapapeles no soportado');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast('¡Copiado al portapapeles!');
  }).catch(() => {
    showToast('No se pudo copiar');
  });
}

function setupEventListeners() {
  calcKeypad.addEventListener('click', (e) => {
    const target = e.target.closest('.key');
    if (!target) return;

    triggerKeyVisual(target);

    if (target.dataset.num !== undefined) {
      handleNumber(target.dataset.num);
    } else if (target.dataset.operator !== undefined) {
      handleOperator(target.dataset.operator);
    } else if (target.dataset.action !== undefined) {
      const act = target.dataset.action;
      if (['clear', 'backspace', 'percent', 'negate', 'equals'].includes(act)) {
        handleAction(act);
      } else {
        handleScientific(act);
      }
    }
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  themeToggle.addEventListener('click', toggleTheme);
  historyToggle.addEventListener('click', openHistoryDrawer);
  closeHistoryBtn.addEventListener('click', closeHistoryDrawer);
  historyBackdrop.addEventListener('click', closeHistoryDrawer);

  clearHistoryBtn.addEventListener('click', () => {
    state.history = [];
    saveHistory();
    renderHistory();
    showToast('Historial borrado');
  });

  copyBtn.addEventListener('click', copyCurrentResult);

  currencyAmount.addEventListener('input', convertCurrencies);
  fromCurrency.addEventListener('change', () => {
    fetchExchangeRates(fromCurrency.value);
  });
  toCurrency.addEventListener('change', convertCurrencies);

  swapCurrenciesBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    fetchExchangeRates(fromCurrency.value);
  });

  fetchRatesBtn.addEventListener('click', () => {
    fetchExchangeRates(fromCurrency.value, true);
  });

  cloudEvalBtn.addEventListener('click', evaluateWithCloudAPI);

  useCalcResultBtn.addEventListener('click', () => {
    if (state.currentInput !== 'Error' && !isNaN(parseFloat(state.currentInput))) {
      currencyAmount.value = Math.abs(parseFloat(state.currentInput));
      convertCurrencies();
      showToast('Monto de calculadora aplicado');
    }
  });

  document.addEventListener('keydown', handleKeyboardInput);
}

function triggerKeyVisual(buttonElement) {
  buttonElement.classList.add('pressed');
  setTimeout(() => {
    buttonElement.classList.remove('pressed');
  }, 120);
}

function handleKeyboardInput(e) {
  if (['input', 'select', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
    return;
  }

  const key = e.key;

  if (key >= '0' && key <= '9') {
    e.preventDefault();
    const btn = document.querySelector(`.num-key[data-num="${key}"]`);
    if (btn) triggerKeyVisual(btn);
    handleNumber(key);
    return;
  }

  if (key === '.' || key === ',') {
    e.preventDefault();
    const btn = document.querySelector(`.num-key[data-num="."]`);
    if (btn) triggerKeyVisual(btn);
    handleNumber('.');
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    e.preventDefault();
    const btn = document.querySelector(`.operator-key[data-operator="${key}"]`);
    if (btn) triggerKeyVisual(btn);
    handleOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    const btn = document.querySelector('.equals-key');
    if (btn) triggerKeyVisual(btn);
    handleAction('equals');
    return;
  }

  if (key === 'Backspace') {
    e.preventDefault();
    const btn = document.querySelector('[data-action="backspace"]');
    if (btn) triggerKeyVisual(btn);
    handleAction('backspace');
    return;
  }

  if (key === 'Escape') {
    e.preventDefault();
    const btn = document.querySelector('[data-action="clear"]');
    if (btn) triggerKeyVisual(btn);
    handleAction('clear');
    return;
  }

  if (key === '%') {
    e.preventDefault();
    handleAction('percent');
    return;
  }

  if (key === '^') {
    e.preventDefault();
    handleScientific('pow');
    return;
  }
}

function init() {
  loadTheme();
  loadHistory();
  updateDisplay();
  setupEventListeners();
  fetchExchangeRates('USD');
}

document.addEventListener('DOMContentLoaded', init);
