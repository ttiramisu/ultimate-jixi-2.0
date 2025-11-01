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
    const res = await fetch('/api/update-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': '',
      },
      body: JSON.stringify({ appsScriptURL: url })
    });

    const data = await res.json();
    if (res.ok) {
      showToast('已保存 URL');
    } else {
      showToast(data.error || '保存失败');
      console.error(data);
    }
  } catch (err) {
    showToast('请求失败');
    console.error(err);
  }
});