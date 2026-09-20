import React from 'react';
import { createRoot } from 'react-dom/client';
import { Heart, CalendarDays, RotateCcw } from 'lucide-react';
import './styles.css';

const dateConfig = {
  partnerName: '安安',
  myName: '李小胖',
  date: '',
  datePlaceholder: '請選擇約會日期',
  time: '15:00',
  meetingLocation: '先保密 🤫',
  dressCode: '舒服、漂亮、你喜歡就好',
  dinnerOptions: ['火鍋', '牛肉麵', '滷肉飯', '夜市小吃', '烤肉', '拉麵'],
  schedule: [
    { time: '15:00', icon: '☕', title: '下午茶', description: '先一起找個舒服的地方坐下來' },
    { time: '17:00', icon: '🚶', title: '一起散步', description: '慢慢走，慢慢聊今天的心事' },
    { time: '18:30', icon: '🍽️', title: '晚餐', description: '李小胖訂好了，放心交給我' },
    { time: '20:30', icon: '✨', title: '神秘行程', description: '暫時保密，但保證值得期待' },
    { time: '22:00', icon: '🏠', title: '安全送安安回家', description: '把今天的好心情一起帶回家' },
  ],
};

const escapeMessages = [
  '不要',
  '安安你確定？🥺',
  '再想一下嘛',
  '真的不要嗎 😭',
  '安安你抓不到我 😝',
  '欸不是，你為什麼一直想按這個 😭',
  '左邊那顆比較好按啦 👉 ❤️',
  '系統錯誤：拒絕功能目前維修中',
  '只能選要 ❤️',
];

function formatDate(date) {
  if (!date) return dateConfig.datePlaceholder;
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(`${date}T00:00:00`)).replaceAll('/', ' / ');
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

function isFutureDate(date) {
  return Boolean(date) && date >= getTomorrowDate();
}

function App() {
  const [step, setStep] = React.useState(1);
  const [escapeCount, setEscapeCount] = React.useState(0);
  const [noPosition, setNoPosition] = React.useState({ top: 0, left: 0 });
  const [selectedDate, setSelectedDate] = React.useState(dateConfig.date);
  const [selectedDinner, setSelectedDinner] = React.useState('');
  const noButtonRef = React.useRef(null);
  const yesButtonRef = React.useRef(null);
  const noMoveLockedRef = React.useRef(false);

  const getSafeNoPosition = () => {
    const button = noButtonRef.current;
    const yesButton = yesButtonRef.current;
    if (!button || !yesButton) return { left: 12, top: 12 };
    const buttonRect = button.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();
    const padding = 12;
    const maxLeft = Math.max(padding, window.innerWidth - buttonRect.width - padding);
    const maxTop = Math.max(padding, window.innerHeight - buttonRect.height - padding);
    const yesBox = {
      left: yesRect.left,
      right: yesRect.right,
      top: yesRect.top,
      bottom: yesRect.bottom,
    };
    const candidates = [
      { left: padding, top: padding },
      { left: maxLeft, top: padding },
      { left: padding, top: maxTop },
      { left: maxLeft, top: maxTop },
      { left: Math.round(maxLeft / 2), top: padding },
      { left: Math.round(maxLeft / 2), top: maxTop },
      { left: padding, top: Math.round(maxTop / 2) },
      { left: maxLeft, top: Math.round(maxTop / 2) },
    ];

    const orderedCandidates = candidates.slice(escapeCount % candidates.length).concat(candidates.slice(0, escapeCount % candidates.length));
    for (const { left, top } of orderedCandidates) {
      const overlaps = left < yesBox.right && left + buttonRect.width > yesBox.left && top < yesBox.bottom && top + buttonRect.height > yesBox.top;
      if (!overlaps) return { left, top };
    }

    for (let top = padding; top <= maxTop; top += 24) {
      for (let left = padding; left <= maxLeft; left += 24) {
        const overlaps = left < yesBox.right && left + buttonRect.width > yesBox.left && top < yesBox.bottom && top + buttonRect.height > yesBox.top;
        if (!overlaps) return { left, top };
      }
    }

    return { left: maxLeft, top: maxTop };
  };

  const moveNoButton = () => {
    if (noMoveLockedRef.current) return;
    noMoveLockedRef.current = true;
    setEscapeCount((count) => count + 1);
    setNoPosition(getSafeNoPosition());
    window.setTimeout(() => {
      noMoveLockedRef.current = false;
    }, 450);
  };

  React.useEffect(() => {
    if (step !== 1 || !escapeCount) return undefined;
    const keepNoButtonInside = () => setNoPosition(getSafeNoPosition());
    window.addEventListener('resize', keepNoButtonInside);
    window.addEventListener('scroll', keepNoButtonInside, { passive: true });
    return () => {
      window.removeEventListener('resize', keepNoButtonInside);
      window.removeEventListener('scroll', keepNoButtonInside);
    };
  }, [step, escapeCount]);

  React.useLayoutEffect(() => {
    if (step !== 1 || !escapeCount) return;
    setNoPosition(getSafeNoPosition());
  }, [step, escapeCount]);

  const noScale = Math.min(1 + escapeCount * 0.08, 1.9);
  const noMessage = escapeMessages[Math.min(escapeCount, escapeMessages.length - 1)];
  const chooseDate = (event) => setSelectedDate(event.target.value);
  const goToFood = () => { if (isFutureDate(selectedDate)) setStep(3); };
  const restart = () => {
    setStep(1);
    setEscapeCount(0);
    noMoveLockedRef.current = false;
    setNoPosition({ top: 0, left: 0 });
    setSelectedDate(dateConfig.date);
    setSelectedDinner('');
  };

  return <main className="app-shell four-step-app">
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />
    <div className="floating-hearts" aria-hidden="true"><span>♡</span><span>✦</span><span>♡</span><span>✧</span></div>
    <div className="step-progress" aria-label={`第 ${step} 步，共 4 步`}>{[1, 2, 3, 4].map((item) => <span className={item <= step ? 'is-active' : ''} key={item} />)}</div>

    {step === 1 && <section className="four-step-card step-question">
      <p className="step-kicker">A LITTLE QUESTION FOR {dateConfig.partnerName.toUpperCase()}</p>
      <div className="step-icon"><Heart size={48} fill="currentColor" /></div>
      <h1>🌸 要不要跟我<br /><em>去約會？</em> 🌸</h1>
      <p className="step-copy">{dateConfig.myName} 有一個小小的邀請，<br />想和你一起度過一個特別的日子。</p>
      <div className="step-answer-area">
        <button ref={yesButtonRef} className="yes-button" style={{ transform: `scale(${noScale})` }} onClick={() => setStep(2)}><Heart size={19} fill="currentColor" /> 好哦 ♥</button>
        <button ref={noButtonRef} className={`no-button ${escapeCount ? 'is-escaped' : ''}`} style={escapeCount ? { left: noPosition.left, top: noPosition.top } : undefined} onPointerEnter={moveNoButton} onPointerDown={(event) => { event.preventDefault(); moveNoButton(); }} onFocus={moveNoButton}>{escapeCount ? noMessage : 'No 👋'}</button>
      </div>
      <p className="tiny-note">提示：這題沒有錯誤答案，但有一個比較可愛的答案。</p>
    </section>}

    {step === 2 && <section className="four-step-card choice-step">
      <p className="step-kicker">02 / CHOOSE A DAY</p><div className="step-icon"><CalendarDays size={42} /></div>
      <h2>那我們，<br /><em>哪天見？</em></h2><p className="step-copy">選一個明天以後，你有空的日子。</p>
      <label className="date-input-wrap" htmlFor="date-choice"><span>DATE</span><input id="date-choice" type="date" min={getTomorrowDate()} value={selectedDate} onChange={chooseDate} /></label>
      <button className="primary-button next-button" onClick={goToFood} disabled={!isFutureDate(selectedDate)}>就這天！❤</button>
    </section>}

    {step === 3 && <section className="four-step-card choice-step">
      <p className="step-kicker">03 / PICK SOMETHING DELICIOUS</p><div className="step-icon food-icon">🍽️</div>
      <h2>那天想吃<br /><em>什麼呢？</em></h2><p className="step-copy">放心，這次讓安安決定。</p>
      <div className="food-options">{dateConfig.dinnerOptions.map((option) => <button type="button" className={`food-option ${selectedDinner === option ? 'is-selected' : ''}`} key={option} onClick={() => setSelectedDinner(option)}>{option}</button>)}</div>
      <button className="primary-button next-button" onClick={() => setStep(4)} disabled={!selectedDinner}>決定好了 ♥</button>
    </section>}

    {step === 4 && <section className="four-step-card letter-step">
      <p className="step-kicker">04 / A LITTLE LETTER</p><div className="letter-flower">🌷</div>
      <h2>給安安的一封<br /><em>小情書</em></h2>
      <div className="letter-content"><p>安安：</p><p>謝謝你願意把一天的時間留給李小胖。其實去哪裡、吃什麼，都沒有那麼重要。</p><p>重要的是，這一天我想和你一起慢慢走、慢慢聊，把普通的午後變成只屬於我們的回憶。</p><p>日期是 <strong>{formatDate(selectedDate)}</strong>，晚餐是 <strong>{selectedDinner}</strong>。我會好好期待那天的到來。</p><p className="letter-signature">那天見，安安<br />一直想見你的 李小胖 <span>♡</span></p></div>
      <button className="secondary-button restart-button" onClick={restart}><RotateCcw size={17} /> 再看一次</button>
    </section>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
