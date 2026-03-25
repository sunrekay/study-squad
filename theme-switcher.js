(() => {
  const STORAGE_KEY = 'study_theme';
  const root = document.documentElement;

  const readTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      const isLight = theme === 'light';
      toggle.classList.toggle('is-light', isLight);
      toggle.setAttribute('aria-pressed', String(isLight));
    });
  };

  const buildToggle = (id) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    if (id) btn.id = id;
    btn.setAttribute('aria-label', 'Переключить тему');
    btn.setAttribute('title', 'Переключить тему');
    btn.innerHTML = [
      '<span class="theme-toggle-track">',
      '<span class="theme-toggle-label theme-toggle-label-dark">NIGHT</span>',
      '<span class="theme-toggle-label theme-toggle-label-light">DAY</span>',
      '<span class="theme-toggle-thumb" aria-hidden="true"></span>',
      '</span>'
    ].join('');
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    return btn;
  };

  const init = () => {
    // Применяем сохранённую тему
    applyTheme(readTheme());

    // ── Десктоп: кнопка в sidebar-bottom или page-header ──
    const sidebarBottom = document.querySelector('.sidebar-bottom');
    const pageHeader = document.querySelector('.page-header');

    if (!document.querySelector('.theme-toggle--desktop')) {
      const desktopToggle = buildToggle('theme-toggle-desktop');
      desktopToggle.classList.add('theme-toggle--desktop');

      if (sidebarBottom) {
        sidebarBottom.insertAdjacentElement('afterbegin', desktopToggle);
      } else if (pageHeader) {
        let slot = pageHeader.querySelector('.theme-toggle-slot');
        if (!slot) {
          slot = document.createElement('div');
          slot.className = 'theme-toggle-slot';
          pageHeader.appendChild(slot);
        }
        slot.appendChild(desktopToggle);
      } else {
        desktopToggle.classList.add('theme-toggle--floating');
        document.body.appendChild(desktopToggle);
      }
    }

    // ── Мобилка: кнопка в mobile-header ──
    const mobileHeader = document.querySelector('.mobile-header');
    if (mobileHeader && !document.querySelector('.theme-toggle--mobile')) {
      const mobileToggle = buildToggle('theme-toggle-mobile');
      mobileToggle.classList.add('theme-toggle--mobile');

      // Ищем пустой слот справа (обычно div с width:60px)
      const rightSlot = mobileHeader.lastElementChild;
      if (rightSlot && rightSlot !== mobileHeader.firstElementChild) {
        rightSlot.innerHTML = '';
        rightSlot.appendChild(mobileToggle);
      } else {
        mobileHeader.appendChild(mobileToggle);
      }
    }

    // Синхронизируем все кнопки с текущей темой
    applyTheme(readTheme());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
