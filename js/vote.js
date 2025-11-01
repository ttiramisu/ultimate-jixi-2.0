const LOCAL_VOTE_KEY = 'poll_voted_participant_id_v1';
const grid = document.getElementById('grid');
const toastEl = document.getElementById('toast');
const refreshBtn = document.getElementById('refreshBtn');

// Show toast notification
function showToast(msg, timeout = 2800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove('show'), timeout);
}

// Convert name to initials for avatar
function shortNameToInitials(name) {
  if (!name) return '?';
  name = String(name).trim();
  return name.length <= 2 ? name : name.slice(-2);
}

// Get Apps Script URL from localStorage
function getScriptURL() {
  const url = localStorage.getItem('appsScriptURL');
  if (!url) showToast('请先在指南页面输入 Apps Script URL');
  return url;
}

let dataCache = [];

// Fetch results from Apps Script via proxy (GET)
async function fetchResults() {
  const appsScriptURL = getScriptURL();
  if (!appsScriptURL) return [];

  try {
    const res = await fetch('/api/proxy?appsScriptURL=' + encodeURIComponent(appsScriptURL), {
      method: 'GET',
    });

    if (!res.ok) throw new Error(res.status);

    const json = await res.json();

    if (!Array.isArray(json)) {
      console.error('Unexpected response:', json);
      showToast('数据格式错误');
      dataCache = [];
      renderGrid([]);
      return [];
    }

    dataCache = json;
    renderGrid(json);
    return json;
  } catch (err) {
    console.error(err);
    showToast('无法读取结果');
    return [];
  }
}

// Compute total votes
function getTotalVotes(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((s, i) => s + (Number(i.votes) || 0), 0);
}

// Render voting grid
function renderGrid(items) {
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
    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = item.name;

    const idEl = document.createElement('div');
    idEl.className = 'idsmall';
    idEl.textContent = item.id;

    info.appendChild(nameEl);
    info.appendChild(idEl);
    meta.appendChild(avatar);
    meta.appendChild(info);

    const barWrap = document.createElement('div');
    barWrap.className = 'bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'bar';
    const percent = Math.round((Number(item.votes) || 0) / total * 100);
    setTimeout(() => { bar.style.width = percent + '%'; }, 60);
    barWrap.appendChild(bar);

    const votesEl = document.createElement('div');
    votesEl.className = 'votes';
    votesEl.textContent = `${item.votes} 票 • ${percent}%`;

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = votedId ? (votedId === item.id ? '已投票' : '已锁定') : '投给他';
    btn.disabled = !!votedId;
    btn.addEventListener('click', () => onVote(item.id, card));

    card.appendChild(meta);
    card.appendChild(barWrap);
    card.appendChild(votesEl);
    card.appendChild(btn);

    grid.appendChild(card);
  });
}

// Handle voting (POST)
async function onVote(participantId, cardEl) {
  if (localStorage.getItem(LOCAL_VOTE_KEY)) { showToast('此装置已投过票'); return; }
  if (!confirm('确认要把你的一票投给此人吗？每个装置仅可投一次。')) return;

  const appsScriptURL = getScriptURL();
  if (!appsScriptURL) return;

  try {
    localStorage.setItem(LOCAL_VOTE_KEY, participantId);
    renderGrid(dataCache);

    const payload = { participantId };
    const res = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appsScriptURL, payload })
    });

    if (!res.ok) throw new Error(res.status);

    const j = await res.json();
    if (j.status !== 'success') throw new Error('服务器回应异常');

    cardEl.classList.add('active');
    setTimeout(() => cardEl.classList.remove('active'), 1200);

    showToast('投票成功 🎉');
    await fetchResults(); // reload updated results
  } catch (err) {
    console.error(err);
    localStorage.removeItem(LOCAL_VOTE_KEY);
    renderGrid(dataCache);
    showToast('投票失败');
  }
}

(async () => {
  showToast('正在加载结果...');
  await fetchResults();
  showToast('已取得结果');
})();
