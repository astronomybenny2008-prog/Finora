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
  initSearchInteraction();
  initLoansAIChat();
  initJourneyTimeline();
  initLoanModals();
  initEMICalculator();
  initDocAnalyzer();
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
   2. SEARCH INTERACTION (Ctrl + K)
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
          // Open AI or knowledge search
          openModal('modalAiSearch');
          const aiInput = document.getElementById('loansAiInput');
          if (aiInput) {
            aiInput.value = query;
            handleAiSendMessage(query);
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. FINORA AI ASSISTANT CHAT COMPANION
   -------------------------------------------------------------------------- */
const AI_LOAN_KNOWLEDGE = {
  "what loan suits my needs?": {
    text: "To find the right loan, consider your goal:\n\n• **Personal Loan**: For flexible personal expenses or emergencies without collateral.\n• **Home Loan**: Long-term financing for buying or constructing property.\n• **Education Loan**: Dedicated support for tuition and study expenses with student-friendly terms.\n• **Car Loan**: Vehicle financing secured against the automobile.\n\nWhich of these matches your current goal?",
    chip: "I want to explore Home Loans"
  },
  "explain emi": {
    text: "An **EMI (Equated Monthly Installment)** is a fixed amount you pay back each month until your loan is cleared.\n\nIt consists of two parts:\n1. **Principal portion**: The actual borrowed amount you return.\n2. **Interest portion**: The cost of borrowing charged by the lender.\n\nIn the early years, a larger part of your EMI goes towards interest, and later towards principal!",
    chip: "Open EMI Calculator"
  },
  "what documents are required?": {
    text: "While exact requirements vary by lender, standard documentation commonly includes:\n\n1. **Proof of Identity**: Passport, Driver's License, or National ID.\n2. **Proof of Address**: Utility bills or rental agreements.\n3. **Income Proof**: Recent salary slips or bank statements (usually 3–6 months).\n4. **Tax Documents**: W-2, Form 16, or tax returns for self-employed individuals.\n\nWould you like to review the complete checklist?",
    chip: "View Document Checklist"
  },
  "explain interest": {
    text: "**Loan Interest** is the cost of borrowing money. Key things to understand:\n\n• **Fixed Rate**: Your interest rate and EMI remain constant throughout the tenure.\n• **Floating / Variable Rate**: The rate can adjust up or down based on market benchmarks.\n• **APR (Annual Percentage Rate)**: The true annual cost including interest and upfront processing fees.",
    chip: "Learn more on Interest Rates"
  }
};

function initLoansAIChat() {
  const form = document.getElementById('loansAiForm');
  const input = document.getElementById('loansAiInput');
  const chatBody = document.getElementById('loansAiChatBody');
  const chipButtons = document.querySelectorAll('.ai-quick-chip-btn');

  if (!form || !input || !chatBody) return;

  // Quick Action Buttons
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const intent = btn.getAttribute('data-intent') || btn.textContent.trim();
      let queryText = intent;

      if (intent.toLowerCase().includes('suits my needs')) {
        queryText = "What loan suits my needs?";
      } else if (intent.toLowerCase().includes('explain emi')) {
        queryText = "Can you explain EMI?";
      } else if (intent.toLowerCase().includes('documents')) {
        queryText = "What documents may be required?";
      } else if (intent.toLowerCase().includes('explain interest')) {
        queryText = "Can you explain how loan interest works?";
      } else if (intent.toLowerCase().includes('specific question')) {
        input.focus();
        input.placeholder = "Type your specific question here...";
        return;
      }

      input.value = queryText;
      handleAiSendMessage(queryText);
    });
  });

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
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'user-bubble-msg';
  userMsgEl.innerHTML = `<div class="user-bubble-content">${escapeHTML(query)}</div>`;
  chatBody.appendChild(userMsgEl);
  chatBody.scrollTop = chatBody.scrollHeight;

  if (input) input.value = '';

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'ai-bubble-msg typing-bubble';
  typingEl.innerHTML = `
    <div class="ai-bubble-avatar">🤖</div>
    <div class="ai-bubble-content">
      <em>Finora AI is typing...</em>
    </div>
  `;
  chatBody.appendChild(typingEl);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Generate response
  setTimeout(() => {
    typingEl.remove();
    const cleanKey = query.toLowerCase().trim();
    let responseData = null;

    for (const [key, data] of Object.entries(AI_LOAN_KNOWLEDGE)) {
      if (cleanKey.includes(key) || key.includes(cleanKey) || 
         (cleanKey.includes('emi') && key.includes('emi')) ||
         (cleanKey.includes('document') && key.includes('document')) ||
         (cleanKey.includes('interest') && key.includes('interest'))) {
        responseData = data;
        break;
      }
    }

    let responseText = "";
    if (responseData) {
      responseText = responseData.text;
    } else if (cleanKey.includes('home')) {
      responseText = "A **Home Loan** is tailored for residential purchase or renovation. Tenures usually range from 15 to 30 years, offering lower interest rates due to property collateral. Remember to factor in down payments (typically 10–20%)!";
    } else if (cleanKey.includes('personal')) {
      responseText = "A **Personal Loan** is an unsecured loan with no collateral required. It offers fast processing and flexible tenure (1–5 years), suitable for medical emergencies, planned purchases, or consolidating debt.";
    } else if (cleanKey.includes('car') || cleanKey.includes('auto') || cleanKey.includes('vehicle')) {
      responseText = "A **Car Loan** is a secured auto financing option where the vehicle acts as collateral. Typical tenures run from 3 to 7 years with competitive interest rates.";
    } else if (cleanKey.includes('education') || cleanKey.includes('student')) {
      responseText = "An **Education Loan** covers college tuition, hostel fees, and study equipment. Many institutions offer a moratorium period (repayment starts 6–12 months after course completion).";
    } else {
      responseText = `Thanks for asking about "${escapeHTML(query)}"! In a loan journey, understanding your eligibility, repayment capacity (EMI), and required documentation is key. Feel free to try our interactive **EMI Calculator** or ask for a specific loan type!`;
    }

    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'ai-bubble-msg';
    aiMsgEl.innerHTML = `
      <div class="ai-bubble-avatar">🤖</div>
      <div class="ai-bubble-content">${formatMarkdown(responseText)}</div>
    `;
    chatBody.appendChild(aiMsgEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE 5-STEP JOURNEY TIMELINE
   -------------------------------------------------------------------------- */
const JOURNEY_STEPS_DATA = [
  {
    step: "01",
    name: "Understand",
    badge: "Phase 1: Discovery",
    title: "Understanding Loan Types & Eligibility",
    desc: "Start by clarifying your exact financial requirement, whether you need a secured or unsecured loan, and understand how interest rates and loan tenures impact your monthly budget.",
    tip: "AI Guidance Tip: Compare Fixed vs Floating interest before making any commitments.",
    btnText: "Explore Loan Options",
    action: () => scrollToSection('exploreLoansSection')
  },
  {
    step: "02",
    name: "Prepare",
    badge: "Phase 2: Readiness",
    title: "Organize Necessary Documentation",
    desc: "Gather your identity proofs, address verification, recent 3–6 months bank statements, and income verification slips ahead of time to ensure a seamless experience.",
    tip: "AI Guidance Tip: Ensure your name and details match consistently across all identity documents.",
    btnText: "Open Document Checklist",
    action: () => openModal('modalDocChecklist')
  },
  {
    step: "03",
    name: "Apply",
    badge: "Phase 3: Application",
    title: "Submitting Your Loan Application",
    desc: "Complete the official application form with the authorized financial institution, providing verified details and required documentation accurately.",
    tip: "AI Guidance Tip: Review all fee disclosures including processing fees, administrative charges, and insurance riders.",
    btnText: "Understand Fees & Terms",
    action: () => openModal('modalEduFees')
  },
  {
    step: "04",
    name: "Track",
    badge: "Phase 4: Assessment",
    title: "Tracking Application Status & Verification",
    desc: "Follow the underwriting process, respond promptly to any additional document verification requests, and stay updated on your application status.",
    tip: "AI Guidance Tip: Lenders may perform credit bureau verification and physical or digital address checks during this stage.",
    btnText: "Ask AI About Underwriting",
    action: () => {
      const input = document.getElementById('loansAiInput');
      if (input) {
        input.value = "What happens during loan underwriting and tracking?";
        handleAiSendMessage(input.value);
      }
    }
  },
  {
    step: "05",
    name: "Proceed",
    badge: "Phase 5: Completion",
    title: "Reviewing Sanction Letter & Repayment Setup",
    desc: "Upon loan sanction, carefully read the sanction terms, understand the repayment schedule, and set up automated monthly EMI debits to maintain a healthy credit score.",
    tip: "AI Guidance Tip: Keep a digital copy of the sanction letter and loan agreement for future tax or prepayment references.",
    btnText: "Explore Repayment Basics",
    action: () => openModal('modalRepayment')
  }
];

function initJourneyTimeline() {
  const stepItems = document.querySelectorAll('.journey-step-item');
  const detailCard = document.getElementById('journeyStepDetailCard');
  if (!stepItems.length || !detailCard) return;

  stepItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      stepItems.forEach(s => s.classList.remove('active-step'));
      item.classList.add('active-step');
      updateJourneyDetail(index);
    });
  });

  // Action button inside detail card
  const detailBtn = document.getElementById('journeyDetailBtn');
  if (detailBtn) {
    detailBtn.addEventListener('click', () => {
      const currentActive = document.querySelector('.journey-step-item.active-step');
      const idx = currentActive ? parseInt(currentActive.getAttribute('data-step-index') || '0', 10) : 0;
      if (JOURNEY_STEPS_DATA[idx] && JOURNEY_STEPS_DATA[idx].action) {
        JOURNEY_STEPS_DATA[idx].action();
      }
    });
  }
}

function updateJourneyDetail(index) {
  const data = JOURNEY_STEPS_DATA[index];
  if (!data) return;

  const titleEl = document.getElementById('journeyDetailTitle');
  const textEl = document.getElementById('journeyDetailText');
  const btnEl = document.getElementById('journeyDetailBtn');
  const numEl = document.getElementById('journeyDetailStepNum');

  if (titleEl) titleEl.textContent = `${data.step} — ${data.title}`;
  if (textEl) textEl.textContent = `${data.desc} (${data.tip})`;
  if (btnEl) btnEl.textContent = data.btnText;
  if (numEl) numEl.textContent = data.step;
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE MODALS (Loan Details, Guides, Checklists)
   -------------------------------------------------------------------------- */
const LOAN_DETAILS_DATA = {
  personal: {
    title: "Personal Loan Journey",
    subtitle: "Flexible, uncollateralized financing for planned or emergency needs.",
    keyFeatures: [
      "**No Collateral Required**: Unsecured loan assessed on income and credit score.",
      "**Flexible Tenure**: Typically 1 to 5 years depending on repayment preference.",
      "**Quick Processing**: Often processed faster due to minimal physical asset verification.",
      "**Multipurpose Use**: Suitable for medical expenses, home improvements, or consolidation."
    ],
    commonDocs: ["Identity Proof (ID/Passport)", "Address Proof", "3 Months Salary Slips", "6 Months Bank Statements"],
    factors: ["Credit Score (typically 650+ preferred)", "Employment Stability", "Debt-to-Income (DTI) under 40-50%"],
    disclaimer: "Finora provides general guidance. Interest rates and approval terms depend on authorized lending institutions."
  },
  home: {
    title: "Home Loan Journey",
    subtitle: "Long-term financing for buying, constructing, or renovating residential property.",
    keyFeatures: [
      "**Property as Collateral**: Secured loan backed by the purchased real estate.",
      "**Extended Tenure**: Up to 20–30 years for manageable monthly EMIs.",
      "**Lower Interest Rates**: Secured nature usually enables competitive rate structures.",
      "**Down Payment (LTV)**: Lenders usually finance 75%–85% of the registered property value."
    ],
    commonDocs: ["Identity & Address Proof", "Property Title Deeds & Sale Agreement", "Approved Building Plan", "2 Years Tax Returns"],
    factors: ["Property Valuation & Legal Clearance", "Stable Long-term Income", "Co-applicant Eligibility Options"],
    disclaimer: "Finora provides educational guidance. Property legal validation must be completed by official lender experts."
  },
  education: {
    title: "Education Loan Journey",
    subtitle: "Empowering higher education, tuition, and living costs domestically or abroad.",
    keyFeatures: [
      "**Comprehensive Coverage**: Includes course fees, accommodation, exam fees, and travel.",
      "**Moratorium Period**: Repayment typically commences 6–12 months after course completion.",
      "**Tax Benefits**: Often eligible for interest deductions under tax guidelines.",
      "**Co-borrower Support**: Parents or guardians typically act as primary co-applicants."
    ],
    commonDocs: ["Admission Letter from Accredited Institution", "Fee Structure Breakdown", "Academic Records / Marksheets", "Co-applicant Income Proof"],
    factors: ["Accreditation of Institution & Course", "Co-borrower Credit Profile", "Future Employability Assessment"],
    disclaimer: "Finora provides conceptual information. Scholarship and institutional criteria vary widely."
  },
  car: {
    title: "Car Loan Journey",
    subtitle: "Vehicle financing for new or pre-owned four-wheelers.",
    keyFeatures: [
      "**Vehicle as Security**: The purchased vehicle is hypothecated until the loan is fully repaid.",
      "**Tenure Flexibility**: Typical tenure ranges between 3 and 7 years.",
      "**Fixed Interest Norm**: Most auto loans feature fixed monthly EMIs.",
      "**On-Road vs Ex-Showroom**: Confirm whether financing covers road tax and registration."
    ],
    commonDocs: ["Identity & Address Proof", "Vehicle Proforma Invoice / Dealer Quote", "Income Statements (3–6 Months)", "Driving License"],
    factors: ["Vehicle Valuation", "Credit Rating", "Down Payment Amount (10–20% common)"],
    disclaimer: "Finora is a hackathon prototype. Car dealer tie-ups and rates are determined by authorized lenders."
  }
};

function initLoanModals() {
  // Option Card Clicks
  const optionCards = document.querySelectorAll('.loan-option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const loanType = card.getAttribute('data-loan-type') || 'personal';
      openLoanDetailModal(loanType);
    });
  });

  // Helpful Tools Cards Clicks
  const toolEmiCard = document.getElementById('toolEmiCard');
  if (toolEmiCard) {
    toolEmiCard.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalEmiCalculator');
    });
  }

  const toolEligibilityCard = document.getElementById('toolEligibilityCard');
  if (toolEligibilityCard) {
    toolEligibilityCard.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalEligibilityGuide');
    });
  }

  const toolDocChecklistCard = document.getElementById('toolDocChecklistCard');
  if (toolDocChecklistCard) {
    toolDocChecklistCard.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalDocChecklist');
    });
  }

  const toolRepaymentCard = document.getElementById('toolRepaymentCard');
  if (toolRepaymentCard) {
    toolRepaymentCard.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalRepayment');
    });
  }

  // Watch Guide Button
  const watchGuideBtn = document.getElementById('watchGuideBtn');
  if (watchGuideBtn) {
    watchGuideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalWatchGuide');
    });
  }

  // Educational Concept Cards Clicks
  const eduConceptCards = document.querySelectorAll('.edu-concept-card');
  eduConceptCards.forEach(card => {
    card.addEventListener('click', () => {
      const topic = card.getAttribute('data-topic');
      if (topic) {
        openEduTopicModal(topic);
      }
    });
  });

  // Modal Close buttons & overlay clicks
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

  // Esc key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
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

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openLoanDetailModal(loanType) {
  const data = LOAN_DETAILS_DATA[loanType] || LOAN_DETAILS_DATA.personal;
  const modal = document.getElementById('modalLoanDetail');
  if (!modal) return;

  const titleEl = document.getElementById('loanDetailModalTitle');
  const subEl = document.getElementById('loanDetailModalSubtitle');
  const featuresEl = document.getElementById('loanDetailFeaturesList');
  const docsEl = document.getElementById('loanDetailDocsList');
  const factorsEl = document.getElementById('loanDetailFactorsList');

  if (titleEl) titleEl.textContent = data.title;
  if (subEl) subEl.textContent = data.subtitle;

  if (featuresEl) {
    featuresEl.innerHTML = data.keyFeatures.map(f => `<li>${formatMarkdown(f)}</li>`).join('');
  }
  if (docsEl) {
    docsEl.innerHTML = data.commonDocs.map(d => `<li>✓ ${d}</li>`).join('');
  }
  if (factorsEl) {
    factorsEl.innerHTML = data.factors.map(f => `<li>• ${f}</li>`).join('');
  }

  // Connect "Ask AI about this loan" button
  const askAiBtn = document.getElementById('loanDetailAskAiBtn');
  if (askAiBtn) {
    askAiBtn.onclick = () => {
      closeModal('modalLoanDetail');
      const input = document.getElementById('loansAiInput');
      if (input) {
        input.value = `Tell me more about the journey for a ${data.title}`;
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

  const topicTitles = {
    interest: "Interest Rate Fundamentals",
    emi: "Understanding EMI & Amortization",
    tenure: "How Loan Tenure Impacts Your Total Cost",
    fees: "Processing Fees & Hidden Charges",
    eligibility: "Loan Eligibility Factors Decoded",
    documents: "Why Documentation Matters in Lending"
  };

  const topicDescs = {
    interest: "An interest rate is the percentage charged by lenders on the borrowed principal amount. It represents the cost of using the lender's funds. Fixed rates remain constant throughout your loan tenure, protecting you from rate hikes, whereas floating or variable rates fluctuate with benchmark economic interest rates.",
    emi: "Equated Monthly Installment (EMI) is the regular payment made by a borrower to a lender at a specified date each month. Each EMI is divided into interest payment and principal repayment. In the early tenure, interest forms the largest chunk of the EMI, while towards the end, principal repayment dominates.",
    tenure: "Loan tenure is the duration granted to repay the entire loan. Longer tenure (e.g. 20-30 years) reduces your monthly EMI burden, making it easier to manage cashflow, but increases the cumulative total interest paid. Shorter tenure increases monthly EMI but significantly cuts overall interest expense.",
    fees: "Processing fees cover the administrative expenses incurred by the financial institution to underwrite, verify credit credentials, inspect legal documentation, and manage loan disbursement. Always check whether processing fees are refundable and compare the overall Annual Percentage Rate (APR).",
    eligibility: "Lenders look at repayment ability, credit score (700+ is usually favorable), age, employment stability, monthly disposable income, and Debt-to-Income (DTI) ratio before approving a loan. Keeping your debt obligations below 40% of your income enhances eligibility.",
    documents: "Documentation establishes your legal identity, place of residence, proof of income, and creditworthiness. Accurate documentation prevents identity fraud, expedites loan sanctioning, and ensures regulatory compliance with financial authorities."
  };

  if (titleEl) titleEl.textContent = topicTitles[topic] || "Financial Concept";
  if (descEl) descEl.textContent = topicDescs[topic] || "Explore and understand key financial concepts with Finora AI.";

  openModal('modalEduGeneral');
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE EMI CALCULATOR ENGINE
   -------------------------------------------------------------------------- */
function initEMICalculator() {
  const amountSlider = document.getElementById('emiAmountSlider');
  const amountVal = document.getElementById('emiAmountVal');
  const rateSlider = document.getElementById('emiRateSlider');
  const rateVal = document.getElementById('emiRateVal');
  const tenureSlider = document.getElementById('emiTenureSlider');
  const tenureVal = document.getElementById('emiTenureVal');

  const displayEmi = document.getElementById('calcResultEmi');
  const displayPrincipal = document.getElementById('calcResultPrincipal');
  const displayInterest = document.getElementById('calcResultInterest');
  const displayTotal = document.getElementById('calcResultTotal');

  if (!amountSlider || !rateSlider || !tenureSlider) return;

  function calculate() {
    const P = parseFloat(amountSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const tenureYears = parseFloat(tenureSlider.value);

    // Monthly interest rate
    const r = (annualRate / 12) / 100;
    // Total months
    const n = tenureYears * 12;

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Update displays
    if (amountVal) amountVal.textContent = `$${P.toLocaleString()}`;
    if (rateVal) rateVal.textContent = `${annualRate.toFixed(1)}%`;
    if (tenureVal) tenureVal.textContent = `${tenureYears} ${tenureYears === 1 ? 'Year' : 'Years'}`;

    if (displayEmi) displayEmi.textContent = `$${Math.round(emi).toLocaleString()}/mo`;
    if (displayPrincipal) displayPrincipal.textContent = `$${Math.round(P).toLocaleString()}`;
    if (displayInterest) displayInterest.textContent = `$${Math.round(totalInterest).toLocaleString()}`;
    if (displayTotal) displayTotal.textContent = `$${Math.round(totalPayment).toLocaleString()}`;
  }

  amountSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);
  tenureSlider.addEventListener('input', calculate);

  // Initial calculation
  calculate();
}

/* --------------------------------------------------------------------------
   7. AI DOCUMENT ASSISTANCE & ANALYZER PROTOTYPE
   -------------------------------------------------------------------------- */
function initDocAnalyzer() {
  const dropzone = document.getElementById('docDropzoneBox');
  const fileInput = document.getElementById('docFileInput');
  const sampleBtns = document.querySelectorAll('.doc-sample-btn');
  const resultsBox = document.getElementById('docScanResultsBox');

  if (!dropzone) return;

  // Drag events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
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

  // Temporary analyzing feedback
  resultsBox.classList.add('active');
  if (scanDocName) scanDocName.textContent = docName;
  if (scanSummary) scanSummary.textContent = "AI Scanning document structure and extracting key clauses...";
  if (scanClauses) scanClauses.innerHTML = "<em>Analyzing interest benchmark, prepayment penalty, and tenure clauses...</em>";
  if (scanTerms) scanTerms.innerHTML = "<em>Simplifying financial terminology...</em>";

  setTimeout(() => {
    if (docName.toLowerCase().includes('sanction') || docName.toLowerCase().includes('offer')) {
      if (scanSummary) scanSummary.textContent = `Loan Sanction Letter identified for ${docName}. Demonstrates formal pre-approval with conditional terms.`;
      if (scanClauses) scanClauses.innerHTML = `
        <div class="doc-scan-item">✓ <strong>Interest Rate Clause:</strong> Fixed at 8.5% p.a. for first 24 months, subject to benchmark revision thereafter.</div>
        <div class="doc-scan-item">✓ <strong>Prepayment Terms:</strong> Zero foreclosure penalty on floating rate loans after 12 active EMIs.</div>
        <div class="doc-scan-item">✓ <strong>Processing Fee:</strong> 0.5% + statutory taxes deductible at disbursement.</div>
      `;
      if (scanTerms) scanTerms.innerHTML = `
        <div class="doc-scan-item">💡 <strong>Hypothecation:</strong> Vehicle/Asset remains pledged to the bank until full clearance.</div>
        <div class="doc-scan-item">💡 <strong>Moratorium:</strong> A grace period where principal payments are deferred.</div>
      `;
    } else if (docName.toLowerCase().includes('salary') || docName.toLowerCase().includes('slip') || docName.toLowerCase().includes('income')) {
      if (scanSummary) scanSummary.textContent = `Income Statement identified for ${docName}. Shows regular net monthly cash flow.`;
      if (scanClauses) scanClauses.innerHTML = `
        <div class="doc-scan-item">✓ <strong>Gross vs Net Pay:</strong> Lenders typically compute repayment eligibility on Net In-Hand Income.</div>
        <div class="doc-scan-item">✓ <strong>Statutory Deductions:</strong> Tax withholdings and retirement contributions verified.</div>
      `;
      if (scanTerms) scanTerms.innerHTML = `
        <div class="doc-scan-item">💡 <strong>DTI (Debt-to-Income):</strong> Percentage of monthly earnings dedicated to recurring debt obligations.</div>
      `;
    } else {
      if (scanSummary) scanSummary.textContent = `Standard Financial Document analyzed: ${docName}. All key obligations highlighted.`;
      if (scanClauses) scanClauses.innerHTML = `
        <div class="doc-scan-item">✓ <strong>Repayment Obligation:</strong> Monthly debit on specified due date. Late charges apply past 5 days grace.</div>
        <div class="doc-scan-item">✓ <strong>Default Notice Period:</strong> 30-day written communication before adverse credit bureau reporting.</div>
      `;
      if (scanTerms) scanTerms.innerHTML = `
        <div class="doc-scan-item">💡 <strong>Amortization Schedule:</strong> Complete periodic timetable showing principal and interest split.</div>
      `;
    }
  }, 700);
}

/* --------------------------------------------------------------------------
   8. HELPER UTILITIES
   -------------------------------------------------------------------------- */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

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
