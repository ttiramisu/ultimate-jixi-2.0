const appsScriptInput = document.getElementById('appsScriptURL');
const saveURLBtn = document.getElementById('saveURL');
const toastEl = document.getElementById('toast');
const copyBtns = document.querySelectorAll('.copyCode');

function showToast(msg, timeout=2800){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(()=>toastEl.classList.remove('show'), timeout);
}

function setScriptURL(url){
    localStorage.setItem('appsScriptURL', url);
}

function getScriptURL(){
    return localStorage.getItem('appsScriptURL') || '';
}

saveURLBtn.addEventListener('click', () => {
    const url = appsScriptInput.value.trim();
    if(!url){ showToast('请输入有效 URL'); return; }
    setScriptURL(url);
    showToast('已保存 URL');
});

copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.previousElementSibling; // assumes textarea before button
        if(!target) return;
        target.select();
        target.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(target.value).then(() => {
            showToast('已复制到剪贴板');
        }).catch(err => {
            showToast('复制失败');
            console.error(err);
        });
    });
});