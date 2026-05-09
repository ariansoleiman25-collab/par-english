// ===== STATE =====
let currentSection = 'mcq';
let currentIndex = 0;
let userAnswers = new Array(mcqQuestions.length).fill(null);
let answeredStatus = new Array(mcqQuestions.length).fill(null); // 'correct' or 'wrong'
let fillAnswers = {};
let isStudyMode = false;
let timerInterval = null;
let seconds = 0;
let isReviewMode = false;
let studyRevealed = new Array(mcqQuestions.length).fill(false);

const $ = id => document.getElementById(id);
const screens = document.querySelectorAll('.screen');
const sectionTabs = document.querySelectorAll('.section-tab');

// ===== HERO PARTICLES =====
function createParticles() {
    const hero = $('hero');
    if (!hero || hero.querySelector('.particle')) return;
    const particleCount = 18;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = (3 + Math.random() * 5) + 'px';
        p.style.height = p.style.width;
        p.style.animationDelay = (Math.random() * 8) + 's';
        p.style.animationDuration = (10 + Math.random() * 14) + 's';
        p.style.opacity = (0.15 + Math.random() * 0.25);
        hero.appendChild(p);
    }
}

// ===== SCREENS =====
function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    setTimeout(() => {
        $(id).classList.add('active');
        $(id).scrollTo(0, 0);
        window.scrollTo(0, 0);
        if (id === 'hero') {
            triggerHeroAnimations();
        }
    }, 50);
}

// Hero staggered animations
function triggerHeroAnimations() {
    const hero = $('hero');
    if (!hero) return;
    const badge = hero.querySelector('.hero-badge');
    const title = hero.querySelector('.hero-title');
    const subtitle = hero.querySelector('.hero-subtitle');
    const stats = hero.querySelector('.hero-stats');
    const actions = hero.querySelector('.hero-actions');
    const elements = [badge, title, subtitle, stats, actions].filter(Boolean);

    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.filter = 'blur(6px)';
        el.style.transition = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.transition = `opacity 0.7s cubic-bezier(.22,.61,.36,1) ${i * 0.12}s, transform 0.7s cubic-bezier(.22,.61,.36,1) ${i * 0.12}s, filter 0.7s cubic-bezier(.22,.61,.36,1) ${i * 0.12}s`;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.filter = 'blur(0)';
            });
        });
    });

    // Stat cards bounce-in
    const statCards = hero.querySelectorAll('.stat-card');
    statCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px) scale(0.92)';
        card.style.transition = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.style.transition = `opacity 0.6s cubic-bezier(.22,.61,.36,1) ${0.4 + i * 0.1}s, transform 0.6s cubic-bezier(.34,1.56,.64,1) ${0.4 + i * 0.1}s`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    });

    // Buttons slide-up
    const buttons = hero.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach((btn, i) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px) scale(0.96)';
        btn.style.transition = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                btn.style.transition = `opacity 0.55s cubic-bezier(.22,.61,.36,1) ${0.65 + i * 0.1}s, transform 0.55s cubic-bezier(.34,1.56,.64,1) ${0.65 + i * 0.1}s`;
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });
    });
}

// ===== TIMER =====
function startTimer() {
    seconds = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        $('timerDisplay').textContent = `${m}:${s}`;
    }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }

function toKurdish(n) {
    const d = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(n).split('').map(c => d[+c] || c).join('');
}

// ===== RENDER MCQ =====
function renderMCQ() {
    const q = mcqQuestions[currentIndex];
    const letters = ['A', 'B', 'C', 'D'];
    const selected = userAnswers[currentIndex];
    const status = answeredStatus[currentIndex];
    const isAnswered = status !== null;
    const isRevealed = studyRevealed[currentIndex];

    let optionsHTML = '';

    if (isStudyMode) {
        // STUDY MODE: Click selects, then reveal shows correct answer
        optionsHTML = q.o.map((opt, i) => {
            let cls = 'option-btn';
            if (isRevealed) {
                if (i === q.a) cls += ' correct';
                else if (selected === i && i !== q.a) cls += ' wrong';
                else cls += ' disabled-opt';
            } else if (selected === i) {
                cls += ' selected';
            }
            return `<button class="${cls}" data-index="${i}" ${isRevealed ? 'disabled' : ''}>
                <span class="option-letter">${letters[i]}</span>
                <span>${opt}</span>
            </button>`;
        }).join('');
    } else {
        // EXAM MODE: Auto-grade on click
        optionsHTML = q.o.map((opt, i) => {
            let cls = 'option-btn';
            if (isAnswered) {
                if (i === q.a) cls += ' correct';
                else if (selected === i && i !== q.a) cls += ' wrong';
                else cls += ' disabled-opt';
            } else if (selected === i) {
                cls += ' selected';
            }
            return `<button class="${cls}" data-index="${i}" ${isAnswered ? 'disabled' : ''}>
                <span class="option-letter">${letters[i]}</span>
                <span>${opt}</span>
            </button>`;
        }).join('');
    }

    // Feedback section
    let feedbackHTML = '';
    if (isStudyMode) {
        if (isRevealed) {
            const wasCorrect = selected === q.a;
            if (selected !== null) {
                if (wasCorrect) {
                    feedbackHTML = `<div class="feedback-msg correct-fb feedback-cascade">
                        <span class="fb-icon">✅</span>
                        <span>Correct! Well done.</span>
                    </div>`;
                } else {
                    feedbackHTML = `<div class="feedback-msg wrong-fb feedback-cascade">
                        <span class="fb-icon">❌</span>
                        <span>Wrong — the correct answer is <strong>${letters[q.a]}. ${q.o[q.a]}</strong></span>
                    </div>`;
                }
            } else {
                feedbackHTML = `<div class="feedback-msg correct-fb feedback-cascade">
                    <span class="fb-icon">💡</span>
                    <span>The answer is <strong>${letters[q.a]}. ${q.o[q.a]}</strong></span>
                </div>`;
            }
            feedbackHTML += `<div class="auto-next feedback-cascade" style="animation-delay:.12s">بۆ پرسیاری دواتر کلیک لە "دواتر" بکە</div>`;
        } else {
            // Show answer button
            feedbackHTML = `<button class="show-answer-btn study-reveal-btn" id="revealAnswerBtn">
                <span class="reveal-icon">👁️</span>
                <span>پیشاندانی وەڵام</span>
            </button>`;
        }
    } else {
        // Exam mode feedback
        if (isAnswered) {
            if (status === 'correct') {
                feedbackHTML = `<div class="feedback-msg correct-fb feedback-cascade">
                    <span class="fb-icon">✅</span>
                    <span>Correct! Well done.</span>
                </div>`;
            } else {
                feedbackHTML = `<div class="feedback-msg wrong-fb feedback-cascade">
                    <span class="fb-icon">❌</span>
                    <span>Wrong — the correct answer is <strong>${letters[q.a]}. ${q.o[q.a]}</strong></span>
                </div>`;
            }
            feedbackHTML += `<div class="auto-next feedback-cascade" style="animation-delay:.12s">بۆ پرسیاری دواتر کلیک لە "دواتر" بکە</div>`;
        }
    }

    // Study mode indicator
    const modeIndicator = isStudyMode ?
        `<div class="study-mode-badge">
            <span class="study-mode-icon">📖</span>
            <span>مۆدی خوێندنەوە</span>
        </div>` : '';

    $('questionContainer').innerHTML = `
        <div class="question-card${isStudyMode ? ' study-card' : ''}">
            ${modeIndicator}
            <div class="question-number">Question ${currentIndex + 1} of ${mcqQuestions.length}</div>
            <div class="question-text">${q.q}</div>
            <div class="options-list">${optionsHTML}</div>
            ${feedbackHTML}
        </div>`;

    // Staggered option animation
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, i) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(16px)';
        btn.style.transition = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                btn.style.transition = `opacity 0.4s cubic-bezier(.22,.61,.36,1) ${i * 0.06}s, transform 0.4s cubic-bezier(.22,.61,.36,1) ${i * 0.06}s, background 0.28s var(--ease), border-color 0.28s var(--ease), box-shadow 0.28s var(--ease)`;
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            });
        });
    });

    // Event listeners
    if (isStudyMode) {
        if (!isRevealed) {
            // In study mode, clicking an option just selects it
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    userAnswers[currentIndex] = idx;
                    // Add tactile select animation
                    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    animateSelect(btn);
                });
            });

            // Reveal answer button
            const revealBtn = $('revealAnswerBtn');
            if (revealBtn) {
                revealBtn.addEventListener('click', () => {
                    studyRevealed[currentIndex] = true;
                    renderMCQ();
                    updateDots();
                });
            }
        }
    } else {
        // Exam mode: auto-grade on click
        if (!isAnswered) {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    userAnswers[currentIndex] = idx;
                    answeredStatus[currentIndex] = (idx === q.a) ? 'correct' : 'wrong';
                    
                    // Quick select animation before re-render
                    animateSelect(btn);
                    setTimeout(() => {
                        renderMCQ();
                        updateDots();
                        updateProgress();
                        updateSubmitVisibility();
                    }, 180);
                });
            });
        }
    }
}

// Tactile select micro-animation
function animateSelect(btn) {
    btn.style.transition = 'transform 0.15s cubic-bezier(.34,1.56,.64,1)';
    btn.style.transform = 'scale(0.97)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

// ===== RENDER FILL =====
function renderFill() {
    let html = '';

    // Study mode indicator
    const modeIndicator = isStudyMode ?
        `<div class="study-mode-badge" style="margin-bottom:16px;">
            <span class="study-mode-icon">📖</span>
            <span>مۆدی خوێندنەوە</span>
        </div>` : '';

    fillQuestions.forEach((fq, fi) => {
        let wordsHTML = fq.words.map(w => `<span class="word-tag">${w}</span>`).join('');
        let itemsHTML = fq.items.map((item, ii) => {
            const key = `${fi}-${ii}`;
            const val = fillAnswers[key] || '';
            const checkedKey = `fill-checked-${key}`;
            const wasChecked = window[checkedKey] || false;
            let inputCls = 'fill-input';
            let feedbackHTML = '';
            let statusIcon = '';

            if (isReviewMode || (isStudyMode && studyRevealed[mcqQuestions.length + fi])) {
                // Review or study-revealed: show final status
                const ok = val.trim().toLowerCase() === item.answer.toLowerCase();
                inputCls += ok ? ' correct-input' : ' wrong-input';
                statusIcon = ok
                    ? '<span class="fill-status-icon correct-icon">✓</span>'
                    : '<span class="fill-status-icon wrong-icon">✗</span>';
                feedbackHTML = `<div class="fill-feedback show ${ok ? 'fill-fb-correct' : 'fill-fb-wrong'}">
                    <span>${ok ? '✓ ڕاستە!' : '✗ هەڵەیە —'}</span>
                    ${!ok ? `<strong>${item.answer}</strong>` : ''}
                </div>`;
            } else if (wasChecked && val.trim()) {
                // Live-checked: show instant feedback
                const ok = val.trim().toLowerCase() === item.answer.toLowerCase();
                inputCls += ok ? ' correct-input' : ' wrong-input';
                statusIcon = ok
                    ? '<span class="fill-status-icon correct-icon">✓</span>'
                    : '<span class="fill-status-icon wrong-icon">✗</span>';
                feedbackHTML = `<div class="fill-feedback show ${ok ? 'fill-fb-correct' : 'fill-fb-wrong'}">
                    <span>${ok ? '✓ ڕاستە!' : '✗ هەڵەیە — وەڵامی ڕاست:'}</span>
                    ${!ok ? `<strong>${item.answer}</strong>` : ''}
                </div>`;
            }

            return `<div class="fill-item">
                <span class="fill-number">${ii + 1}</span>
                <span class="fill-text">${item.text}</span>
                <div class="fill-input-wrapper">
                    <div class="fill-input-row">
                        <input type="text" class="${inputCls}" data-key="${key}" data-answer="${item.answer}" data-fi="${fi}" data-ii="${ii}" value="${val}" placeholder="وەڵام بنووسە..." autocomplete="off" autocapitalize="off" ${isReviewMode ? 'disabled' : ''}>
                        ${statusIcon}
                    </div>
                    ${feedbackHTML}
                </div>
            </div>`;
        }).join('');

        let studyRevealBtn = '';
        if (isStudyMode && !studyRevealed[mcqQuestions.length + fi]) {
            studyRevealBtn = `<button class="show-answer-btn study-reveal-btn fill-reveal-btn" data-fill-index="${fi}">
                <span class="reveal-icon">👁️</span>
                <span>پیشاندانی وەڵامەکان</span>
            </button>`;
        }

        html += `<div class="question-card${isStudyMode ? ' study-card' : ''}">
            ${fi === 0 ? modeIndicator : ''}
            <div class="fill-section-title">${fq.title}</div>
            <div class="word-box">${wordsHTML}</div>
            ${itemsHTML}
            ${studyRevealBtn}
        </div>`;
    });
    $('questionContainer').innerHTML = html;

    // Event listeners for fill inputs
    if (!isReviewMode) {
        document.querySelectorAll('.fill-input').forEach(input => {
            // Save as user types
            input.addEventListener('input', e => {
                const key = e.target.dataset.key;
                fillAnswers[key] = e.target.value;
                // If previously checked, re-check live
                const checkedKey = `fill-checked-${key}`;
                if (window[checkedKey]) {
                    checkFillInput(e.target);
                }
                updateProgress();
                updateSubmitVisibility();
            });

            // Validate on blur (when user taps out)
            input.addEventListener('blur', e => {
                if (e.target.value.trim()) {
                    const key = e.target.dataset.key;
                    window[`fill-checked-${key}`] = true;
                    checkFillInput(e.target);
                }
            });

            // Validate on Enter
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.target.value.trim()) {
                        const key = e.target.dataset.key;
                        window[`fill-checked-${key}`] = true;
                        checkFillInput(e.target);
                        // Move focus to next input
                        const allInputs = [...document.querySelectorAll('.fill-input:not(:disabled)')];
                        const idx = allInputs.indexOf(e.target);
                        if (idx < allInputs.length - 1) {
                            allInputs[idx + 1].focus();
                        } else {
                            e.target.blur();
                        }
                    }
                }
            });
        });
    }

    // Study mode reveal buttons for fill sections
    if (isStudyMode) {
        document.querySelectorAll('.fill-reveal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const fi = parseInt(btn.dataset.fillIndex);
                studyRevealed[mcqQuestions.length + fi] = true;
                renderFill();
            });
        });
    }
}

// Live validation for a single fill input
function checkFillInput(input) {
    const answer = input.dataset.answer;
    const val = input.value.trim();
    const ok = val.toLowerCase() === answer.toLowerCase();
    const wrapper = input.closest('.fill-input-wrapper');
    if (!wrapper) return;

    // Update input classes
    input.classList.remove('correct-input', 'wrong-input');
    input.classList.add(ok ? 'correct-input' : 'wrong-input');

    // Update status icon
    const row = wrapper.querySelector('.fill-input-row');
    let icon = row.querySelector('.fill-status-icon');
    if (icon) icon.remove();
    const iconEl = document.createElement('span');
    iconEl.className = `fill-status-icon ${ok ? 'correct-icon' : 'wrong-icon'}`;
    iconEl.textContent = ok ? '✓' : '✗';
    row.appendChild(iconEl);

    // Update feedback
    let fb = wrapper.querySelector('.fill-feedback');
    if (fb) fb.remove();
    const fbEl = document.createElement('div');
    fbEl.className = `fill-feedback show ${ok ? 'fill-fb-correct' : 'fill-fb-wrong'} feedback-cascade`;
    fbEl.innerHTML = ok
        ? '<span>✓ ڕاستە!</span>'
        : `<span>✗ هەڵەیە — وەڵامی ڕاست:</span> <strong>${answer}</strong>`;
    wrapper.appendChild(fbEl);

    // Animate the input
    input.style.transition = 'transform 0.2s cubic-bezier(.34,1.56,.64,1)';
    input.style.transform = 'scale(0.97)';
    setTimeout(() => { input.style.transform = 'scale(1)'; }, 200);
}

// ===== RENDER =====
function renderCurrent() {
    if (currentSection === 'mcq') {
        renderMCQ();
        updateNav();
        updateDots();
        updateProgress();
    } else {
        renderFill();
        $('prevBtn').classList.add('hidden');
        $('nextBtn').classList.add('hidden');
        $('questionDots').classList.add('hidden');
    }
    updateSubmitVisibility();
}

function updateNav() {
    $('prevBtn').disabled = currentIndex === 0;
    $('prevBtn').classList.remove('hidden');
    $('nextBtn').classList.remove('hidden');
    $('questionDots').classList.remove('hidden');
    $('nextBtn').disabled = currentIndex === mcqQuestions.length - 1;
    $('currentQ').textContent = toKurdish(currentIndex + 1);
}

function updateProgress() {
    let answered;
    if (isStudyMode) {
        answered = studyRevealed.filter(r => r).length;
    } else {
        answered = userAnswers.filter(a => a !== null).length + Object.keys(fillAnswers).filter(k => fillAnswers[k].trim()).length;
    }
    const total = mcqQuestions.length + fillQuestions.reduce((s, f) => s + f.items.length, 0);
    $('progressBar').style.width = (answered / total * 100) + '%';
}

function updateDots() {
    let html = '';
    const start = Math.max(0, currentIndex - 4);
    const end = Math.min(mcqQuestions.length, start + 9);
    for (let i = start; i < end; i++) {
        let cls = 'q-dot';
        if (i === currentIndex) cls += ' active';
        else if (isStudyMode) {
            if (studyRevealed[i]) cls += ' answered';
        } else {
            if (answeredStatus[i] === 'correct') cls += ' answered';
            else if (answeredStatus[i] === 'wrong') cls += ' wrong-dot';
        }
        html += `<div class="${cls}" data-qi="${i}"></div>`;
    }
    $('questionDots').innerHTML = html;
    document.querySelectorAll('.q-dot').forEach(dot => {
        dot.addEventListener('click', () => { currentIndex = parseInt(dot.dataset.qi); renderCurrent(); });
    });
}

function updateSubmitVisibility() {
    if (isStudyMode || isReviewMode) { $('submitArea').classList.add('hidden'); return; }
    const a = userAnswers.filter(x => x !== null).length;
    (a > 0 || Object.keys(fillAnswers).length > 0) ? $('submitArea').classList.remove('hidden') : $('submitArea').classList.add('hidden');
}

// ===== SCORE =====
function calculateScore() {
    let correct = 0, wrong = 0, skip = 0;
    mcqQuestions.forEach((q, i) => {
        if (userAnswers[i] === null) skip++;
        else if (userAnswers[i] === q.a) correct++;
        else wrong++;
    });
    fillQuestions.forEach((fq, fi) => {
        fq.items.forEach((item, ii) => {
            const v = (fillAnswers[`${fi}-${ii}`] || '').trim().toLowerCase();
            if (!v) skip++;
            else if (v === item.answer.toLowerCase()) correct++;
            else wrong++;
        });
    });
    return { correct, wrong, skip };
}

function showResults() {
    stopTimer();
    const { correct, wrong, skip } = calculateScore();
    const total = correct + wrong + skip;
    const pct = Math.round((correct / total) * 100);
    showScreen('results');
    $('correctCount').textContent = correct;
    $('wrongCount').textContent = wrong;
    $('skipCount').textContent = skip;
    const offset = 339.292 - (pct / 100) * 339.292;
    setTimeout(() => { $('scoreRing').style.strokeDashoffset = offset; }, 300);
    let cur = 0;
    const step = Math.max(1, Math.floor(pct / 40));
    const counter = setInterval(() => { cur += step; if (cur >= pct) { cur = pct; clearInterval(counter); } $('scorePercent').textContent = cur; }, 30);
    if (pct >= 80) { $('scoreRing').style.stroke = 'var(--green)'; $('resultsIcon').textContent = '🎉'; $('resultsTitle').textContent = 'زۆر باشە! ئافەرین!'; }
    else if (pct >= 50) { $('scoreRing').style.stroke = 'var(--orange)'; $('resultsIcon').textContent = '👍'; $('resultsTitle').textContent = 'باشە! بەردەوام بە!'; }
    else { $('scoreRing').style.stroke = 'var(--red)'; $('resultsIcon').textContent = '💪'; $('resultsTitle').textContent = 'هەوڵی زیاتر بدە!'; }
}

function showReview() {
    isReviewMode = true;
    showScreen('review');
    const letters = ['A', 'B', 'C', 'D'];
    let html = '<h3 class="review-section-title">بەشی یەکەم: هەڵبژاردن</h3>';
    mcqQuestions.forEach((q, i) => {
        const sel = userAnswers[i];
        const ok = sel === q.a;
        const cls = sel === null ? '' : (ok ? 'review-correct' : 'review-wrong');
        const badge = sel === null ? '<span class="review-badge" style="background:var(--glass);color:var(--t3)">Skipped</span>' : (ok ? '<span class="review-badge">✓ Correct</span>' : '<span class="review-badge">✗ Wrong</span>');
        let opts = q.o.map((o, j) => {
            let c = 'option-btn';
            if (j === q.a) c += ' correct';
            else if (sel === j && j !== q.a) c += ' wrong';
            else c += ' disabled-opt';
            return `<button class="${c}" disabled><span class="option-letter">${letters[j]}</span><span>${o}</span></button>`;
        }).join('');
        html += `<div class="review-card ${cls}"><${badge}<div class="question-number">Question ${i + 1}</div><div class="question-text">${q.q}</div><div class="options-list">${opts}</div></div>`;
    });
    html += '<h3 class="review-section-title">بەشی دووەم: پڕکردنەوە</h3>';
    fillQuestions.forEach((fq, fi) => {
        let items = fq.items.map((item, ii) => {
            const k = `${fi}-${ii}`;
            const v = (fillAnswers[k] || '').trim();
            const ok = v.toLowerCase() === item.answer.toLowerCase();
            const ic = !v ? 'fill-input' : (ok ? 'fill-input correct-input' : 'fill-input wrong-input');
            return `<div class="fill-item"><span class="fill-number">${ii + 1}</span><span class="fill-text">${item.text}</span><div><input type="text" class="${ic}" value="${v || '—'}" disabled><div class="fill-answer show">✓ ${item.answer}</div></div></div>`;
        }).join('');
        html += `<div class="review-card"><div class="fill-section-title">${fq.title}</div>${items}</div>`;
    });
    $('reviewContainer').innerHTML = html;
}

function resetExam() {
    currentIndex = 0;
    currentSection = 'mcq';
    userAnswers = new Array(mcqQuestions.length).fill(null);
    answeredStatus = new Array(mcqQuestions.length).fill(null);
    fillAnswers = {};
    isStudyMode = false;
    isReviewMode = false;
    studyRevealed = new Array(mcqQuestions.length + fillQuestions.length).fill(false);
    sectionTabs.forEach(t => t.classList.remove('active'));
    sectionTabs[0].classList.add('active');
}

// ===== EVENTS =====
$('startExamBtn').addEventListener('click', () => {
    resetExam();
    $('examTimer').classList.remove('hidden');
    document.body.classList.remove('study-active');
    showScreen('exam');
    startTimer();
    renderCurrent();
});

$('studyModeBtn').addEventListener('click', () => {
    resetExam();
    isStudyMode = true;
    $('examTimer').classList.add('hidden');
    $('submitArea').classList.add('hidden');
    document.body.classList.add('study-active');
    showScreen('exam');
    renderCurrent();
});

$('backToHome').addEventListener('click', () => {
    stopTimer();
    document.body.classList.remove('study-active');
    $('examTimer').classList.remove('hidden');
    showScreen('hero');
});

$('prevBtn').addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderCurrent(); } });
$('nextBtn').addEventListener('click', () => { if (currentIndex < mcqQuestions.length - 1) { currentIndex++; renderCurrent(); } });
sectionTabs.forEach(tab => { tab.addEventListener('click', () => { currentSection = tab.dataset.section; sectionTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); if (currentSection === 'mcq') currentIndex = 0; renderCurrent(); }); });
$('submitBtn').addEventListener('click', showResults);
$('reviewBtn').addEventListener('click', showReview);
$('retryBtn').addEventListener('click', () => { resetExam(); document.body.classList.remove('study-active'); showScreen('exam'); startTimer(); renderCurrent(); });
$('homeBtn').addEventListener('click', () => { resetExam(); document.body.classList.remove('study-active'); showScreen('hero'); });
$('backToResults').addEventListener('click', () => { isReviewMode = false; showScreen('results'); });

document.addEventListener('keydown', e => {
    if (!$('exam').classList.contains('active') || currentSection !== 'mcq') return;
    if (e.key === 'ArrowLeft' && currentIndex < mcqQuestions.length - 1) { currentIndex++; renderCurrent(); }
    if (e.key === 'ArrowRight' && currentIndex > 0) { currentIndex--; renderCurrent(); }
});

// Init particles on load
createParticles();
// Trigger hero animations on first load
setTimeout(triggerHeroAnimations, 100);
