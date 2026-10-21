(() => {
    const body = document.body;
    const html = document.documentElement;
    const header = document.querySelector('[data-header]');
    const nav = document.querySelector('[data-nav]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const mobileMedia = window.matchMedia('(max-width: 920px)');

    if (nav && toggle) {
        const setMenuState = (open) => {
            const shouldOpen = Boolean(open && mobileMedia.matches);
            nav.classList.toggle('open', shouldOpen);
            toggle.classList.toggle('is-open', shouldOpen);
            toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            toggle.setAttribute('aria-label', shouldOpen ? 'Cerrar menú' : 'Abrir menú');
            body.classList.toggle('menu-open', shouldOpen);
            html.classList.toggle('betsala-menu-open', shouldOpen);

            if (mobileMedia.matches) {
                nav.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
                nav.toggleAttribute('inert', !shouldOpen);
            } else {
                nav.removeAttribute('aria-hidden');
                nav.removeAttribute('inert');
            }
        };

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            setMenuState(!nav.classList.contains('open'));
        });
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuState(false); });
        document.addEventListener('click', (event) => {
            if (!nav.classList.contains('open') || !header) return;
            if (!header.contains(event.target)) setMenuState(false);
        });

        const syncMobileMenu = () => {
            setMenuState(false);
            body.classList.toggle('betsala-mobile-nav-ready', mobileMedia.matches);
        };
        if (mobileMedia.addEventListener) mobileMedia.addEventListener('change', syncMobileMenu);
        else if (mobileMedia.addListener) mobileMedia.addListener(syncMobileMenu);
        syncMobileMenu();
    }

    const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
    const isSideLayout = body.classList.contains('header-layout-side-left');
    if (sidebarToggle && isSideLayout) {
        const storageKey = 'betsalaSidebarCollapsed';
        const icon = sidebarToggle.querySelector('span');
        const setSidebarState = (collapsed, remember = true) => {
            const desktopCollapsed = Boolean(collapsed && window.innerWidth > 920);
            body.classList.toggle('sidebar-collapsed', desktopCollapsed);
            sidebarToggle.setAttribute('aria-expanded', String(!desktopCollapsed));
            sidebarToggle.setAttribute('aria-label', desktopCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral');
            if (icon) icon.textContent = desktopCollapsed ? '→' : '←';
            if (remember && window.innerWidth > 920) {
                try { localStorage.setItem(storageKey, desktopCollapsed ? '1' : '0'); } catch (e) {}
            }
        };
        let saved = false;
        try { saved = localStorage.getItem(storageKey) === '1'; } catch (e) {}
        setSidebarState(saved, false);
        sidebarToggle.addEventListener('click', () => setSidebarState(!body.classList.contains('sidebar-collapsed')));
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 920) setSidebarState(false, false);
            else {
                try { setSidebarState(localStorage.getItem(storageKey) === '1', false); }
                catch (e) { setSidebarState(false, false); }
            }
        });
    }

    document.querySelectorAll('[data-faq] .faq-item').forEach((item) => {
        const button = item.querySelector('button'); if (!button) return;
        button.addEventListener('click', () => {
            const isOpen = item.classList.toggle('open'); button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
        reveals.forEach((el) => observer.observe(el));
    } else { reveals.forEach((el) => el.classList.add('is-visible')); }
})();
