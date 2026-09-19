/**
 * ==========================================================================
 * FINORA — HOME PAGE INTERACTIVE ENGINE
 * File: /js/main.js
 * Project: Finora - AI-Powered Financial Journeys
 * Hackathon Prototype Edition 2026
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSearchInteraction();
  initHomeAIChat();
  initJourneyTimeline();
  initHomeModals();
  initEMICalculator();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. MOBILE MENU & BACKDROP TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeDrawer);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   2. SEARCH INTERACTION (Ctrl + K / Cmd + K)
   -------------------------------------------------------------------------- */
function initSearchInteraction() {
  const searchInputs = document.querySelectorAll('.search-input');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const primarySearch = document.getElementById('globalSearchInput');
      if (primarySearch) {
        primarySearch.focus();
        primarySearch.select();
      }
    }
  });

  searchInputs.forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          const aiInput = document.getElementById('homeAiInput');
          if (aiInput) {
            aiInput.value = query;
            handleHomeAiMessage(query);
            aiInput.value = '';
            scrollToAiCard();
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. FINORA AI CONVERSATIONAL COMPANION (RIGHT SIDEBAR)
   -------------------------------------------------------------------------- */
const HOME_AI_RESPONSES = {
  "what loan suits my needs": `To help you find the right loan, consider your goal:
• **Home Loan**: For buying or constructing property (tenures up to 30 years, interest ~8.5%).
• **Personal Loan**: For emergencies, wedding, or travel without collateral (1–5 years, ~10.5%–16%).
• **Education Loan**: For higher studies in India or abroad with student repayment holidays.
• **Car Loan**: For new or pre-owned vehicle purchases (3–7 years).

Would you like to explore the full Loans Journey?`,

  "explain insurance coverage": `**Insurance Coverage** represents the financial shield provided by your policy:
• **Health Insurance**: Covers inpatient hospitalization, room rent, ICU, and day-care treatments (e.g. ₹10 Lakhs to ₹1 Crore cover).
• **Term Life Insurance**: Provides a guaranteed lump-sum payout (e.g. ₹1.5 Crore) to your family if unexpected events occur.
• **Vehicle Insurance**: Comprehensive cover protects against accident damages, theft, and third-party liabilities.`,

  "how does emi work": `**Equated Monthly Installment (EMI)** is the fixed monthly repayment amount you pay to the lender.
• **Formula**: EMI includes both **Principal Repayment** and **Interest Fees**.
• **Rule of Thumb**: Keep your total monthly EMIs under **40% of your net monthly income** for healthy financial stability.
• Try our interactive **EMI Calculator** tool below!`,

  "what documents are required": `Standard financial documentation in India includes:
• **KYC & Identity**: PAN Card (Mandatory), Aadhaar Card, Passport, or Voter ID.
• **Address Proof**: Electricity Bill, Bank Passbook, or Rental Agreement.
• **Income Proof**: Last 3 months Salary Slips, Form 16, 6 months Bank Statements, or 2–3 years ITR filings.`,

  "i have a specific question": `I'm ready to help! Ask me anything about interest rates, CIBIL credit scores, health insurance waiting periods, digital KYC, or repayment planning.`
};

function initHomeAIChat() {
  const form = document.getElementById('homeAiForm');
  const input = document.getElementById('homeAiInput');
  const quickChips = document.querySelectorAll('.home-ai-chip-btn');
  const eligibilityAskBtn = document.getElementById('eligibilityAskAiBtn');
  const docChecklistAskBtn = document.getElementById('docChecklistAskAiBtn');

  // Quick Action Chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const intent = chip.getAttribute('data-intent');
      if (input) {
        input.value = intent;
        handleHomeAiMessage(intent);
        input.value = '';
      }
    });
  });

  // Modal Ask AI Triggers
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
      handleHomeAiMessage('What documents are required for loan and insurance applications?');
      scrollToAiCard();
    });
  }

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
  userBubble.className = 'user-bubble-msg';
  userBubble.innerHTML = `<div class="user-bubble-content">${escapeHtml(userText)}</div>`;
  chatBody.appendChild(userBubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 2. Show Typing Indicator
  const typingBubble = document.createElement('div');
  typingBubble.className = 'ai-bubble-msg';
  typingBubble.id = 'homeAiTyping';
  typingBubble.innerHTML = `
    <div class="ai-bubble-avatar">🤖</div>
    <div class="ai-bubble-content">
      <em>Finora AI is organizing guidance...</em>
    </div>
  `;
  chatBody.appendChild(typingBubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 3. Simulated Response
  setTimeout(() => {
    const typing = document.getElementById('homeAiTyping');
    if (typing) typing.remove();

    const responseText = getHomeAiResponse(userText);
    const aiBubble = document.createElement('div');
    aiBubble.className = 'ai-bubble-msg';
    aiBubble.innerHTML = `
      <div class="ai-bubble-avatar">🤖</div>
      <div class="ai-bubble-content">${responseText}</div>
    `;
    chatBody.appendChild(aiBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

function getHomeAiResponse(query) {
  const normalized = query.toLowerCase();

  for (const [key, answer] of Object.entries(HOME_AI_RESPONSES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return answer;
    }
  }

  if (normalized.includes('loan')) {
    return HOME_AI_RESPONSES["what loan suits my needs"];
  }

  if (normalized.includes('insurance') || normalized.includes('coverage') || normalized.includes('policy')) {
    return HOME_AI_RESPONSES["explain insurance coverage"];
  }

  if (normalized.includes('emi') || normalized.includes('calculator') || normalized.includes('interest')) {
    return HOME_AI_RESPONSES["how does emi work"];
  }

  if (normalized.includes('doc') || normalized.includes('kyc') || normalized.includes('proof')) {
    return HOME_AI_RESPONSES["what documents are required"];
  }

  return `Here is what you should know about **${escapeHtml(query)}**: Finora guides you through financial services by breaking down every step into simple, actionable milestones across loans, insurance, and digital fintech. Would you like to start an educational journey in Loans, Insurance, or explore our interactive tools?`;
}

function scrollToAiCard() {
  const aiCard = document.querySelector('.home-ai-card');
  if (aiCard) {
    aiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* --------------------------------------------------------------------------
   4. FINANCIAL JOURNEY TIMELINE (5 STEPS)
   -------------------------------------------------------------------------- */
const HOME_JOURNEY_STEPS = [
  {
    step: "01",
    title: "01 — Understand the Basics & Clarify Your Goals",
    text: "Start with zero confusion. Finora demystifies complicated jargon across lending, insurance coverage, and digital fintech so you know exactly what options fit your situation before making any commitment.",
    tip: "AI Guidance: Understanding your credit health and coverage requirements upfront saves time and prevents costly surprises.",
    btnText: "Explore Solutions",
    action: "solutions"
  },
  {
    step: "02",
    title: "02 — Plan & Compare Your Best Options",
    text: "Review terms, tenure, interest rates, deductibles, and waiting periods side-by-side. Calculate repayment schedules using our transparent visual estimators.",
    tip: "AI Guidance: Balancing monthly cashflow affordability with total interest outgo gives you optimal long-term security.",
    btnText: "Open EMI Calculator",
    action: "calculator"
  },
  {
    step: "03",
    title: "03 — Take Action & Prepare Documentation",
    text: "Organize mandatory paperwork including PAN, Aadhaar, address verification, salary slips, and bank statements with our step-by-step document checklist.",
    tip: "AI Guidance: Ensuring your name and address match across all submitted records avoids verification delays.",
    btnText: "View Document Checklist",
    action: "docs"
  },
  {
    step: "04",
    title: "04 — Track & Navigate the Process with Confidence",
    text: "Understand verification timelines, lender evaluation factors, TPA cashless pre-authorisation steps, and status milestones.",
    tip: "AI Guidance: Lenders assess your Fixed Obligation to Income Ratio (FOIR). Maintaining it below 40% speeds up processing.",
    btnText: "Explore Eligibility Guide",
    action: "eligibility"
  },
  {
    step: "05",
    title: "05 — Achieve Your Goal & Build a Brighter Future",
    text: "Disburse loans responsibly, manage ongoing policy renewals, claim benefits seamlessly, and achieve your financial aspirations with confidence.",
    tip: "AI Guidance: Regular on-time payments boost your credit score above 750, unlocking premium financial benefits.",
    btnText: "Start AI Journey",
    action: "ai"
  }
];

function initJourneyTimeline() {
  const stepButtons = document.querySelectorAll('.home-journey-step');
  const detailNum = document.getElementById('homeDetailStepNum');
  const detailTitle = document.getElementById('homeDetailTitle');
  const detailText = document.getElementById('homeDetailText');
  const detailTip = document.getElementById('homeDetailTip');
  const detailBtn = document.getElementById('homeDetailActionBtn');

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepIndex = parseInt(btn.getAttribute('data-step-index') || '0', 10);

      stepButtons.forEach((b) => {
        b.classList.remove('active-step');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active-step');
      btn.setAttribute('aria-selected', 'true');

      const data = HOME_JOURNEY_STEPS[stepIndex] || HOME_JOURNEY_STEPS[0];
      if (detailNum) detailNum.textContent = data.step;
      if (detailTitle) detailTitle.textContent = data.title;
      if (detailText) detailText.textContent = data.text;
      if (detailTip) {
        detailTip.innerHTML = `
          <span class="home-tip-icon">💡</span>
          <span class="home-tip-text">${data.tip}</span>
        `;
      }
      if (detailBtn) detailBtn.textContent = data.btnText;
    });
  });

  if (detailBtn) {
    detailBtn.addEventListener('click', () => {
      const activeStep = document.querySelector('.home-journey-step.active-step');
      const idx = activeStep ? parseInt(activeStep.getAttribute('data-step-index') || '0', 10) : 0;
      const data = HOME_JOURNEY_STEPS[idx] || HOME_JOURNEY_STEPS[0];

      if (data.action === 'solutions') {
        document.getElementById('solutionsSection')?.scrollIntoView({ behavior: 'smooth' });
      } else if (data.action === 'calculator') {
        openModal('modalEmiCalculator');
      } else if (data.action === 'docs') {
        openModal('modalDocChecklist');
      } else if (data.action === 'eligibility') {
        openModal('modalEligibilityGuide');
      } else {
        window.location.href = 'ai-assistant.html';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE MODALS
   -------------------------------------------------------------------------- */
function initHomeModals() {
  const toolEmi = document.getElementById('homeToolEmi');
  const toolEligibility = document.getElementById('homeToolEligibility');
  const toolDocs = document.getElementById('homeToolDocs');
  const toolKnowledge = document.getElementById('homeToolKnowledge');
  const closeEmi = document.getElementById('closeEmiModal');
  const closeEligibility = document.getElementById('closeEligibilityModal');
  const closeDocs = document.getElementById('closeDocChecklistModal');

  if (toolEmi) {
    toolEmi.addEventListener('click', () => openModal('modalEmiCalculator'));
  }

  if (toolEligibility) {
    toolEligibility.addEventListener('click', () => openModal('modalEligibilityGuide'));
  }

  if (toolDocs) {
    toolDocs.addEventListener('click', () => openModal('modalDocChecklist'));
  }

  if (toolKnowledge) {
    toolKnowledge.addEventListener('click', () => {
      window.location.href = 'knowledge-hub.html';
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
