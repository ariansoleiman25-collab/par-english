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

const $ = id => document.getElementById(id);
const screens = document.querySelectorAll('.screen');
const sectionTabs = document.querySelectorAll('.section-tab');

// ===== SCREENS =====
function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    setTimeout(() => {
        $(id).classList.add('active');
        $(id).scrollTo(0, 0);
        window.scrollTo(0, 0);
    }, 50);
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

    let optionsHTML = q.o.map((opt, i) => {
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

    let feedbackHTML = '';
    if (isAnswered) {
        if (status === 'correct') {
            feedbackHTML = `<div class="feedback-msg correct-fb">
                <span class="fb-icon">✅</span>
                <span>Correct! Well done.</span>
            </div>`;
        } else {
            feedbackHTML = `<div class="feedback-msg wrong-fb">
                <span class="fb-icon">❌</span>
                <span>Wrong — the correct answer is <strong>${letters[q.a]}. ${q.o[q.a]}</strong></span>
            </div>`;
        }
        feedbackHTML += `<div class="auto-next">بۆ پرسیاری دواتر کلیک لە "دواتر" بکە</div>`;
    }

    $('questionContainer').innerHTML = `
        <div class="question-card">
            <div class="question-number">Question ${currentIndex + 1} of ${mcqQuestions.length}</div>
            <div class="question-text">${q.q}</div>
            <div class="options-list">${optionsHTML}</div>
            ${feedbackHTML}
        </div>`;

    if (!isAnswered) {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                userAnswers[currentIndex] = idx;
                answeredStatus[currentIndex] = (idx === q.a) ? 'correct' : 'wrong';
                renderMCQ();
                updateDots();
                updateProgress();
                updateSubmitVisibility();
            });
        });
    }
}

// ===== RENDER FILL =====
function renderFill() {
    let html = '';
    fillQuestions.forEach((fq, fi) => {
        let wordsHTML = fq.words.map(w => `<span class="word-tag">${w}</span>`).join('');
        let itemsHTML = fq.items.map((item, ii) => {
            const key = `${fi}-${ii}`;
            const val = fillAnswers[key] || '';
            let inputCls = 'fill-input';
            let ansHTML = '';
            if (isReviewMode) {
                const ok = val.trim().toLowerCase() === item.answer.toLowerCase();
                inputCls += ok ? ' correct-input' : ' wrong-input';
                ansHTML = `<div class="fill-answer show">✓ ${item.answer}</div>`;
            }
            return `<div class="fill-item">
                <span class="fill-number">${ii + 1}</span>
                <span class="fill-text">${item.text}</span>
                <div>
                    <input type="text" class="${inputCls}" data-key="${key}" value="${val}" placeholder="..." ${isReviewMode ? 'disabled' : ''}>
                    ${ansHTML}
                </div>
            </div>`;
        }).join('');
        html += `<div class="question-card">
            <div class="fill-section-title">${fq.title}</div>
            <div class="word-box">${wordsHTML}</div>
            ${itemsHTML}
        </div>`;
    });
    $('questionContainer').innerHTML = html;
    if (!isReviewMode) {
        document.querySelectorAll('.fill-input').forEach(input => {
            input.addEventListener('input', e => {
                fillAnswers[e.target.dataset.key] = e.target.value;
                updateProgress();
                updateSubmitVisibility();
            });
        });
    }
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
    const answered = userAnswers.filter(a => a !== null).length + Object.keys(fillAnswers).filter(k => fillAnswers[k].trim()).length;
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
        else if (answeredStatus[i] === 'correct') cls += ' answered';
        else if (answeredStatus[i] === 'wrong') cls += ' wrong-dot';
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
        html += `<div class="review-card ${cls}">${badge}<div class="question-number">Question ${i + 1}</div><div class="question-text">${q.q}</div><div class="options-list">${opts}</div></div>`;
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
    sectionTabs.forEach(t => t.classList.remove('active'));
    sectionTabs[0].classList.add('active');
}

// ===== EVENTS =====
$('startExamBtn').addEventListener('click', () => { resetExam(); showScreen('exam'); startTimer(); renderCurrent(); });
$('studyModeBtn').addEventListener('click', () => { resetExam(); isStudyMode = true; $('examTimer').classList.add('hidden'); $('submitArea').classList.add('hidden'); showScreen('exam'); renderCurrent(); });
$('backToHome').addEventListener('click', () => { stopTimer(); showScreen('hero'); $('examTimer').classList.remove('hidden'); });
$('prevBtn').addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderCurrent(); } });
$('nextBtn').addEventListener('click', () => { if (currentIndex < mcqQuestions.length - 1) { currentIndex++; renderCurrent(); } });
sectionTabs.forEach(tab => { tab.addEventListener('click', () => { currentSection = tab.dataset.section; sectionTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); if (currentSection === 'mcq') currentIndex = 0; renderCurrent(); }); });
$('submitBtn').addEventListener('click', showResults);
$('reviewBtn').addEventListener('click', showReview);
$('retryBtn').addEventListener('click', () => { resetExam(); showScreen('exam'); startTimer(); renderCurrent(); });
$('homeBtn').addEventListener('click', () => { resetExam(); showScreen('hero'); });
$('backToResults').addEventListener('click', () => { isReviewMode = false; showScreen('results'); });

document.addEventListener('keydown', e => {
    if (!$('exam').classList.contains('active') || currentSection !== 'mcq') return;
    if (e.key === 'ArrowLeft' && currentIndex < mcqQuestions.length - 1) { currentIndex++; renderCurrent(); }
    if (e.key === 'ArrowRight' && currentIndex > 0) { currentIndex--; renderCurrent(); }
});
