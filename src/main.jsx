import React from 'react';
import { createRoot } from 'react-dom/client';
import { Heart, MapPin, Clock3, CalendarDays, ArrowDown, Sparkles, Camera, Check } from 'lucide-react';
import './styles.css';

const dateConfig = {
  partnerName: '安安',
  myName: '李小胖',
  date: '',
  datePlaceholder: '請選擇約會日期',
  time: '15:00',
  meetingLocation: '先保密 🤫',
  dressCode: '舒服、漂亮、你喜歡就好',
  dinnerOptions: ['火鍋', '拉麵', '義大利麵', '水餃', '韓式', '牛排'],
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

function randomUnit() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] / 2 ** 32;
}

function celebrationSymbol(index) {
  if (index % 4 === 0) return '🎉';
  if (index % 5 === 0) return '✨';
  return '❤';
}

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
  const [stage, setStage] = React.useState('intro');
  const [escapeCount, setEscapeCount] = React.useState(0);
  const [noPosition, setNoPosition] = React.useState({ top: 0, left: 0 });
  const [hearts, setHearts] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(dateConfig.date);
  const [selectedDinner, setSelectedDinner] = React.useState('');
  const noButtonRef = React.useRef(null);
  const answerAreaRef = React.useRef(null);

  const beginInvitation = () => {
    setStage('invitation');
    window.setTimeout(() => document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' }), 40);
  };

  const moveNoButton = () => {
    const button = noButtonRef.current;
    const answerArea = answerAreaRef.current;
    if (!button || !answerArea) return;
    const buttonRect = button.getBoundingClientRect();
    const answerAreaRect = answerArea.getBoundingClientRect();
    const padding = 8;
    const maxLeft = Math.max(padding, answerAreaRect.width - buttonRect.width - padding);
    const maxTop = Math.max(padding, answerAreaRect.height - buttonRect.height - padding);
    const nextCount = escapeCount + 1;
    setEscapeCount(nextCount);
    setNoPosition({
      left: Math.round(padding + randomUnit() * Math.max(0, maxLeft - padding)),
      top: Math.round(padding + randomUnit() * Math.max(0, maxTop - padding)),
    });
  };

  React.useEffect(() => {
    if (!escapeCount) return undefined;
    const keepNoButtonInside = () => {
      const button = noButtonRef.current;
      const answerArea = answerAreaRef.current;
      if (!button || !answerArea) return;
      const buttonRect = button.getBoundingClientRect();
      const answerAreaRect = answerArea.getBoundingClientRect();
      const padding = 8;
      const maxLeft = Math.max(padding, answerAreaRect.width - buttonRect.width - padding);
      const maxTop = Math.max(padding, answerAreaRect.height - buttonRect.height - padding);
      setNoPosition((position) => ({
        left: Math.min(Math.max(padding, position.left), maxLeft),
        top: Math.min(Math.max(padding, position.top), maxTop),
      }));
    };
    window.addEventListener('resize', keepNoButtonInside);
    return () => window.removeEventListener('resize', keepNoButtonInside);
  }, [escapeCount]);

  const acceptDate = () => {
    setStage('date-selection');
  };

  const confirmDate = () => {
    if (!isFutureDate(selectedDate) || !selectedDinner) return;
    const newHearts = Array.from({ length: 34 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: `${randomUnit() * 100}%`,
      delay: `${randomUnit() * 0.7}s`,
      symbol: celebrationSymbol(index),
    }));
    setHearts(newHearts);
    setStage('celebrating');
    window.setTimeout(() => setStage('success'), 1900);
  };

  const noScale = Math.min(1 + escapeCount * 0.08, 1.9);
  const noMessage = escapeMessages[Math.min(escapeCount, escapeMessages.length - 1)];

  return (
    <main className={`app-shell ${stage === 'success' ? 'is-success' : ''}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="floating-hearts" aria-hidden="true">
        <span>♡</span><span>✦</span><span>♡</span><span>✧</span>
      </div>

      {stage === 'intro' && (
        <section className="hero-screen section-pad">
          <div className="eyebrow"><span className="eyebrow-line" /> A little surprise for you <span className="eyebrow-line" /></div>
          <div className="hero-heart"><Heart size={42} fill="currentColor" strokeWidth={1.5} /></div>
          <p className="hero-kicker">Dear {dateConfig.partnerName},</p>
          <h1>{dateConfig.partnerName}，<br /><em>這週有空嗎？</em> <span className="question-mark">👀</span></h1>
          <p className="hero-subtitle">有人偷偷幫你安排了一個約會。</p>
          <button className="primary-button hero-button" onClick={beginInvitation}>看看是什麼 <span>💌</span></button>
          <div className="scroll-hint"><ArrowDown size={16} /> scroll slowly</div>
        </section>
      )}

      {stage !== 'intro' && stage !== 'celebrating' && stage !== 'date-selection' && (
        <>
          <section className="invitation-section section-pad" id="invitation">
            <div className="section-label">01 / THE INVITATION</div>
            <h2>{dateConfig.myName}<br /><em>想約 {dateConfig.partnerName} 去約會</em> <span>❤️</span></h2>
            <p className="section-copy">不用準備什麼，<br />只要把那天的時間留給我就好了。</p>
            <div className="info-grid">
              <InfoCard icon={<CalendarDays />} label="DATE" value="答應後再一起選 ❤️" />
              <InfoCard icon={<Clock3 />} label="TIME" value={dateConfig.time} />
              <InfoCard icon={<MapPin />} label="MEET AT" value={dateConfig.meetingLocation} />
              <InfoCard icon={<Sparkles />} label="DRESS CODE" value={dateConfig.dressCode} />
            </div>
          </section>

          <section className="schedule-section section-pad">
            <div className="section-label">02 / THE LITTLE PLAN</div>
            <div className="split-heading"><h2>這一天，<br /><em>交給我安排。</em></h2><p>安安只要準時出現，剩下的風景，我想和你一起看。</p></div>
            <div className="timeline">
              {dateConfig.schedule.map((item) => <ScheduleItem key={`${item.time}-${item.title}`} item={item} />)}
            </div>
          </section>

          <section className="quote-section section-pad"><p>安安不用想要去哪裡。</p><p>也不用想要吃什麼。</p><p className="quote-accent">這次全部交給李小胖。</p><strong>你只需要負責出現 <span>❤️</span></strong></section>

          <section className="question-section section-pad" id="question">
            <div className="question-card">
              <div className="stamp">MADE WITH<br /><span>LOVE</span></div>
              <p className="section-label">03 / ONE LAST QUESTION</p>
              <h2>所以……</h2>
              <p className="question-text">{dateConfig.partnerName}，要不要跟<br />{dateConfig.myName} 去約會？ <span>🥺❤️</span></p>
              <div className="answer-area" ref={answerAreaRef}>
                <button className="yes-button" style={{ transform: `scale(${noScale})` }} onClick={acceptDate}><Heart size={20} fill="currentColor" /> 要！</button>
                <button ref={noButtonRef} className="no-button" style={escapeCount ? { position: 'absolute', left: noPosition.left, top: noPosition.top } : undefined} onMouseEnter={moveNoButton} onTouchStart={(event) => { event.preventDefault(); moveNoButton(); }} onFocus={moveNoButton}>{noMessage}</button>
              </div>
              <p className="tiny-note">先選擇要不要，再一起決定哪一天 ❤️</p>
            </div>
          </section>
        </>
      )}

      {stage === 'date-selection' && <DateSelection selectedDate={selectedDate} onChange={setSelectedDate} selectedDinner={selectedDinner} onDinnerChange={setSelectedDinner} onConfirm={confirmDate} />}
      {stage === 'celebrating' && <Celebration hearts={hearts} />}
      {stage === 'success' && <SuccessScreen selectedDate={selectedDate} selectedDinner={selectedDinner} />}
    </main>
  );
}

function InfoCard({ icon, label, value }) {
  return <article className="info-card"><div className="info-icon">{icon}</div><div><div className="info-label">{label}</div><div className="info-value">{value}</div></div></article>;
}

function DatePickerCard({ selectedDate, onChange }) {
  return <article className="info-card date-picker-card"><div className="info-icon"><CalendarDays /></div><div><div className="info-label">DATE</div><label className="date-picker-label" htmlFor="date-choice">選一個你有空的日子</label><input id="date-choice" type="date" min={getTomorrowDate()} value={selectedDate} onChange={(event) => onChange(event.target.value)} /></div></article>;
}

function DateSelection({ selectedDate, onChange, selectedDinner, onDinnerChange, onConfirm }) {
  return <section className="date-selection-screen section-pad"><div className="question-card date-selection-card"><div className="section-label">04 / PICK OUR DAY</div><div className="date-selection-icon"><CalendarDays size={30} /></div><h2>那麼，<br /><em>哪一天屬於我們？</em></h2><p className="question-text">選一個未來有空的日子，<br />再挑一個想和李小胖一起吃的晚餐。</p><DatePickerCard selectedDate={selectedDate} onChange={onChange} /><div className="dinner-picker"><div className="info-label">DINNER</div><p>今天想吃哪一種？</p><div className="dinner-options">{dateConfig.dinnerOptions.map((option) => <button type="button" className={`dinner-option ${selectedDinner === option ? 'is-selected' : ''}`} key={option} onClick={() => onDinnerChange(option)}>{option}</button>)}</div></div><button className="primary-button confirm-date-button" onClick={onConfirm} disabled={!isFutureDate(selectedDate) || !selectedDinner}><Check size={18} /> 確認這一天</button><p className="tiny-note">只能選明天以後的日期喔</p></div></section>;
}

function ScheduleItem({ item }) {
  return <article className="schedule-item"><div className="schedule-time">{item.time}</div><div className="schedule-dot"><span>{item.icon}</span></div><div className="schedule-detail"><h3>{item.title}</h3><p>{item.description}</p></div></article>;
}

function Celebration({ hearts }) {
  return <section className="celebration-screen"><div className="celebration-copy"><div className="celebration-heart"><Heart size={76} fill="currentColor" /></div><h2>YAY! <span>🎉</span></h2><p>安安答應了這個約會！</p></div><div className="celebration-particles" aria-hidden="true">{hearts.map((heart) => <span key={heart.id} style={{ left: heart.left, animationDelay: heart.delay }}>{heart.symbol}</span>)}</div></section>;
}

function SuccessScreen({ selectedDate, selectedDinner }) {
  return <section className="success-screen section-pad"><div className="success-badge"><Check size={18} /> CONFIRMED</div><p className="eyebrow">IT'S A DATE</p><h1>安安的約會<br /><em>預約成功！</em> ❤️</h1><p className="success-copy">李小胖就知道你會答應 😌<br />那天見，安安。</p><div className="confirmed-details"><InfoCard icon={<CalendarDays />} label="DATE" value={formatDate(selectedDate)} /><InfoCard icon={<Clock3 />} label="TIME" value={dateConfig.time} /><InfoCard icon={<MapPin />} label="MEET AT" value={dateConfig.meetingLocation} /><InfoCard icon={<Sparkles />} label="DINNER" value={selectedDinner} /></div><Ticket selectedDate={selectedDate} selectedDinner={selectedDinner} /><button className="secondary-button" onClick={() => window.print()}><Camera size={17} /> Screenshot this page</button></section>;
}

function Ticket({ selectedDate, selectedDinner }) {
  return <article className="ticket"><div className="ticket-top"><span>DATE TICKET</span><span>NO. 001</span></div><div className="ticket-main"><div className="ticket-title">Admit One <span>❤️</span></div><div className="ticket-rows"><p><span>FOR</span>{dateConfig.partnerName}</p><p><span>WITH</span>{dateConfig.myName}</p><p><span>DATE</span>{formatDate(selectedDate)}</p><p><span>DINNER</span>{selectedDinner}</p><p><span>LOCATION</span>Secret</p></div></div><div className="barcode" aria-hidden="true">|||| ||| |||| | ||| |||| || | |||| |||</div></article>;
}

createRoot(document.getElementById('root')).render(<App />);
