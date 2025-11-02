const appsScriptInput = document.getElementById('appsScriptURL');
const saveURLBtn = document.getElementById('saveURL');
const toastEl = document.getElementById('toast');

function showToast(msg, timeout = 2800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove('show'), timeout);
}

saveURLBtn.addEventListener('click', async () => {
  const url = appsScriptInput.value.trim();
  if (!url) { showToast('请输入有效 URL'); return; }

  try {
    const res = await fetch('/api/set-voting-exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ execUrl: url })
    });

    const data = await res.json();
    if (res.ok) {
      showToast('已保存 exec 链接到 Firebase');
    } else {
      console.error(data);
      showToast('保存失败');
    }
  } catch (err) {
    console.error(err);
    showToast('保存失败');
  }
});
