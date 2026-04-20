<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="11.5" stroke="currentColor" stroke-width="1.6"/>
            <path d="M10 10C10 8.34 11.34 7 13 7C14.66 7 16 8.34 16 10C16 11.3 15.2 12.4 14.06 12.83C13.43 13.07 13 13.66 13 14.33V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="13" cy="18" r="1" fill="currentColor"/>
          </svg>
          <span>Зібрався</span>
        </div>
        <p class="footer-desc">Місце, де люди знаходять однодумців і створюють спільні моменти по всій Україні.</p>
        <a href="mailto:hello@zibravsia.ua" class="footer-email">hello@zibravsia.ua</a>
      </div>
      <div class="footer-links">
        <RouterLink to="/events">Події</RouterLink>
        <RouterLink to="/about">Про нас</RouterLink>
        <RouterLink to="/auth">Увійти</RouterLink>
      </div>
      <p class="footer-copy">© 2026 Зібрався</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--border); padding: 48px 0 32px; margin-top: 80px; }
.footer-inner { display: grid; grid-template-columns: 1fr auto auto; gap: 40px; align-items: start; }

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--yellow);
  margin-bottom: 12px;
}

.footer-desc { font-size: 14px; color: var(--text-muted); max-width: 280px; line-height: 1.7; margin-bottom: 12px; }
.footer-email { font-size: 13px; color: var(--lavender); transition: color var(--transition); }
.footer-email:hover { color: var(--text); }

.footer-links { display: flex; flex-direction: column; gap: 12px; }
.footer-links a { font-size: 14px; color: var(--text-muted); transition: color var(--transition); }
.footer-links a:hover { color: var(--text); }

.footer-copy { font-size: 13px; color: var(--text-muted); align-self: end; }

@media (max-width: 640px) { .footer-inner { grid-template-columns: 1fr; gap: 24px; } }
</style>
