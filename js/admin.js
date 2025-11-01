const appsScriptInput = document.getElementById('appsScriptURL');
const saveURLBtn = document.getElementById('saveURL');
const toastEl = document.getElementById('toast');

function showToast(msg, timeout=2800){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(()=>toastEl.classList.remove('show'), timeout);
}

saveURLBtn.addEventListener('click', async () => {
  const url = appsScriptInput.value.trim();
  if(!url){ showToast('请输入有效 URL'); return; }

  try {
    // Pls dont hack
    const CONFIG_SHEET_EXEC = "https://script.google.com/macros/s/AKfycbxnovjevUeOASY466eS9IyXiaNRnBAx4m6Bgdh8lgK0Pf6h9DAkuTlqWUYEeYIRaRrV/exec";

    const payload = { execLink: url };
    const res = await fetch(CONFIG_SHEET_EXEC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if(data.status === 'success') showToast('已保存 URL 到配置表');
    else showToast('保存失败');

  } catch(err) {
    console.error(err);
    showToast('保存失败');
  }
});
