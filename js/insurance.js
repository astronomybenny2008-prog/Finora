/**
 * ==========================================================================
 * FINORA — INSURANCE PAGE INTERACTIVE ENGINE
 * File: /js/insurance.js
 * Project: Finora - AI-Powered Financial Journeys
 * Hackathon Prototype Edition 2026
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSearchInteraction();
  initInsuranceAIChat();
  initJourneyTimeline();
  initInsuranceModals();
  initTerminologyCards();
  initDocScanner();
  initPolicyAnatomy();
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
          const aiInput = document.getElementById('insAiInput');
          if (aiInput) {
            aiInput.value = query;
            handleInsuranceAiMessage(query);
            aiInput.value = '';
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. FINORA AI INSURANCE CONVERSATIONAL COMPANION
   -------------------------------------------------------------------------- */
const AI_KNOWLEDGE_BASE = {
  "what is insurance": `Insurance is a risk management agreement where you pay a regular fee (**Premium**) to an authorised insurance company. In exchange, the insurer promises to financially protect you or your family against unexpected losses, hospitalisation expenses (e.g. ₹5 Lakhs to ₹1 Crore), accidents, or damages.`,
  
  "explain premium": `A **Premium** is the specific amount of money you pay (monthly, quarterly, or annually, e.g. ₹8,500/year) to keep your insurance policy active. If you stop paying premiums within the grace period, coverage lapses.`,
  
  "what does coverage mean": `**Coverage** (or Scope of Protection) outlines exactly which medical conditions, accidents, natural perils, or loss events the insurer will pay for under your policy. It also defines your maximum sum insured (e.g. ₹10 Lakhs).`,
  
  "what is an exclusion": `An **Exclusion** is a specific event, health condition, or hazard that is **explicitly NOT covered**. Common examples include non-medical hospital consumables, cosmetic surgery, and undeclared pre-existing illnesses during initial waiting periods.`,
  
  "how does a claim work": `A **Claim** is when you ask the insurance company to pay for an insured event. In India, health claims can be **Cashless** (network hospital settles directly with TPA) or **Reimbursement** (you pay upfront and submit bills + discharge summary within 15–30 days).`,
  
  "explain this policy term": `Insurance documents have key parameters: **Sum Insured** (max payout), **Deductible / Co-pay** (your out-of-pocket share, e.g. ₹5,000 or 10%), **Waiting Period** (moratorium before coverage starts), and **Renewal Date**. Tell me which specific term you would like to explore!`,

  "health insurance": `**Health Insurance** protects you against high hospitalisation costs. In India, a comprehensive individual or family floater plan typically covers room rent, ICU, doctor fees, pre/post-hospitalisation (30/60 days), and day-care procedures up to the chosen Sum Insured (e.g. ₹10 Lakhs to ₹50 Lakhs).`,

  "life insurance": `**Life Insurance** (especially Pure Term Insurance) provides a guaranteed financial death benefit (Sum Assured, e.g. ₹1 Crore) to your designated nominees if you pass away during the policy term, ensuring your family's living expenses, loans, and children's education are protected.`,

  "vehicle insurance": `**Vehicle Insurance** includes mandatory **Third-Party Liability** (mandated by the Motor Vehicles Act) and optional **Own Damage (Comprehensive)** cover protecting your vehicle against accidents, theft, fire, and natural disasters.`,

  "home insurance": `**Home Insurance** covers the physical structure of your building (against fire, earthquake, floods) and its household contents (appliances, furniture, jewellery) against burglary or electrical breakdown.`,

  "waiting period": `The **Waiting Period** is the time before coverage activates. Standard terms: 30 days for general illness (accidents covered Day 1), 24 months for specific treatments (like hernia or cataract), and 2 to 4 years for pre-existing diseases (like diabetes or hypertension).`,

  "deductible": `A **Deductible** is the initial threshold you agree to pay from your own pocket per claim or per policy year before the insurer pays the remaining bill. For instance, with a ₹10,000 deductible on a ₹1,00,000 claim, you pay ₹10,000 and the insurer pays ₹90,000.`
};

function initInsuranceAIChat() {
  const form = document.getElementById('insAiForm');
  const input = document.getElementById('insAiInput');
  const quickChips = document.querySelectorAll('.ai-quick-chip-btn');
  const termAskBtns = document.querySelectorAll('.ins-term-ai-btn');
  const explainerAskBtns = document.querySelectorAll('.btn-explainer-ask');
  const askAiPolicyBtn = document.getElementById('askAiPolicyBtn');

  // Quick Action Chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const intent = chip.getAttribute('data-intent');
      if (input) {
        input.value = intent;
        handleInsuranceAiMessage(intent);
        input.value = '';
      }
    });
  });

  // Term cards "Ask Finora AI" buttons
  termAskBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const termQuery = btn.getAttribute('data-ask-term') || 'Explain this insurance term';
      if (input) {
        input.value = termQuery;
        handleInsuranceAiMessage(termQuery);
        input.value = '';
        scrollToAiCard();
      }
    });
  });

  // Explainer Ask Button
  explainerAskBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-ask-explainer') || 'Explain policy wording in detail';
      handleInsuranceAiMessage(q);
      scrollToAiCard();
    });
  });

  // Policy anatomy button
  if (askAiPolicyBtn) {
    askAiPolicyBtn.addEventListener('click', () => {
      handleInsuranceAiMessage('Explain standard policy schedule sections and conditions');
      scrollToAiCard();
    });
  }

  // Form Submit
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = input.value.trim();
      if (!userText) return;
      handleInsuranceAiMessage(userText);
      input.value = '';
    });
  }
}

function handleInsuranceAiMessage(userText) {
  const chatBody = document.getElementById('insAiChatBody');
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
  typingBubble.id = 'aiTypingIndicator';
  typingBubble.innerHTML = `
    <div class="ai-bubble-avatar">🤖</div>
    <div class="ai-bubble-content">
      <em>Finora AI is analyzing insurance concepts...</em>
    </div>
  `;
  chatBody.appendChild(typingBubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 3. Generate Simulated AI response
  setTimeout(() => {
    const typing = document.getElementById('aiTypingIndicator');
    if (typing) typing.remove();

    const responseText = getAiResponseForQuery(userText);
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

function getAiResponseForQuery(query) {
  const normalized = query.toLowerCase();
  
  for (const [key, answer] of Object.entries(AI_KNOWLEDGE_BASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return answer;
    }
  }

  // Smart fallback
  if (normalized.includes('rupee') || normalized.includes('cost') || normalized.includes('price')) {
    return `In India, insurance costs vary widely. For example, a 30-year-old non-smoker can secure a ₹1 Crore Term Life cover for around ₹8,000–₹12,000/year, while a ₹10 Lakhs Family Health plan typically ranges from ₹14,000–₹22,000/year depending on city zone and medical history.`;
  }

  if (normalized.includes('claim')) {
    return AI_KNOWLEDGE_BASE["how does a claim work"];
  }

  if (normalized.includes('tax') || normalized.includes('80c') || normalized.includes('80d')) {
    return `In India, premiums paid for Health Insurance are eligible for tax deductions under **Section 80D** (up to ₹25,000 for self/family, and an additional ₹50,000 for senior citizen parents). Term Life premiums qualify under **Section 80C** (up to ₹1.5 Lakhs).`;
  }

  return `Here is what you should know about "${escapeHtml(query)}": In the insurance journey, understanding the precise definitions, deductibles, waiting periods, and exclusions is essential before purchasing. Would you like me to explain how this applies to Health, Life, Vehicle, or Home insurance?`;
}

function scrollToAiCard() {
  const aiCard = document.querySelector('.ins-ai-card');
  if (aiCard) {
    aiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* --------------------------------------------------------------------------
   4. JOURNEY TIMELINE (5-STEP INTERACTION)
   -------------------------------------------------------------------------- */
const JOURNEY_STEPS_DATA = [
  {
    step: "01",
    title: "01 — Understand What Insurance Is & What You Want to Protect",
    text: "Identify your core protection priorities: medical emergencies for family, life security for dependents, vehicle liability, or asset protection for home. Understanding what risks you want to safeguard against prevents under-insuring or over-paying.",
    tip: "AI Guidance: Rule of thumb in India for Term Life cover is 10–15x your annual income, while Health cover should adequately match healthcare inflation.",
    btnText: "Explore Protection Types"
  },
  {
    step: "02",
    title: "02 — Explore Coverage Concepts & Policy Features",
    text: "Explore base sum insured, room-rent sub-limits, super top-ups, restoration benefits, cashless hospital networks, zero depreciation for vehicles, and critical illness riders.",
    tip: "AI Guidance: Always look for 'No Room Rent Capping' in health policies to avoid proportionate deduction penalties during claim settlement.",
    btnText: "Explore Key Terms"
  },
  {
    step: "03",
    title: "03 — Compare Relevant Features & Conditions",
    text: "Review policy wordings side-by-side. Differentiate between premium cost and actual benefits, co-payments, waiting periods for specific ailments, and claim settlement ratios (CSR).",
    tip: "AI Guidance: Do not choose insurance based on the cheapest premium alone. Low waiting periods and wide network hospitals provide better peace of mind.",
    btnText: "Compare with Finora AI"
  },
  {
    step: "04",
    title: "04 — Choose Carefully & Declare Accurate Information",
    text: "Review pre-policy medical checkup requirements, declare existing medical history honestly (utmost good faith principle), and verify nominee details before final policy issuance.",
    tip: "AI Guidance: Full disclosure of smoking habits and existing conditions prevents future claim rejections under Section 45 of the Insurance Act.",
    btnText: "Understand Policy Checklist"
  },
  {
    step: "05",
    title: "05 — Manage Your Policy & Know How to Claim",
    text: "Store your e-insurance account (eIA) details, download TPA health cards, understand cashless vs reimbursement workflows, and keep emergency helpline numbers handy.",
    tip: "AI Guidance: For planned hospitalisation, intimate the insurer 48 hours prior; for emergency admissions, intimate within 24 hours of hospitalisation.",
    btnText: "View Claim Process"
  }
];

function initJourneyTimeline() {
  const stepButtons = document.querySelectorAll('.ins-journey-step');
  const detailNum = document.getElementById('insDetailStepNum');
  const detailTitle = document.getElementById('insDetailTitle');
  const detailText = document.getElementById('insDetailText');
  const detailTip = document.getElementById('insDetailTip');
  const detailBtn = document.getElementById('insDetailActionBtn');

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepIndex = parseInt(btn.getAttribute('data-step-index') || '0', 10);
      
      // Update Active State
      stepButtons.forEach((b) => {
        b.classList.remove('active-step');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active-step');
      btn.setAttribute('aria-selected', 'true');

      // Update Detail Content
      const data = JOURNEY_STEPS_DATA[stepIndex] || JOURNEY_STEPS_DATA[0];
      if (detailNum) detailNum.textContent = data.step;
      if (detailTitle) detailTitle.textContent = data.title;
      if (detailText) detailText.textContent = data.text;
      if (detailTip) {
        detailTip.innerHTML = `
          <span class="ins-tip-icon">💡</span>
          <span class="ins-tip-text">${data.tip}</span>
        `;
      }
      if (detailBtn) detailBtn.textContent = data.btnText;
    });
  });

  if (detailBtn) {
    detailBtn.addEventListener('click', () => {
      const activeStep = document.querySelector('.ins-journey-step.active-step');
      const idx = activeStep ? parseInt(activeStep.getAttribute('data-step-index') || '0', 10) : 0;
      
      if (idx === 0) {
        document.getElementById('exploreSection')?.scrollIntoView({ behavior: 'smooth' });
      } else if (idx === 1) {
        document.getElementById('terminologySection')?.scrollIntoView({ behavior: 'smooth' });
      } else if (idx === 2) {
        handleInsuranceAiMessage('How do I compare two health insurance policies?');
        scrollToAiCard();
      } else if (idx === 3) {
        openTerminologyModal('policy');
      } else {
        document.getElementById('claimJourneySection')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. TERMINOLOGY GRID & MODAL DEEP DIVE
   -------------------------------------------------------------------------- */
const TERMINOLOGY_DETAILS = {
  premium: {
    icon: "💳",
    title: "Premium",
    definition: "The amount a policyholder pays periodically to the insurer to maintain active insurance coverage under the agreed contractual terms.",
    example: "For a ₹10 Lakhs Family Floater Health Insurance policy, Mr. Sharma pays an annual premium of ₹14,500 (approx ₹1,200/month).",
    watchout: "Ensure premium payments are completed before the 30-day grace period expires to prevent policy lapse and loss of accumulated waiting period credits."
  },
  coverage: {
    icon: "🛡️",
    title: "Coverage",
    definition: "The exact scope of risks, illnesses, damages, or liabilities that the insurance company promises to financially reimburse.",
    example: "A Comprehensive Motor policy provides coverage against own vehicle collision damage, third-party bodily injury, theft, and flood damage.",
    watchout: "Always verify sub-limits (e.g. ICU charges or specific surgical procedure limits) within the overall sum insured."
  },
  policy: {
    icon: "📄",
    title: "Policy",
    definition: "The formal legal contract between the insured customer and the insurance company, specifying terms, benefits, clauses, and duties.",
    example: "Your 10-page Policy Schedule details your policy number, sum insured, insured members' ages, start date, and endorsements.",
    watchout: "Every Indian insurance policy comes with a 15–30 day 'Free Look Period' during which you can review and return the policy for a refund if unsatisfied."
  },
  claim: {
    icon: "📝",
    title: "Claim",
    definition: "A formal request made by the policyholder requesting the insurer to provide financial compensation or direct settlement for a covered loss.",
    example: "Following an emergency appendix surgery costing ₹85,000, Priya filed a cashless claim at an empanelled network hospital.",
    watchout: "Always notify the insurer/TPA within the prescribed intimation timeline (24 to 48 hours) to prevent claim processing delays."
  },
  deductible: {
    icon: "💰",
    title: "Deductible & Co-pay",
    definition: "The upfront out-of-pocket amount the policyholder agrees to pay before the insurance company pays the remaining balance.",
    example: "If your policy has a ₹5,000 deductible and the repair bill is ₹35,000, you pay ₹5,000 and the insurer pays ₹30,000.",
    watchout: "Opting for a voluntary deductible reduces your annual premium, but make sure the out-of-pocket threshold is easily affordable in an emergency."
  },
  exclusion: {
    icon: "🚫",
    title: "Exclusion",
    definition: "Specific medical conditions, events, or damages that are expressly not covered by the insurance policy under any circumstances.",
    example: "Standard health policies exclude cosmetic surgeries, self-inflicted injuries, and non-medical consumables like PPE kits and registration fees.",
    watchout: "Always read the 'Permanent Exclusions' table in the policy schedule so you aren't surprised during claim time."
  },
  waiting_period: {
    icon: "⏳",
    title: "Waiting Period",
    definition: "The mandatory initial time window after policy issuance during which specific illnesses or pre-existing conditions are not yet covered.",
    example: "Cataract surgeries usually carry a 2-year specific waiting period; pre-existing diabetes often carries a 24 to 36 month waiting period.",
    watchout: "Accidents are covered from Day 1. Only standard illnesses and declared pre-existing diseases carry initial moratorium periods."
  },
  sum_insured: {
    icon: "🎯",
    title: "Sum Insured & Sum Assured",
    definition: "The maximum guaranteed financial compensation the insurer will disburse in a single policy year for covered claims.",
    example: "If you have a ₹15 Lakhs Sum Insured, the insurer will reimburse covered medical bills up to a cumulative ₹15 Lakhs in that year.",
    watchout: "Consider purchasing Super Top-Up policies to expand your effective coverage (e.g. ₹50 Lakhs cover with a ₹10 Lakhs deductible) for a nominal additional cost."
  },
  policy_term: {
    icon: "📅",
    title: "Policy Term",
    definition: "The designated period of time for which the insurance policy remains valid, active, and enforceable.",
    example: "A Term Life insurance policy may have a 30-year term (covering age 30 to age 60), while Health and Car policies are typically 1-year terms.",
    watchout: "Opting for multi-year health policies (2–3 years) often locks in premium discounts of 7.5% to 15%."
  },
  renewal: {
    icon: "🔄",
    title: "Renewal & No Claim Bonus (NCB)",
    definition: "The process of continuing policy coverage for another term upon paying the premium, maintaining continuous coverage benefits.",
    example: "For every claim-free year in Health or Car insurance, you earn a Cumulative Bonus (NCB) that increases your coverage by 10%–50% without extra cost.",
    watchout: "A policy lapse beyond 30 days breaks your continuity benefits, resetting all accumulated waiting periods back to zero."
  }
};

function initTerminologyCards() {
  const termCards = document.querySelectorAll('.ins-term-card');
  const viewAllBtn = document.getElementById('viewAllTermsBtn');
  const explainPolicyTermBtn = document.getElementById('explainPolicyTermBtn');

  termCards.forEach((card) => {
    card.addEventListener('click', () => {
      const termKey = card.getAttribute('data-term-key');
      if (termKey && TERMINOLOGY_DETAILS[termKey]) {
        openTerminologyModal(termKey);
      }
    });
  });

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      openTerminologyModal('premium');
    });
  }

  if (explainPolicyTermBtn) {
    explainPolicyTermBtn.addEventListener('click', () => {
      openTerminologyModal('coverage');
    });
  }
}

function openTerminologyModal(termKey) {
  const modal = document.getElementById('modalTermDetail');
  const data = TERMINOLOGY_DETAILS[termKey] || TERMINOLOGY_DETAILS['premium'];
  if (!modal || !data) return;

  const iconEl = document.getElementById('termModalIcon');
  const titleEl = document.getElementById('termModalTitle');
  const defEl = document.getElementById('termModalDefinition');
  const exEl = document.getElementById('termModalExample');
  const watchEl = document.getElementById('termModalWatchout');
  const askBtn = document.getElementById('termAskAiBtn');

  if (iconEl) iconEl.textContent = data.icon;
  if (titleEl) titleEl.textContent = data.title;
  if (defEl) defEl.textContent = data.definition;
  if (exEl) exEl.textContent = data.example;
  if (watchEl) watchEl.textContent = data.watchout;

  if (askBtn) {
    askBtn.onclick = () => {
      closeAllModals();
      handleInsuranceAiMessage(`Explain the insurance term "${data.title}" with more examples`);
      scrollToAiCard();
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* --------------------------------------------------------------------------
   6. INSURANCE CATEGORY DEEP DIVES (HEALTH, LIFE, VEHICLE, HOME)
   -------------------------------------------------------------------------- */
const CATEGORY_DETAILS = {
  health: {
    icon: "🛡️",
    title: "Health Insurance Journey",
    subtitle: "Medical, Hospitalization & Critical Illness Protection",
    covered: [
      "Inpatient hospitalization expenses (room rent, nursing, ICU, doctor fees exceeding 24 hours)",
      "Pre-hospitalization (up to 30–60 days) and Post-hospitalization expenses (up to 90–180 days)",
      "Day-care procedures (dialysis, cataract, chemotherapy not requiring 24h admission)",
      "Road ambulance charges and annual health check-ups",
      "Cashless settlement across thousands of network hospitals in India"
    ],
    exclusions: [
      "Initial 30-day moratorium period for non-accidental hospitalisation",
      "Pre-existing illnesses until completion of 24–48 months continuous coverage",
      "Cosmetic, aesthetic, or gender transformation surgeries",
      "Non-medical hospital consumables (gloves, masks, administrative charges)"
    ],
    docs: [
      "Valid Government ID & Aadhaar / PAN card",
      "Doctor's initial prescription and diagnosis report",
      "Hospital discharge summary and itemized original hospital bills & pharmacy receipts",
      "Investigation reports (blood tests, MRI, CT scans, X-rays)"
    ]
  },
  life: {
    icon: "👥",
    title: "Life Insurance Journey",
    subtitle: "Term Life, Family Security & Nominee Protection",
    covered: [
      "Guaranteed lump-sum death benefit (Sum Assured, e.g. ₹1 Crore to ₹2 Crore) to designated nominees",
      "Coverage against accidental death and terminal illness diagnosis (with add-on riders)",
      "Waiver of premium benefit in case of critical permanent disability",
      "Tax exemptions on maturity/death payouts under Section 10(10D)"
    ],
    exclusions: [
      "Suicide within the first 12 months of policy issuance or revival",
      "Death resulting from participation in criminal acts or breach of law",
      "Active participation in war, military combat, or uncertified hazardous aviation"
    ],
    docs: [
      "Identity proof (PAN card, Passport, Voter ID)",
      "Income proof (Last 3 months salary slips / Form 16 / Last 3 years ITR)",
      "Bank statements for preceding 6 months",
      "Medical checkup records & tele-medical underwriting evaluation"
    ]
  },
  vehicle: {
    icon: "🚗",
    title: "Vehicle Insurance Journey",
    subtitle: "Motor, Two-Wheeler & Commercial Vehicle Coverage",
    covered: [
      "Mandatory Third-Party Liability for bodily injury, death, and property damage of others",
      "Own Damage (OD) cover against accidental crash, overturned vehicle, fire, and explosion",
      "Protection against natural disasters (floods, cyclones, earthquakes) and theft",
      "Zero Depreciation (Bumper-to-Bumper) add-on eliminating age-based parts depreciation"
    ],
    exclusions: [
      "Driving without a valid driving license or under the influence of alcohol/intoxicants",
      "Normal wear and tear, mechanical/electrical breakdown, and engine seizure due to hydrostatic lock (unless engine protect add-on taken)",
      "Consequential damages and driving outside specified geographic territory"
    ],
    docs: [
      "Vehicle Registration Certificate (RC)",
      "Previous year policy copy and No Claim Bonus (NCB) certificate",
      "Driving License of the registered driver",
      "FIR copy (in case of theft, third-party injury, or major highway accident)"
    ]
  },
  home: {
    icon: "🏠",
    title: "Home Insurance Journey",
    subtitle: "Building Structure & Household Content Shield",
    covered: [
      "Building structure coverage against fire, lightning, explosion, earthquake, and floods",
      "Household contents (televisions, refrigerators, air conditioners, furniture) against burglary and theft",
      "Alternative accommodation expenses if property becomes uninhabitable due to covered disaster",
      "Public liability protection against injury to third parties within the premises"
    ],
    exclusions: [
      "Damage due to deliberate destruction, willful negligence, or unapproved illegal construction",
      "Wear and tear, rust, gradual atmospheric deterioration, or termite infestation",
      "Loss of cash, bullion, or unregistered antique art unless specifically scheduled and valued"
    ],
    docs: [
      "Property ownership proof (Sale Deed, Title Deed, or registered Lease Agreement)",
      "Estimated carpet/built-up area construction valuation document",
      "Inventory list of high-value household appliances and valuables with purchase invoices"
    ]
  }
};

function initInsuranceModals() {
  const optionCards = document.querySelectorAll('.ins-option-card');
  const knowledgeCards = document.querySelectorAll('.ins-knowledge-card');
  const claimCards = document.querySelectorAll('.ins-claim-step-card');
  const closeTermBtn = document.getElementById('closeTermModal');
  const closeCategoryBtn = document.getElementById('closeInsCategoryModal');

  // Option Cards Click (Health, Life, Vehicle, Home)
  optionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-ins-type');
      if (type && CATEGORY_DETAILS[type]) {
        openCategoryModal(type);
      }
    });
  });

  // Knowledge Cards Click
  knowledgeCards.forEach((card) => {
    card.addEventListener('click', () => {
      const topic = card.getAttribute('data-knowledge-topic');
      if (topic === 'basics') openTerminologyModal('coverage');
      else if (topic === 'coverage') openTerminologyModal('sum_insured');
      else if (topic === 'policy_vs_premium') openTerminologyModal('premium');
      else if (topic === 'claims') openTerminologyModal('claim');
      else if (topic === 'terms') openTerminologyModal('deductible');
      else openTerminologyModal('policy');
    });
  });

  // Claim process card click
  claimCards.forEach((card) => {
    card.addEventListener('click', () => {
      const step = card.getAttribute('data-claim-step');
      handleInsuranceAiMessage(`Explain step "${step}" in the insurance claim process with tips`);
      scrollToAiCard();
    });
  });

  // Close Buttons
  if (closeTermBtn) {
    closeTermBtn.addEventListener('click', closeAllModals);
  }

  if (closeCategoryBtn) {
    closeCategoryBtn.addEventListener('click', closeAllModals);
  }

  // Close on Backdrop Click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('ins-modal-overlay')) {
      closeAllModals();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openCategoryModal(type) {
  const modal = document.getElementById('modalInsDetail');
  const data = CATEGORY_DETAILS[type];
  if (!modal || !data) return;

  const iconEl = document.getElementById('insCategoryModalIcon');
  const titleEl = document.getElementById('insDetailModalTitle');
  const subEl = document.getElementById('insDetailModalSubtitle');
  const coveredList = document.getElementById('insModalCoveredList');
  const exclusionsList = document.getElementById('insModalExclusionsList');
  const docsList = document.getElementById('insModalDocsList');
  const askBtn = document.getElementById('insCategoryAskAiBtn');

  if (iconEl) iconEl.textContent = data.icon;
  if (titleEl) titleEl.textContent = data.title;
  if (subEl) subEl.textContent = data.subtitle;

  if (coveredList) {
    coveredList.innerHTML = data.covered.map(item => `<li>${item}</li>`).join('');
  }

  if (exclusionsList) {
    exclusionsList.innerHTML = data.exclusions.map(item => `<li>${item}</li>`).join('');
  }

  if (docsList) {
    docsList.innerHTML = data.docs.map(item => `<li>${item}</li>`).join('');
  }

  if (askBtn) {
    askBtn.onclick = () => {
      closeAllModals();
      handleInsuranceAiMessage(`Tell me everything I should know before choosing ${data.title}`);
      scrollToAiCard();
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.ins-modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   7. DOCUMENT ASSISTANCE SCANNER & SIMULATED AI OCR
   -------------------------------------------------------------------------- */
const SAMPLE_DOC_ANALYSIS = {
  "Health_Optima_Schedule.pdf": {
    name: "Health_Optima_Schedule.pdf",
    summary: "Health Insurance Schedule with ₹10,00,000 Base Sum Insured and ₹50,00,000 Super Top-up rider.",
    clauses: [
      "✓ Base Sum Insured: ₹10,00,000 (Individual Floater)",
      "✓ Pre-existing Disease Waiting Period: 24 Months",
      "✓ Room Rent Limit: No Sub-limit / Single Private Room",
      "✓ Cashless Hospital Network: 14,000+ Empanelled Facilities"
    ],
    questions: [
      "❓ Verify if non-medical consumables (PPE, syringes) are covered via a Care Shield add-on rider.",
      "❓ Check if cumulative No Claim Bonus (NCB) transfers from your previous insurer."
    ]
  },
  "Motor_Insurance_Schedule.pdf": {
    name: "Motor_Insurance_Schedule.pdf",
    summary: "Comprehensive Private Car Policy Package with Zero-Depreciation and 50% No Claim Bonus.",
    clauses: [
      "✓ Insured Declared Value (IDV): ₹7,80,000",
      "✓ Third-Party Property Damage: Covered up to ₹7,50,000",
      "✓ Compulsory Deductible: ₹1,000 per claim",
      "✓ Zero Depreciation & Engine Protector Add-ons Active"
    ],
    questions: [
      "❓ Verify key replacement and roadside assistance (RSA) coverage limit.",
      "❓ Confirm cashless garage tie-ups within your 15km city radius."
    ]
  },
  "Term_Life_Policy_Wording.pdf": {
    name: "Term_Life_Policy_Wording.pdf",
    summary: "Pure Term Life Insurance Agreement with ₹1,50,00,000 (1.5 Crore) Death Benefit.",
    clauses: [
      "✓ Sum Assured on Death: ₹1,50,00,000",
      "✓ Policy Tenure: 35 Years (Valid up to age 65)",
      "✓ Premium Payment Term: Regular Annual Pay (₹14,200/yr)",
      "✓ Critical Illness Accelerated Rider: ₹25,00,000"
    ],
    questions: [
      "❓ Confirm nominee percentage allocation (100% Spouse).",
      "❓ Check if terminal illness diagnosis triggers accelerated payout."
    ]
  }
};

function initDocScanner() {
  const dropzone = document.getElementById('insDocDropzoneBox');
  const fileInput = document.getElementById('insDocFileInput');
  const resultsBox = document.getElementById('insDocScanResultsBox');
  const sampleBtns = document.querySelectorAll('.doc-sample-btn');
  const sideTrigger = document.getElementById('sideUploadTrigger');

  if (dropzone && fileInput) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-active');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processUploadedFile(e.dataTransfer.files[0].name);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processUploadedFile(e.target.files[0].name);
      }
    });
  }

  sampleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const docName = btn.getAttribute('data-doc-name');
      processUploadedFile(docName);
    });
  });

  if (sideTrigger) {
    sideTrigger.addEventListener('click', () => {
      document.getElementById('docAssistanceSection')?.scrollIntoView({ behavior: 'smooth' });
      processUploadedFile('Health_Optima_Schedule.pdf');
    });
  }
}

function processUploadedFile(filename) {
  const resultsBox = document.getElementById('insDocScanResultsBox');
  const docNameEl = document.getElementById('insScanDocName');
  const summaryEl = document.getElementById('insScanSummary');
  const clausesEl = document.getElementById('insScanClauses');
  const questionsEl = document.getElementById('insScanQuestions');

  if (!resultsBox) return;

  const data = SAMPLE_DOC_ANALYSIS[filename] || {
    name: filename || "Uploaded_Policy_Document.pdf",
    summary: `Finora AI has scanned "${filename || 'Document'}". Extracted standard policy schedule parameters and key health/claim conditions.`,
    clauses: [
      "✓ Detected Sum Insured & Annual Premium schedule",
      "✓ Identified Initial Waiting Period & Pre-existing disease moratorium",
      "✓ Verified Cashless Network TPA contact coordinates"
    ],
    questions: [
      "❓ What is the exact deductible amount for inpatient hospitalization?",
      "❓ Are room-rent proportionate deductions applicable on this plan?"
    ]
  };

  if (docNameEl) docNameEl.textContent = data.name;
  if (summaryEl) summaryEl.textContent = data.summary;
  
  if (clausesEl) {
    clausesEl.innerHTML = `
      <h4 class="ins-modal-section-title ins-title-margin-top">Key Clauses Identified:</h4>
      <ul class="ins-modal-list">
        ${data.clauses.map(c => `<li>${c}</li>`).join('')}
      </ul>
    `;
  }

  if (questionsEl) {
    questionsEl.innerHTML = `
      <h4 class="ins-modal-section-title ins-title-margin-top">Smart Questions to Ask Your Insurer:</h4>
      <ul class="ins-modal-list">
        ${data.questions.map(q => `<li>${q}</li>`).join('')}
      </ul>
    `;
  }

  resultsBox.classList.add('active');
  resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --------------------------------------------------------------------------
   8. POLICY ANATOMY INTERACTIVE INSPECTION
   -------------------------------------------------------------------------- */
function initPolicyAnatomy() {
  const sectionItems = document.querySelectorAll('.ins-policy-section-item');
  
  sectionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const secName = item.getAttribute('data-section-name') || 'Coverage';
      handleInsuranceAiMessage(`Explain the "${secName}" section in an insurance policy document`);
      scrollToAiCard();
    });
  });
}

/* --------------------------------------------------------------------------
   9. SMOOTH SCROLLING
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

/* Utility Helper */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
