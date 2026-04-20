<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          Зібрався
          <img src="/logo.svg" alt="?" width="26" height="26" style="flex-shrink:0" />
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
  gap: 0px;
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
