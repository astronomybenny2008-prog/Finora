/**
 * ==========================================================================
 * FINORA — PREMIUM SAAS INTERACTIVE ENGINE
 * File: /js/main.js
 * Project: Finora - AI-Powered Financial Journeys
 * Hackathon Prototype Edition 2026
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSearchInteraction();
  initHomeAIChat();
  initJourneyStepper();
  initHomeModals();
  initEMICalculator();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. DAY / NIGHT THEME TOGGLE ENGINE
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const lightBtn = document.getElementById('themeLightBtn');
  const darkBtn = document.getElementById('themeDarkBtn');
  
  // Check saved or system preference
  const savedTheme = localStorage.getItem('finora_theme') || 'light';
  applyTheme(savedTheme);

  if (lightBtn) {
    lightBtn.addEventListener('click', () => {
      applyTheme('light');
    });
  }

  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      applyTheme('dark');
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      lightBtn?.classList.remove('active');
      darkBtn?.classList.add('active');
      localStorage.setItem('finora_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      lightBtn?.classList.add('active');
      darkBtn?.classList.remove('active');
      localStorage.setItem('finora_theme', 'light');
    }
  }
}

/* --------------------------------------------------------------------------
   2. SEARCH INTERACTION (Ctrl + K / Cmd + K)
   -------------------------------------------------------------------------- */
function initSearchInteraction() {
  const searchInput = document.getElementById('globalSearchInput');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          handleHomeAiMessage(query);
          searchInput.value = '';
          scrollToAiCard();
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. FINORA AI CONVERSATIONAL COMPANION (RIGHT PANEL)
   -------------------------------------------------------------------------- */
const HOME_AI_RESPONSES = {
  "explain a financial term": `**Key Financial Terms Demystified:**
• **EMI (Equated Monthly Installment)**: Fixed monthly payment combining principal and interest.
• **CIBIL / Credit Score**: A 3-digit score (300–900). 750+ unlocks the lowest interest rates.
• **Deductible**: The amount you pay out-of-pocket before health insurance coverage kicks in.
• **FOIR**: Fixed Obligation to Income Ratio. Lenders prefer EMIs under 40% of net monthly income.

Which specific term would you like more details on?`,

  "explore loans": `**Finora Loans Journey:**
We guide you across all major lending journeys:
1. **Home Loans**: Rates from ~8.5% with tenures up to 30 years and tax benefits under Sec 24(b).
2. **Personal Loans**: Fast disbursement without collateral for emergencies.
3. **Education Loans**: Dedicated repayment holiday (moratorium) during study periods.
4. **Car Loans**: Flexible financing with up to 90% on-road funding.

Would you like to try the **EMI Calculator** or view the full **Loans Journey**?`,

  "understand insurance": `**Finora Insurance Guidance:**
• **Health Insurance**: Hospitalization shield with cashless network access and pre/post coverage.
• **Term Life Insurance**: Pure protection for family security (recommend 10x-15x annual income).
• **Motor & Vehicle**: Comprehensive mandatory and own-damage coverage.

Need help reviewing policy waiting periods or claim filing procedures?`,

  "explore fintech": `**Modern Digital Fintech Services:**
• **UPI & Instant Payments**: Safe scan & pay protocols, PIN safety, and fraud prevention.
• **Digital KYC**: Paperless DigiLocker and Video-KYC onboarding in under 5 minutes.
• **Wealth Tech & Mutual Funds**: Automated SIPs (Systematic Investment Plans) starting at ₹500/mo.
• **Credit Management**: Free monthly credit monitoring and score improvement steps.`,

  "help me prepare": `**Journey Preparation Roadmap:**
1. **Verify Documents**: PAN, Aadhaar, 3 months pay slips, 6 months bank statements.
2. **Review Credit Health**: Check for discrepancies or late payments on your CIBIL report.
3. **Calculate EMI Budget**: Ensure total proposed EMI is below 40% of your take-home pay.
4. **Compare Options**: Review loan processing fees and insurance waiting periods before applying.`,

  "ask a question": `I'm ready to answer any question! You can ask about loan eligibility calculations, insurance exclusions, repayment schedules, or fintech safety rules.`
};

function initHomeAIChat() {
  const form = document.getElementById('homeAiForm');
  const input = document.getElementById('homeAiInput');
  const quickChips = document.querySelectorAll('.ai-chip-pill');
  const eligibilityAskBtn = document.getElementById('eligibilityAskAiBtn');
  const docChecklistAskBtn = document.getElementById('docChecklistAskAiBtn');
  const sidebarAiTrigger = document.getElementById('sidebarAiTrigger');
  const mobileAiBtn = document.getElementById('mobileAiBtn');

  // Quick Action Chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const intent = chip.getAttribute('data-intent');
      if (intent) {
        handleHomeAiMessage(intent);
      }
    });
  });

  // Modal Triggers
  if (eligibilityAskBtn) {
    eligibilityAskBtn.addEventListener('click', () => {
      closeAllModals();
      handleHomeAiMessage('How can I check and improve my loan eligibility?');
      scrollToAiCard();
    });
  }

  if (docChecklistAskBtn) {
    docChecklistAskBtn.addEventListener('click', () => {
      closeAllModals();
      handleHomeAiMessage('Help me prepare');
      scrollToAiCard();
    });
  }

  // Sidebar / Mobile AI buttons
  [sidebarAiTrigger, mobileAiBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToAiCard();
        input?.focus();
      });
    }
  });

  // Form Submit
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = input.value.trim();
      if (!userText) return;
      handleHomeAiMessage(userText);
      input.value = '';
    });
  }
}

function handleHomeAiMessage(userText) {
  const chatBody = document.getElementById('homeAiChatBody');
  if (!chatBody) return;

  // 1. Append User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'user-msg-bubble';
  userBubble.textContent = userText;
  chatBody.appendChild(userBubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 2. Typing indicator
  const typingBubble = document.createElement('div');
  typingBubble.className = 'ai-msg-bubble';
  typingBubble.id = 'homeAiTyping';
  typingBubble.innerHTML = `<em>Finora AI is organizing guidance...</em>`;
  chatBody.appendChild(typingBubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 3. Simulated Response
  setTimeout(() => {
    const typing = document.getElementById('homeAiTyping');
    if (typing) typing.remove();

    const responseText = getHomeAiResponse(userText);
    const aiBubble = document.createElement('div');
    aiBubble.className = 'ai-msg-bubble';
    aiBubble.innerHTML = formatMarkdownText(responseText);
    chatBody.appendChild(aiBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 450);
}

function getHomeAiResponse(query) {
  const normalized = query.toLowerCase().trim();

  for (const [key, answer] of Object.entries(HOME_AI_RESPONSES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return answer;
    }
  }

  if (normalized.includes('loan') || normalized.includes('borrow')) {
    return HOME_AI_RESPONSES["explore loans"];
  }

  if (normalized.includes('insurance') || normalized.includes('policy') || normalized.includes('claim')) {
    return HOME_AI_RESPONSES["understand insurance"];
  }

  if (normalized.includes('fintech') || normalized.includes('upi') || normalized.includes('payment')) {
    return HOME_AI_RESPONSES["explore fintech"];
  }

  if (normalized.includes('prepare') || normalized.includes('doc') || normalized.includes('kyc')) {
    return HOME_AI_RESPONSES["help me prepare"];
  }

  if (normalized.includes('term') || normalized.includes('emi') || normalized.includes('meaning')) {
    return HOME_AI_RESPONSES["explain a financial term"];
  }

  return `Here is what you should know about **${escapeHtml(query)}**: Finora guides you through financial services by breaking down every step into simple, actionable milestones across loans, insurance, and digital fintech. Would you like to explore our interactive tools or check our document checklist?`;
}

function formatMarkdownText(text) {
  let formatted = escapeHtml(text);
  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Bullets
  formatted = formatted.replace(/• (.*?)(?:\n|$)/g, '<div style="margin-left: 8px; margin-bottom: 3px;">• $1</div>');
  // Newlines
  formatted = formatted.replace(/\n/g, '<br>');
  return formatted;
}

function scrollToAiCard() {
  const aiSection = document.getElementById('aiSection');
  if (aiSection) {
    aiSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* --------------------------------------------------------------------------
   4. FINANCIAL JOURNEY STEPPER (5 INTERACTIVE STAGES)
   -------------------------------------------------------------------------- */
const JOURNEY_STAGES = [
  {
    step: "01",
    title: "01 — Understand the Basics & Clarify Your Goals",
    desc: "Start with zero confusion. Finora demystifies complicated jargon across lending, insurance coverage, and digital fintech so you know exactly what options fit your situation before making any commitment.",
    tip: "Understanding your credit health and coverage requirements upfront saves time and prevents costly surprises.",
    btnText: "Explore Product Areas",
    action: "products"
  },
  {
    step: "02",
    title: "02 — Explore & Compare Options Side-by-Side",
    desc: "Review terms, tenure, interest rates, deductibles, and waiting periods side-by-side. Calculate repayment schedules using our transparent visual estimators.",
    tip: "Balancing monthly cashflow affordability with total interest outgo gives you optimal long-term security.",
    btnText: "Open EMI Calculator",
    action: "calculator"
  },
  {
    step: "03",
    title: "03 — Prepare Documentation & Assess Financial Health",
    desc: "Organize your KYC records, income statements, and credit score records. Finora AI verifies checklist readiness so you avoid rejection delays.",
    tip: "Matching names across PAN and Aadhaar prevents 92% of early documentation rejections.",
    btnText: "Open Document Checklist",
    action: "docs"
  },
  {
    step: "04",
    title: "04 — Navigate the Application & Verification",
    desc: "Understand verification timelines, lender evaluation factors, cashless pre-authorisation steps, and status milestones.",
    tip: "Lenders assess your Fixed Obligation to Income Ratio (FOIR). Maintaining it below 40% speeds up processing.",
    btnText: "Check Eligibility Guide",
    action: "eligibility"
  },
  {
    step: "05",
    title: "05 — Complete Your Goal & Build a Brighter Future",
    desc: "Disburse loans responsibly, manage ongoing policy renewals, claim benefits seamlessly, and achieve your financial aspirations with confidence.",
    tip: "Regular on-time payments boost your credit score above 750, unlocking premium financial benefits.",
    btnText: "Start AI Journey",
    action: "ai"
  }
];

function initJourneyStepper() {
  const stepButtons = document.querySelectorAll('.journey-step-btn');
  const titleEl = document.getElementById('stepDetailTitle');
  const descEl = document.getElementById('stepDetailDesc');
  const tipTextEl = document.getElementById('stepDetailTipText');
  const btnTextEl = document.getElementById('stepDetailBtnText');
  const actionBtn = document.getElementById('stepDetailActionBtn');

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepIdx = parseInt(btn.getAttribute('data-step-index') || '0', 10);

      stepButtons.forEach((b) => {
        b.classList.remove('active-step');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active-step');
      btn.setAttribute('aria-selected', 'true');

      const data = JOURNEY_STAGES[stepIdx] || JOURNEY_STAGES[0];
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (tipTextEl) tipTextEl.textContent = `AI Tip: ${data.tip}`;
      if (btnTextEl) btnTextEl.textContent = data.btnText;
    });
  });

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.journey-step-btn.active-step');
      const idx = activeBtn ? parseInt(activeBtn.getAttribute('data-step-index') || '0', 10) : 0;
      const data = JOURNEY_STAGES[idx] || JOURNEY_STAGES[0];

      if (data.action === 'calculator') {
        openModal('modalEmiCalculator');
      } else if (data.action === 'docs') {
        openModal('modalDocChecklist');
      } else if (data.action === 'eligibility') {
        openModal('modalEligibilityGuide');
      } else if (data.action === 'products') {
        window.location.href = 'loans.html';
      } else {
        scrollToAiCard();
        document.getElementById('homeAiInput')?.focus();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE MODALS
   -------------------------------------------------------------------------- */
function initHomeModals() {
  const toolEmi = document.getElementById('toolEmiBtn');
  const toolEligibility = document.getElementById('toolEligibilityBtn');
  const toolDocs = document.getElementById('toolDocsBtn');
  const toolKnowledge = document.getElementById('toolKnowledgeBtn');
  const newJourneyBtn = document.getElementById('newJourneyBtn');

  const closeEmi = document.getElementById('closeEmiModal');
  const closeEligibility = document.getElementById('closeEligibilityModal');
  const closeDocs = document.getElementById('closeDocChecklistModal');

  if (toolEmi) toolEmi.addEventListener('click', () => openModal('modalEmiCalculator'));
  if (toolEligibility) toolEligibility.addEventListener('click', () => openModal('modalEligibilityGuide'));
  if (toolDocs) toolDocs.addEventListener('click', () => openModal('modalDocChecklist'));
  if (toolKnowledge) {
    toolKnowledge.addEventListener('click', () => {
      handleHomeAiMessage('Explain a financial term');
      scrollToAiCard();
    });
  }
  if (newJourneyBtn) {
    newJourneyBtn.addEventListener('click', () => {
      handleHomeAiMessage('What financial journey should I start with?');
      scrollToAiCard();
    });
  }

  if (closeEmi) closeEmi.addEventListener('click', closeAllModals);
  if (closeEligibility) closeEligibility.addEventListener('click', closeAllModals);
  if (closeDocs) closeDocs.addEventListener('click', closeAllModals);

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('home-modal-overlay')) {
      closeAllModals();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.home-modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE EMI CALCULATOR ENGINE
   -------------------------------------------------------------------------- */
function initEMICalculator() {
  const amountSlider = document.getElementById('emiAmountSlider');
  const rateSlider = document.getElementById('emiRateSlider');
  const tenureSlider = document.getElementById('emiTenureSlider');

  const amountVal = document.getElementById('emiAmountVal');
  const rateVal = document.getElementById('emiRateVal');
  const tenureVal = document.getElementById('emiTenureVal');

  const resultEmi = document.getElementById('calcResultEmi');
  const resultPrincipal = document.getElementById('calcResultPrincipal');
  const resultInterest = document.getElementById('calcResultInterest');
  const resultTotal = document.getElementById('calcResultTotal');

  function calculate() {
    if (!amountSlider || !rateSlider || !tenureSlider) return;

    const principal = parseFloat(amountSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const tenureYears = parseFloat(tenureSlider.value);

    // Update Slider Badges with Indian Numbering
    if (amountVal) {
      const lakhs = (principal / 100000).toFixed(principal % 100000 === 0 ? 0 : 2);
      amountVal.textContent = `₹${formatINR(principal)} (${lakhs} Lakhs)`;
    }
    if (rateVal) rateVal.textContent = `${annualRate.toFixed(1)}%`;
    if (tenureVal) tenureVal.textContent = `${tenureYears} Years`;

    // Monthly EMI Calculation
    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    if (resultEmi) resultEmi.textContent = `₹${formatINR(Math.round(emi))}/mo`;
    if (resultPrincipal) resultPrincipal.textContent = `₹${formatINR(principal)}`;
    if (resultInterest) resultInterest.textContent = `₹${formatINR(Math.round(totalInterest))}`;
    if (resultTotal) resultTotal.textContent = `₹${formatINR(Math.round(totalPayment))}`;
  }

  if (amountSlider && rateSlider && tenureSlider) {
    amountSlider.addEventListener('input', calculate);
    rateSlider.addEventListener('input', calculate);
    tenureSlider.addEventListener('input', calculate);
    calculate();
  }
}

function formatINR(number) {
  return number.toLocaleString('en-IN');
}

/* --------------------------------------------------------------------------
   7. SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
