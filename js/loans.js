/**
 * ==========================================================================
 * FINORA — LOANS PAGE INTERACTIVE ENGINE
 * File: /js/loans.js
 * Project: Finora - AI-Powered Financial Journeys
 * Hackathon Prototype Edition 2026
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initThemeToggle();
  initSearchInteraction();
  initInCardEMICalculator();
  initJourneyStepper();
  initChecklistTracker();
  initLoansAIChat();
  initModalsAndTriggers();
  initDocAnalyzer();
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
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
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
   2. THEME TOGGLE (LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  // Check persisted preference
  const savedTheme = localStorage.getItem('finora-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('finora-theme', isDark ? 'dark' : 'light');
  });
}

/* --------------------------------------------------------------------------
   3. SEARCH INTERACTION (Ctrl + K)
   -------------------------------------------------------------------------- */
function initSearchInteraction() {
  const globalSearch = document.getElementById('globalSearchInput');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (globalSearch) {
        globalSearch.focus();
        globalSearch.select();
      }
    }
  });

  if (globalSearch) {
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = globalSearch.value.trim();
        if (query) {
          const aiInput = document.getElementById('loansAiInput');
          if (aiInput) {
            aiInput.value = query;
            handleAiSendMessage(query);
            aiInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. IN-CARD LIVE EMI CALCULATOR
   -------------------------------------------------------------------------- */
function initInCardEMICalculator() {
  const amountInput = document.getElementById('inCardLoanAmount');
  const rateInput = document.getElementById('inCardInterestRate');
  const tenureInput = document.getElementById('inCardTenureYears');

  const resultEmi = document.getElementById('inCardResultEmi');
  const resultInterest = document.getElementById('inCardResultInterest');
  const resultTotal = document.getElementById('inCardResultTotal');

  if (!amountInput || !rateInput || !tenureInput) return;

  function parseFormattedNumber(val) {
    if (typeof val === 'number') return val;
    const cleanStr = (val || '').toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  }

  function formatIndianRupee(num) {
    const rounded = Math.round(num);
    return '₹ ' + rounded.toLocaleString('en-IN');
  }

  function calculate() {
    const P = parseFormattedNumber(amountInput.value);
    const annualRate = parseFloat(rateInput.value) || 0;
    const tenureYears = parseFloat(tenureInput.value) || 0;

    if (P <= 0 || tenureYears <= 0) {
      if (resultEmi) resultEmi.textContent = '₹ 0';
      if (resultInterest) resultInterest.textContent = '₹ 0';
      if (resultTotal) resultTotal.textContent = '₹ 0';
      return;
    }

    const monthlyRate = (annualRate / 12) / 100;
    const totalMonths = tenureYears * 12;

    let emi = 0;
    if (monthlyRate === 0) {
      emi = P / totalMonths;
    } else {
      emi = (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
            (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - P;

    if (resultEmi) resultEmi.textContent = formatIndianRupee(emi);
    if (resultInterest) resultInterest.textContent = formatIndianRupee(totalInterest);
    if (resultTotal) resultTotal.textContent = formatIndianRupee(totalPayment);
  }

  // Handle amount formatting on blur
  amountInput.addEventListener('blur', () => {
    const rawVal = parseFormattedNumber(amountInput.value);
    if (rawVal > 0) {
      amountInput.value = rawVal.toLocaleString('en-IN');
    }
  });

  amountInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  tenureInput.addEventListener('input', calculate);

  // Initial Calculation
  calculate();
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE JOURNEY STEPPER ROADMAP
   -------------------------------------------------------------------------- */
const JOURNEY_STAGES_DATA = [
  {
    stepNum: "Stage 01",
    title: "Understand: Key Concepts & Borrowing Purpose",
    desc: "Start by defining your financial requirement and understanding loan fundamentals—interest types (fixed vs. floating), repayment tenures, and eligibility requirements.",
    btnText: "Explore Loan Options",
    action: () => {
      const section = document.querySelector('.loans-categories-section');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },
  {
    stepNum: "Stage 02",
    title: "Explore: Compare Loan Types & Features",
    desc: "Compare personal, home, education, and vehicle loans. Evaluate interest rates, repayment tenures, and security requirements to find the ideal match.",
    btnText: "Estimate Monthly EMI",
    action: () => {
      const calcCard = document.querySelector('.emi-calc-card');
      if (calcCard) calcCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  {
    stepNum: "Stage 03",
    title: "Prepare: Information & Document Readiness",
    desc: "Identify and organize your identity, address, and income proofs. Having clear, matching records expedites lender verification and avoids procedural delays.",
    btnText: "Review Required Documents",
    action: () => openModal('modalDocChecklist')
  },
  {
    stepNum: "Stage 04",
    title: "Apply: Formal Application & Underwriting",
    desc: "Submit your application to the authorized lender. Complete digital or physical KYC verification and provide necessary documentation for underwriting review.",
    btnText: "Ask AI About Underwriting",
    action: () => {
      const input = document.getElementById('loansAiInput');
      if (input) {
        input.value = "What happens during loan underwriting and application review?";
        handleAiSendMessage(input.value);
      }
    }
  },
  {
    stepNum: "Stage 05",
    title: "Track & Repay: Sanction Letter & Repayment Setup",
    desc: "Review sanction terms, processing fee deductions, and set up automated e-Mandate/NACH monthly EMI deductions to build a strong credit rating.",
    btnText: "Learn About Repayment",
    action: () => {
      openEduTopicModal('emi');
    }
  }
];

function initJourneyStepper() {
  const nodeButtons = document.querySelectorAll('.journey-node-item');
  const liveBadge = document.getElementById('journeyLiveBadge');
  const liveTitle = document.getElementById('journeyLiveTitle');
  const liveDesc = document.getElementById('journeyLiveDesc');
  const liveBtn = document.getElementById('journeyLiveActionBtn');
  const stagesText = document.getElementById('snapshotStagesText');

  if (!nodeButtons.length) return;

  function updateStage(index) {
    nodeButtons.forEach((btn, idx) => {
      btn.classList.remove('completed-node', 'current-highlight', 'upcoming-node');
      if (idx < index) {
        btn.classList.add('completed-node');
      } else if (idx === index) {
        btn.classList.add('current-highlight');
      } else {
        btn.classList.add('upcoming-node');
      }
    });

    const data = JOURNEY_STAGES_DATA[index];
    if (data) {
      if (liveBadge) liveBadge.textContent = data.stepNum;
      if (liveTitle) liveTitle.textContent = data.title;
      if (liveDesc) liveDesc.textContent = data.desc;
      if (liveBtn) {
        liveBtn.textContent = data.btnText;
        liveBtn.onclick = data.action;
      }
    }

    if (stagesText) {
      stagesText.textContent = `${index + 1} of 5 stages`;
    }
  }

  nodeButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      updateStage(idx);
    });
  });

  // Default initial click binding
  if (liveBtn) {
    liveBtn.onclick = JOURNEY_STAGES_DATA[2].action;
  }
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE CHECKLIST TRACKER ("PREPARE YOUR INFORMATION")
   -------------------------------------------------------------------------- */
function initChecklistTracker() {
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  const countBadge = document.getElementById('checklistCountBadge');
  const progressBar = document.getElementById('checklistProgressBar');
  const snapshotAreas = document.getElementById('snapshotAreasText');

  if (!checkboxes.length) return;

  function updateChecklist() {
    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach((box) => {
      if (box.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);

    if (countBadge) countBadge.textContent = `${checkedCount}/${total} prepared`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (snapshotAreas) snapshotAreas.textContent = `${checkedCount} area${checkedCount === 1 ? '' : 's'}`;
  }

  checkboxes.forEach((box) => {
    box.addEventListener('change', updateChecklist);
  });

  updateChecklist();
}

/* --------------------------------------------------------------------------
   7. FINORA AI ASSISTANT CONVERSATIONAL ENGINE
   -------------------------------------------------------------------------- */
const AI_LOANS_KNOWLEDGE = {
  "what is emi?": "An **EMI (Equated Monthly Installment)** is the fixed monthly repayment made to the lender until your loan is fully cleared.\n\nIt consists of:\n1. **Principal component**: Reducing the actual borrowed amount.\n2. **Interest component**: The cost charged by the lender.\n\nIn the early loan tenure, interest forms the larger share; towards the end, principal repayment dominates.",
  
  "how does interest work?": "**Loan Interest** is the cost of borrowing funds from a financial institution.\n\n• **Fixed Rate**: The rate remains constant throughout your loan tenure.\n• **Floating Rate**: Fluctuates with benchmark market rates (e.g. Repo Rate).\n• **APR (Annual Percentage Rate)**: Includes both the interest rate and mandatory lender fees.",
  
  "what documents may be required?": "Standard Indian lending documentation includes:\n\n1. **Identity & KYC**: PAN Card (mandatory), Aadhaar Card, Passport, or Voter ID.\n2. **Proof of Address**: Aadhaar Card, utility bills, or registered rent agreement.\n3. **Income Proof**: 3–6 months salary slips or bank statements.\n4. **Tax Filing**: Form 16 or 2–3 years ITR records.",
  
  "what is loan tenure?": "**Loan Tenure** is the total time duration agreed upon to repay the borrowed amount.\n\n• **Longer Tenure**: Lowers your monthly EMI, but increases cumulative total interest.\n• **Shorter Tenure**: Increases monthly EMI, but saves significantly on total interest cost.",
  
  "what should i understand before applying?": "Before applying for a loan, always check:\n\n1. **Affordability**: Keep total EMIs under 40–50% of your net monthly income (FOIR).\n2. **Credit Score**: A credit score of 700+ helps secure favorable interest rates.\n3. **Processing Fees & Foreclosure Rules**: Confirm non-refundable charges and prepayment terms.",

  "what is principal?": "**Principal** is the initial amount of money you borrow from a lender, before any interest or processing fees are added.",

  "what is a processing fee?": "**Processing Fee** is a one-time administrative charge collected by the lender to process, verify, and disburse your loan application.",

  "what affects eligibility?": "**Loan Eligibility** depends on your monthly income, employment stability, age, credit score (CIBIL), and existing debt obligations (Debt-to-Income / FOIR ratio)."
};

function initLoansAIChat() {
  const form = document.getElementById('loansAiForm');
  const input = document.getElementById('loansAiInput');
  const chatBody = document.getElementById('loansAiChatBody');
  const promptChips = document.querySelectorAll('.ai-prompt-chip-btn');
  const faqPills = document.querySelectorAll('.faq-pill-btn');
  const heroAskAiBtn = document.getElementById('heroAskAiBtn');
  const sidebarDarkCtaBtn = document.getElementById('sidebarDarkCtaBtn');

  if (!form || !input || !chatBody) return;

  // Prompt Chips Click
  promptChips.forEach((btn) => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query') || btn.textContent.trim();
      if (query.toLowerCase().includes('specific question')) {
        input.focus();
        input.placeholder = "Type your specific question here...";
        return;
      }
      input.value = query;
      handleAiSendMessage(query);
    });
  });

  // FAQ Pills Click
  faqPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const q = pill.getAttribute('data-question') || pill.textContent.trim();
      input.value = q;
      handleAiSendMessage(q);
      chatBody.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Hero & CTA buttons to focus AI
  if (heroAskAiBtn) {
    heroAskAiBtn.addEventListener('click', () => {
      input.focus();
      input.placeholder = "Ask Finora AI anything...";
      chatBody.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (sidebarDarkCtaBtn) {
    sidebarDarkCtaBtn.addEventListener('click', () => {
      input.focus();
      input.placeholder = "Tell Finora what you're trying to accomplish...";
      chatBody.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    handleAiSendMessage(query);
  });
}

function handleAiSendMessage(query) {
  const input = document.getElementById('loansAiInput');
  const chatBody = document.getElementById('loansAiChatBody');
  if (!chatBody) return;

  // Append user message
  const userRow = document.createElement('div');
  userRow.className = 'user-chat-msg-row';
  userRow.innerHTML = `<div class="user-msg-bubble">${escapeHTML(query)}</div>`;
  chatBody.appendChild(userRow);
  chatBody.scrollTop = chatBody.scrollHeight;

  if (input) input.value = '';

  // Append AI typing indicator
  const typingRow = document.createElement('div');
  typingRow.className = 'ai-chat-msg-row ai-incoming-msg typing-row';
  typingRow.innerHTML = `
    <div class="ai-msg-avatar-icon">✨</div>
    <div class="ai-msg-bubble">
      <em>Finora AI is typing...</em>
    </div>
  `;
  chatBody.appendChild(typingRow);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Response generation
  setTimeout(() => {
    typingRow.remove();

    const cleanQuery = query.toLowerCase().trim();
    let responseText = null;

    for (const [key, answer] of Object.entries(AI_LOANS_KNOWLEDGE)) {
      if (cleanQuery.includes(key.replace(/[?]/g, '')) || key.includes(cleanQuery)) {
        responseText = answer;
        break;
      }
    }

    if (!responseText) {
      if (cleanQuery.includes('personal')) {
        responseText = "A **Personal Loan** is an unsecured loan that does not require collateral. It provides fast access to funds with flexible tenures (1–5 years), ideal for planned purchases or urgent needs.";
      } else if (cleanQuery.includes('home')) {
        responseText = "A **Home Loan** is secured against real estate property. Tenures typically range up to 20–30 years, offering lower interest rates and tax deduction benefits on repayment.";
      } else if (cleanQuery.includes('education') || cleanQuery.includes('student')) {
        responseText = "An **Education Loan** covers college tuition, hostel fees, and equipment. Many lenders offer a moratorium period where repayment begins after course completion.";
      } else if (cleanQuery.includes('car') || cleanQuery.includes('vehicle') || cleanQuery.includes('auto')) {
        responseText = "A **Vehicle Loan** is secured against the purchased four-wheeler or two-wheeler. Tenures usually span between 3 and 7 years with competitive fixed rates.";
      } else {
        responseText = `Thanks for asking about "${escapeHTML(query)}"! In lending, reviewing interest rates, calculating monthly EMIs, and preparing KYC paperwork are the key foundational steps. Try our in-card **EMI Calculator** or select any topic to explore!`;
      }
    }

    const aiRow = document.createElement('div');
    aiRow.className = 'ai-chat-msg-row ai-incoming-msg';
    aiRow.innerHTML = `
      <div class="ai-msg-avatar-icon">✨</div>
      <div class="ai-msg-bubble">
        ${formatMarkdown(responseText)}
      </div>
    `;
    chatBody.appendChild(aiRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 500);
}

/* --------------------------------------------------------------------------
   8. MODALS & TRIGGER BINDINGS
   -------------------------------------------------------------------------- */
const LOAN_DETAILS_INFO = {
  personal: {
    title: "Personal Loan Journey",
    subtitle: "Flexible, collateral-free financing for planned or emergency needs.",
    features: [
      "**No Collateral Required**: Fast approval based on income and credit score.",
      "**Flexible Tenure**: Typically 1 to 5 years.",
      "**Multipurpose Use**: Suitable for medical expenses, travel, or consolidation."
    ],
    docs: [
      "PAN Card & Aadhaar / Identity Proof",
      "Current Residence Address Proof",
      "Last 3 Months Salary Slips & 6 Months Bank Statement"
    ],
    factors: [
      "CIBIL / Credit Score of 700+",
      "Employment Stability (1+ Year continuous service)",
      "Debt-to-Income / FOIR Ratio under 40-50%"
    ]
  },
  home: {
    title: "Home Loan Journey",
    subtitle: "Long-term financing for buying, constructing, or renovating property.",
    features: [
      "**Property as Collateral**: Secured loan backed by residential property.",
      "**Extended Tenure**: Up to 20–30 years for affordable monthly repayments.",
      "**Lower Interest Rates**: Secured nature ensures competitive rates."
    ],
    docs: [
      "PAN Card & Aadhaar Proof",
      "Property Sale Agreement, Title Deeds & NOC",
      "Approved Building Blueprint & Encumbrance Certificate",
      "2–3 Years ITR / Form 16"
    ],
    factors: [
      "Property Legal & Technical Valuation",
      "Long-term Income Stability",
      "Co-applicant Eligibility"
    ]
  },
  education: {
    title: "Education Loan Journey",
    subtitle: "Financing higher education, tuition, and living costs.",
    features: [
      "**Comprehensive Coverage**: Includes course tuition, accommodation, and exam fees.",
      "**Moratorium Period**: Repayment starts 6–12 months after course completion.",
      "**Tax Benefits**: Eligible for interest deductions under Section 80E."
    ],
    docs: [
      "Admission Letter from Recognized University / Institution",
      "Detailed Fee Schedule Breakdown",
      "Academic Marksheets & Test Scores",
      "Co-applicant PAN, Aadhaar & Income Proof"
    ],
    factors: [
      "Course & Institutional Accreditation",
      "Co-borrower Financial Profile",
      "Future Employability Potential"
    ]
  },
  car: {
    title: "Vehicle Loan Journey",
    subtitle: "Financing for new or pre-owned four-wheelers and two-wheelers.",
    features: [
      "**Vehicle as Collateral**: Hypothecated until full loan repayment.",
      "**Tenure Flexibility**: Typical tenure ranges between 3 and 7 years.",
      "**Competitive Rates**: Fixed monthly installments."
    ],
    docs: [
      "PAN Card & Aadhaar Proof",
      "Vehicle Proforma Invoice / Dealer Quotation",
      "3 Months Salary Slips & Bank Statements",
      "Valid Driving License"
    ],
    factors: [
      "Vehicle On-Road Valuation",
      "Credit Rating (700+ preferred)",
      "Down Payment Margin (10–20%)"
    ]
  }
};

function initModalsAndTriggers() {
  // Category cards click
  const catCards = document.querySelectorAll('.loan-cat-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-loan-type') || 'personal';
      openLoanDetailsModal(type);
    });
  });

  // Concept cards click
  const conceptCards = document.querySelectorAll('.concept-compact-card');
  conceptCards.forEach(card => {
    card.addEventListener('click', () => {
      const topic = card.getAttribute('data-topic');
      if (topic) openEduTopicModal(topic);
    });
  });

  // View Detailed Guide & View All Links
  const guideLink = document.getElementById('viewDetailedGuideLink');
  if (guideLink) {
    guideLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalDocChecklist');
    });
  }

  const allConceptsLink = document.getElementById('viewAllConceptsLink');
  if (allConceptsLink) {
    allConceptsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openEduTopicModal('interest');
    });
  }

  const allFaqsLink = document.getElementById('viewAllFaqsLink');
  if (allFaqsLink) {
    allFaqsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openEduTopicModal('emi');
    });
  }

  // Upload Document button in sidebar
  const sidebarUploadBtn = document.getElementById('sidebarUploadDocBtn');
  if (sidebarUploadBtn) {
    sidebarUploadBtn.addEventListener('click', () => {
      openModal('modalDocUpload');
    });
  }

  // Close modals
  const modals = document.querySelectorAll('.loans-modal-overlay');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.loans-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal.id));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => m.classList.remove('active'));
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function openLoanDetailsModal(type) {
  const data = LOAN_DETAILS_INFO[type] || LOAN_DETAILS_INFO.personal;
  const modal = document.getElementById('modalLoanDetail');
  if (!modal) return;

  const titleEl = document.getElementById('loanDetailModalTitle');
  const subEl = document.getElementById('loanDetailModalSubtitle');
  const featuresEl = document.getElementById('loanDetailFeaturesList');
  const docsEl = document.getElementById('loanDetailDocsList');
  const factorsEl = document.getElementById('loanDetailFactorsList');
  const askAiBtn = document.getElementById('loanDetailAskAiBtn');

  if (titleEl) titleEl.textContent = data.title;
  if (subEl) subEl.textContent = data.subtitle;

  if (featuresEl) {
    featuresEl.innerHTML = data.features.map(f => `<li>✓ ${formatMarkdown(f)}</li>`).join('');
  }
  if (docsEl) {
    docsEl.innerHTML = data.docs.map(d => `<li>📄 ${d}</li>`).join('');
  }
  if (factorsEl) {
    factorsEl.innerHTML = data.factors.map(f => `<li>• ${f}</li>`).join('');
  }

  if (askAiBtn) {
    askAiBtn.onclick = () => {
      closeModal('modalLoanDetail');
      const input = document.getElementById('loansAiInput');
      if (input) {
        input.value = `Tell me more about ${data.title}`;
        handleAiSendMessage(input.value);
      }
    };
  }

  openModal('modalLoanDetail');
}

function openEduTopicModal(topic) {
  const modal = document.getElementById('modalEduGeneral');
  if (!modal) return;

  const titleEl = document.getElementById('eduGeneralTitle');
  const descEl = document.getElementById('eduGeneralDesc');

  const topicsMap = {
    interest: {
      title: "Interest Rate Fundamentals",
      desc: "An interest rate is the proportion of a loan charged as interest to the borrower. Fixed interest rates guarantee unchanged monthly payments throughout your tenure. Floating rates adjust based on the central bank's benchmark repo rates."
    },
    emi: {
      title: "Understanding EMI & Amortization",
      desc: "Equated Monthly Installment (EMI) divides the total loan payment into monthly cycles. In the beginning, interest forms the largest component of your payment; over time, the principal share increases until the loan is fully settled."
    },
    tenure: {
      title: "Loan Tenure & Total Cost Impact",
      desc: "Tenure defines the repayment timeframe. Choosing a longer tenure lowers your monthly payment burden, but increases the cumulative total interest. A shorter tenure increases monthly payments but saves significantly on total interest."
    },
    fees: {
      title: "Processing Fees & Upfront Charges",
      desc: "Lenders collect administrative processing fees (usually 0.5% to 2% of the loan amount) to verify creditworthiness, conduct legal vetting, and prepare disbursement. Always review non-refundable clauses before payment."
    },
    eligibility: {
      title: "Key Eligibility Criteria",
      desc: "Financial institutions assess your repayment capability based on monthly in-hand income, credit history (CIBIL score of 700+), existing financial liabilities (FOIR ratio), and employment stability."
    },
    documents: {
      title: "Why Documentation Matters",
      desc: "Accurate identity, address, and financial paperwork establish authenticity, prevent fraud, and expedite loan sanctioning. Consistent names and details across documents prevent underwriting delays."
    }
  };

  const item = topicsMap[topic] || topicsMap.interest;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;

  openModal('modalEduGeneral');
}

/* --------------------------------------------------------------------------
   9. DOCUMENT ANALYZER & SCANNER PROTOTYPE
   -------------------------------------------------------------------------- */
function initDocAnalyzer() {
  const dropzone = document.getElementById('docDropzoneBox');
  const fileInput = document.getElementById('docFileInput');
  const sampleBtns = document.querySelectorAll('.doc-sample-btn');

  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateDocScan(files[0].name);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        simulateDocScan(fileInput.files[0].name);
      }
    });
  }

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const docName = btn.getAttribute('data-doc-name') || btn.textContent.trim();
      simulateDocScan(docName);
    });
  });
}

function simulateDocScan(docName) {
  const resultsBox = document.getElementById('docScanResultsBox');
  const scanDocName = document.getElementById('scanDocName');
  const scanSummary = document.getElementById('scanSummary');
  const scanClauses = document.getElementById('scanClauses');
  const scanTerms = document.getElementById('scanTerms');

  if (!resultsBox) return;

  resultsBox.classList.add('active');
  if (scanDocName) scanDocName.textContent = docName;
  if (scanSummary) scanSummary.textContent = "AI Scanning document structure and extracting key financial clauses...";
  if (scanClauses) scanClauses.innerHTML = "<em>Analyzing interest benchmark and prepayment terms...</em>";
  if (scanTerms) scanTerms.innerHTML = "<em>Simplifying terminology...</em>";

  setTimeout(() => {
    if (docName.toLowerCase().includes('sanction') || docName.toLowerCase().includes('offer')) {
      if (scanSummary) scanSummary.textContent = `Loan Sanction Letter identified for ${docName}.`;
      if (scanClauses) scanClauses.innerHTML = `
        <div class="doc-scan-item">✓ <strong>Interest Rate:</strong> 8.5% p.a. (Benchmark Linked Floating Rate).</div>
        <div class="doc-scan-item">✓ <strong>Prepayment Terms:</strong> Zero foreclosure penalty on floating rate loans.</div>
        <div class="doc-scan-item">✓ <strong>Processing Fee:</strong> 0.5% + GST deductible at disbursement.</div>
      `;
      if (scanTerms) scanTerms.innerHTML = `
        <div class="doc-scan-item">💡 <strong>Hypothecation:</strong> Vehicle/Asset pledged until loan clearance and NOC issuance.</div>
      `;
    } else if (docName.toLowerCase().includes('salary') || docName.toLowerCase().includes('slip')) {
      if (scanSummary) scanSummary.textContent = `Salary Slip identified for ${docName}.`;
      if (scanClauses) scanClauses.innerHTML = `
        <div class="doc-scan-item">✓ <strong>Net In-Hand Pay:</strong> Used by lenders to compute FOIR repayment eligibility.</div>
        <div class="doc-scan-item">✓ <strong>Deductions:</strong> PF and Tax TDS verified.</div>
      `;
      if (scanTerms) scanTerms.innerHTML = `
        <div class="doc-scan-item">💡 <strong>FOIR:</strong> Fixed Obligation to Income Ratio (recommended below 40–50%).</div>
      `;
    } else {
      if (scanSummary) scanSummary.textContent = `Financial Document analyzed: ${docName}.`;
      if (scanClauses) scanClauses.innerHTML = `
        <div class="doc-scan-item">✓ <strong>Repayment Mode:</strong> Monthly NACH / e-Mandate auto-debit.</div>
        <div class="doc-scan-item">✓ <strong>Notice Period:</strong> 30 days prior to bureau reporting.</div>
      `;
      if (scanTerms) scanTerms.innerHTML = `
        <div class="doc-scan-item">💡 <strong>Amortization:</strong> Full periodic timetable of principal and interest reduction.</div>
      `;
    }
  }, 600);
}

/* --------------------------------------------------------------------------
   10. HELPER UTILITIES
   -------------------------------------------------------------------------- */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}
