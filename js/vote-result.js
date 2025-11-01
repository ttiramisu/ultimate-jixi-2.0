const grid = document.getElementById('grid');
const toastEl = document.getElementById('toast');
const voteUrl = localStorage.getItem('votePageURL') || window.location.origin + '/index.html'; // default vote page

// Show toast
function showToast(msg, timeout = 2800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove('show'), timeout);
}

// Fetch Apps Script URL
function getScriptURL() {
  const url = localStorage.getItem('appsScriptURL');
  if (!url) showToast('请先设置 Apps Script URL');
  return url;
}

// Render grid
function renderGrid(items) {
  grid.innerHTML = '';
  if (!items || !Array.isArray(items)) return;

  const totalVotes = items.reduce((sum, i) => sum + (Number(i.votes) || 0), 0) || 1;

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = item.name;

    const votesEl = document.createElement('div');
    votesEl.className = 'votes';
    votesEl.textContent = `${item.votes} 票 (${Math.round(item.votes / totalVotes * 100)}%)`;

    card.appendChild(nameEl);
    card.appendChild(votesEl);

    grid.appendChild(card);
  });
}

// Fetch results (GET)
async function fetchResults() {
  const appsScriptURL = getScriptURL();
  if (!appsScriptURL) return;

  try {
    const res = await fetch('/api/proxy?appsScriptURL=' + encodeURIComponent(appsScriptURL), { method: 'GET' });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    renderGrid(data);
  } catch (err) {
    console.error(err);
    showToast('无法获取结果');
  }
}

// Generate QR code
function generateQR() {
  const canvas = document.getElementById('qrcode');
  if (!canvas) return;

  QRCode.toCanvas(canvas, voteUrl, { width: 180 }, function (error) {
    if (error) console.error(error);
  });

  const textEl = document.getElementById('voteUrlText');
  textEl.textContent = voteUrl;
}

// Initial load
(async () => {
  generateQR();
  await fetchResults();
})();
