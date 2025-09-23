(function(){
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');


    const focusableSelectors = 'a, button, input, [tabindex]:not([tabindex="-1"])';


    function open(){
        burger.setAttribute('aria-expanded','true');
        burger.setAttribute('aria-label','Закрыть меню');
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden','false');
// save previously focused element to restore later
        document._prevFocus = document.activeElement;
// move focus to the first focusable element inside sidebar
        const first = sidebar.querySelector(focusableSelectors);
        if(first) first.focus();
        document.addEventListener('keydown', onKeyDown);
    }
    function close(){
        burger.setAttribute('aria-expanded','false');
        burger.setAttribute('aria-label','Открыть меню');
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden','true');
        if(document._prevFocus) document._prevFocus.focus();
        document.removeEventListener('keydown', onKeyDown);
    }


    function toggle(){
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        if(expanded) close(); else open();
    }


    function onKeyDown(e){
        if(e.key === 'Escape') { close(); }
        if(e.key === 'Tab'){
// simple focus trap
            const focusables = Array.from(sidebar.querySelectorAll(focusableSelectors)).filter(el=>!el.hasAttribute('disabled'));
            if(focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length-1];
            if(e.shiftKey && document.activeElement === first){
                e.preventDefault(); last.focus();
            } else if(!e.shiftKey && document.activeElement === last){
                e.preventDefault(); first.focus();
            }
        }
    }


    burger.addEventListener('click', toggle);
    overlay.addEventListener('click', close);


// close sidebar when navigation link clicked (mobile behavior)
    sidebar.addEventListener('click', (e)=>{
        const target = e.target.closest('a');
        if(target && window.innerWidth < 900) close();
    });



})();