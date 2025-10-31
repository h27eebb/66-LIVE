// === إعداد قائمة المباريات ===
// **تم إضافة حقل 'channel' لتحديد الناقل (القسم)**
const matchesData = [
  {
    id: 1,
    home: 'العراق',
    away: 'إيران',
    time: '2025-11-02 20:30',
    stadium: 'ملعب كربلاء',
    channel: 'beIN Sports HD', // القسم
    type: 'youtube',
    videoId: 'dQw4w9WgXcQ' // مثال - استبدل بالـ YouTube ID للبث الرسمي
  },
  {
    id: 2,
    home: 'برشلونة',
    away: 'ريال مدريد',
    time: '2025-11-03 18:00',
    stadium: 'كامب نو',
    channel: 'SSC HD 1', // القسم
    type: 'twitch',
    videoId: 'channel:realmadrid' // مثال: 'channel:<name>' أو رابط كامل
  },
  {
    id: 3,
    home: 'نيوكاسل',
    away: 'مانشستر',
    time: '2025-11-04 22:00',
    stadium: 'سنت جيمس',
    channel: 'MBC Pro Sports', // القسم
    type: 'external',
    url: 'https://example.com/stream-page' // رابط خارجي إذا لم يكن يوتيوب/تويتش
  },
  {
    id: 4,
    home: 'السعودية',
    away: 'اليابان',
    time: '2025-11-04 20:00',
    stadium: 'الجوهرة',
    channel: 'SSC HD 1', // مباراة إضافية في نفس القسم
    type: 'youtube',
    videoId: 'anotherId' 
  }
];

const sectionsContainerEl = document.getElementById('sections-container'); // تم تغيير الاسم
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const playerFrame = document.getElementById('playerFrame');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const refreshBtn = document.getElementById('refreshBtn');

// دالة مساعدة لإنشاء بطاقة المباراة
function createMatchCard(m) {
    return `
      <div class="match">
        <div class="teams">
          <div class="team">${m.home}</div>
          <div class="meta">vs</div>
          <div class="team">${m.away}</div>
        </div>
        <div class="meta">${m.time} — ${m.stadium}</div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
          <button class="btn" data-id="${m.id}">مشاهدة</button>
          <button class="btn secondary" onclick="window.open('${escapeHtml(m.url || generateWatchUrl(m))}','_blank')">خارج الصفحة</button>
        </div>
      </div>
    `;
}


// ** الدالة الرئيسية الجديدة لعرض الأقسام **
function renderSections(list){
  sectionsContainerEl.innerHTML = '';
  if(!list.length){ 
    sectionsContainerEl.innerHTML = '<div class="card">لا توجد مباريات مطابقة.</div>'; 
    return 
  }
  
  // 1. تجميع المباريات حسب القناة (channel)
  const grouped = list.reduce((acc, match) => {
    const key = match.channel || 'أخرى';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(match);
    return acc;
  }, {});
  
  // 2. إنشاء أقسام (cards) لكل قناة
  Object.keys(grouped).forEach(channelName => {
    const matches = grouped[channelName];
    
    const sectionHtml = `
      <section class="card" style="margin-top:15px">
        <h3>${channelName}</h3>
        <div class="matches">
          ${matches.map(createMatchCard).join('')}
        </div>
      </section>
    `;
    sectionsContainerEl.insertAdjacentHTML('beforeend', sectionHtml);
  });
  
  // 3. إضافة مستمعي الأحداث لزر "مشاهدة"
  document.querySelectorAll('.match .btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = Number(b.getAttribute('data-id'));
      const match = matchesData.find(x=>x.id===id);
      openPlayer(match);
    });
  });
}

function generateWatchUrl(m){
  if(m.type==='youtube') return `https://www.youtube.com/watch?v=${m.videoId}`;
  if(m.type==='twitch'){
    // videoId may be 'channel:name' or a url
    if(m.videoId && m.videoId.startsWith('channel:')){
      const ch = m.videoId.split(':')[1];
      return `https://www.twitch.tv/${ch}`;
    }
    return m.videoId || '#';
  }
  return m.url || '#';
}

function openPlayer(m){
  modalTitle.textContent = `${m.home} — ${m.away} | ${m.channel}`; // تم إضافة اسم القناة للعنونة
  let src = '';
  if(m.type==='youtube'){
    // embed youtube
    src = `https://www.youtube.com/embed/${m.videoId}?autoplay=1`;
  } else if(m.type==='twitch'){
    if(m.videoId && m.videoId.startsWith('channel:')){
      const ch = m.videoId.split(':')[1];
      src = `https://player.twitch.tv/?channel=${ch}&parent=${location.hostname}&autoplay=true`;
    } else {
      // if a full twitch url given
      src = m.videoId;
    }
  } else if(m.type==='external'){
    src = m.url;
  }
  playerFrame.src = src;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

closeModal.addEventListener('click', ()=>{
  playerFrame.src = '';
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
});

// Escape helper for safety
function escapeHtml(s){ if(!s) return ''; return s.replace(/'/g,"%27").replace(/\"/g,'%22') }

// Search
searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  const filtered = matchesData.filter(m=>
    m.home.toLowerCase().includes(q) || 
    m.away.toLowerCase().includes(q) || 
    (m.stadium||'').toLowerCase().includes(q) ||
    (m.channel||'').toLowerCase().includes(q) // البحث يشمل اسم القناة
  );
  renderSections(filtered);
});

refreshBtn.addEventListener('click', ()=>{
  // في النسخة البسيطة نقوم بإعادة تهيئة العرض
  renderSections(matchesData);
  searchInput.value = '';
});

// initial render (تم تغيير الدالة)
renderSections(matchesData);

// إغلاق المودال بالـ ESC
window.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ closeModal.click(); } });
