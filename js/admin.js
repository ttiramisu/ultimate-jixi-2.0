const appsScriptInput = document.getElementById('appsScriptURL');
const saveURLBtn = document.getElementById('saveURL');
const toastEl = document.getElementById('toast');
const copyBtns = document.querySelectorAll('.copyCode');

// Show toast message
function showToast(msg, timeout=2800){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), timeout);
}

// Copy code button
copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.previousElementSibling; // textarea before button
        if(!target) return;
        target.select();
        target.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(target.value)
            .then(() => showToast('已复制到剪贴板'))
            .catch(err => { showToast('复制失败'); console.error(err); });
    });
});

// Save Apps Script URL to central config.json via serverless endpoint
saveURLBtn.addEventListener('click', async () => {
    const url = appsScriptInput.value.trim();
    if(!url){ showToast('请输入有效 URL'); return; }

    try {
        const res = await fetch('/api/update-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appsScriptURL: url, secret: 'YOUR_ADMIN_SECRET' }) // replace with your secure secret
        });

        const data = await res.json();
        if(data.status === 'ok'){
            showToast('已保存 URL');
        } else {
            showToast('保存失败');
            console.error(data);
        }
    } catch(err){
        showToast('保存失败');
        console.error(err);
    }
});