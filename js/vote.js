const LOCAL_VOTE_KEY = 'poll_voted_participant_id_v1';
const grid = document.getElementById('grid');
const toastEl = document.getElementById('toast');
const refreshBtn = document.getElementById('refreshBtn');

// Show toast
function showToast(msg, timeout=2800){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(()=>toastEl.classList.remove('show'), timeout);
}

// Short name for avatar
function shortNameToInitials(name){
    if(!name) return '?';
    name = String(name).trim();
    return name.length <= 2 ? name : name.slice(-2);
}

// Fetch Apps Script URL from central config.json
async function getAppsScriptURL() {
  try {
    const res = await fetch('/config.json');
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.appsScriptURL;
  } catch (err) {
    console.error(err);
    showToast('无法取得 Apps Script URL');
    return '';
  }
}

let APPS_SCRIPT_URL = '';
let dataCache = [];

// Fetch poll results
async function fetchResults() {
  const url = await getAppsScriptURL();
  if (!url) return [];

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    dataCache = json;
    renderGrid(json);
    return json;
  } catch (err) {
    console.error(err);
    showToast('无法读取结果');
    return [];
  }
}

// Total votes
function getTotalVotes(items){
    return items.reduce((s,i) => s + (Number(i.votes)||0), 0);
}

// Render poll grid
function renderGrid(items){
    grid.innerHTML = '';
    const total = Math.max(1, getTotalVotes(items));
    const votedId = localStorage.getItem(LOCAL_VOTE_KEY);

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card celebrate';

        const meta = document.createElement('div');
        meta.className = 'meta';
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = shortNameToInitials(item.name);

        const info = document.createElement('div');
        const nameEl = document.createElement('div'); nameEl.className = 'name'; nameEl.textContent = item.name;
        const idEl = document.createElement('div'); idEl.className = 'idsmall'; idEl.textContent = item.id;
        info.appendChild(nameEl); info.appendChild(idEl);
        meta.appendChild(avatar); meta.appendChild(info);

        const barWrap = document.createElement('div'); barWrap.className = 'bar-wrap';
        const bar = document.createElement('div'); bar.className = 'bar';
        const percent = Math.round((Number(item.votes)||0)/total*100);
        setTimeout(()=>{bar.style.width = percent+'%';},60);
        barWrap.appendChild(bar);

        const votesEl = document.createElement('div'); votesEl.className='votes';
        votesEl.textContent = `${item.votes} 票 • ${percent}%`;

        const btn = document.createElement('button'); btn.className='btn';
        btn.textContent = votedId ? (votedId===item.id?'已投票':'已锁定'):'投给他';
        btn.disabled = !!votedId;
        btn.addEventListener('click', ()=>onVote(item.id, card));

        card.appendChild(meta); card.appendChild(barWrap); card.appendChild(votesEl); card.appendChild(btn);
        grid.appendChild(card);
    });
}

// Vote
async function onVote(participantId, cardEl){
    if(localStorage.getItem(LOCAL_VOTE_KEY)){ showToast('此装置已投过票'); return; }
    if(!confirm('确认要把你的一票投给此人吗？每个装置仅可投一次。')) return;
    if(!APPS_SCRIPT_URL) APPS_SCRIPT_URL = await getAppsScriptURL();
    if(!APPS_SCRIPT_URL) return;

    try{
        localStorage.setItem(LOCAL_VOTE_KEY, participantId);
        renderGrid(dataCache);

        const payload = { participantId };
        const res = await fetch(APPS_SCRIPT_URL,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });

        if(!res.ok) throw new Error(res.status);
        const j = await res.json();
        if(j.status!=='success') throw new Error('服务器回应异常');

        cardEl.classList.add('active');
        setTimeout(()=>cardEl.classList.remove('active'),1200);

        showToast('投票成功 🎉');
        await fetchResults();
    } catch(err){
        console.error(err);
        localStorage.removeItem(LOCAL_VOTE_KEY);
        renderGrid(dataCache);
        showToast('投票失败');
    }
}

// Refresh button
refreshBtn.addEventListener('click', ()=>fetchResults().then(()=>showToast('已更新')));

// Initial fetch
(async ()=>{
    showToast('正在加载结果...');
    await fetchResults();
    showToast('已取得结果');
})();