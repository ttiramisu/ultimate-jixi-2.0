const appsScriptInput = document.getElementById('appsScriptURL');
const saveURLBtn = document.getElementById('saveURL');
const toastEl = document.getElementById('toast');

function showToast(msg, timeout=2800){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),timeout);
}

saveURLBtn.addEventListener('click', async () => {
    const url = appsScriptInput.value.trim();
    if(!url){ showToast('请输入有效 URL'); return; }

    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ configURL: url })
        });
        const json = await response.json();

        if(json.status === 'success'){
            showToast('已保存 Exec URL 至 Google Sheet');
        } else {
            showToast('保存失败');
            console.error(json);
        }
    } catch(err) {
        console.error(err);
        showToast('保存失败');
    }
});
