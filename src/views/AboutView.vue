<template>
  <div class="about-page">
    <div class="container">

      <div class="about-hero">
        <p class="about-label">Про проект</p>
        <h1 class="about-title">Зібрався — це про людей,<br />а не про події</h1>
        <p class="about-intro">Ми не агрегатор концертів і не квиткова каса. Зібрався — це місце, де звичайна людина може написати «хочу зробити чайну церемонію для 6 людей у суботу у Львові» — і знайти саме цих людей.</p>
      </div>

      <div class="about-grid">
        <div class="about-card">
          <span class="about-num">01</span>
          <h3>Безпека понад усе</h3>
          <p>Адреса зустрічі не публікується публічно. Її отримують лише ті, хто зареєструвався. Ти сам вирішуєш, кому довіряти.</p>
        </div>
        <div class="about-card">
          <span class="about-num">02</span>
          <h3>Маленькі групи</h3>
          <p>Більшість подій — до 15 осіб. Це не фестиваль, це зустріч. Ти підеш додому зі знайомими, а не просто з враженнями.</p>
        </div>
        <div class="about-card">
          <span class="about-num">03</span>
          <h3>Без монетизації</h3>
          <p>Організатори — такі самі люди як ти. Вони не продають квитки, вони збирають компанію для того, що їм цікаво.</p>
        </div>
        <div class="about-card">
          <span class="about-num">04</span>
          <h3>Вся Україна</h3>
          <p>Київ, Львів, Одеса, Харків, Дніпро — і далі. Ми хочемо, щоб двіж був скрізь, де є люди які шукають своїх.</p>
        </div>
      </div>

      <div class="about-quote">
        <blockquote>«Найкращі речі трапляються коли хтось просто каже — а давайте зберемось?»</blockquote>
      </div>

      <!-- Contact section -->
      <div class="contact-section">
        <div class="contact-inner">
          <div class="contact-text">
            <p class="contact-label">Зв'язок</p>
            <h2 class="contact-title">Є питання або ідея?</h2>
            <p class="contact-sub">Ми відкриті до будь-яких пропозицій — від нових міст до покращення функціоналу. Пишіть, читаємо все.</p>
            <a href="mailto:hello@zibravsia.ua" class="btn btn-primary contact-btn">Написати нам</a>
            <p class="contact-email-hint">hello@zibravsia.ua</p>
          </div>
          <div class="contact-deco">
            <div class="contact-orb"></div>
            <div class="contact-card-deco">
              <span class="deco-line"></span>
              <span class="deco-dot"></span>
              <span class="deco-line"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="about-cta">
        <h2>Хочеш бути організатором?</h2>
        <p>Зареєструйся і створи свою першу подію за 5 хвилин. Ніяких правил — тільки ідея і бажання.</p>
        <RouterLink to="/auth" class="btn btn-primary">Зареєструватись</RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.about-page { padding: 60px 0 80px; }
.about-hero { max-width: 760px; margin-bottom: 72px; }
.about-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--lavender); margin-bottom: 20px; font-weight: 500; }
.about-title { font-family: var(--font-display); font-size: clamp(28px, 5vw, 52px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 24px; }
.about-intro { font-size: 18px; color: var(--text-muted); line-height: 1.8; }

.about-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-bottom: 72px; }
.about-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; transition: border-color var(--transition); }
.about-card:hover { border-color: var(--border-hover); }
.about-num { display: block; font-family: var(--font-display); font-size: 13px; color: var(--lavender); letter-spacing: 0.05em; margin-bottom: 16px; }
.about-card h3 { font-family: var(--font-display); font-size: 17px; font-weight: 600; margin-bottom: 12px; }
.about-card p { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

.about-quote { border-left: 2px solid var(--yellow); padding: 8px 0 8px 32px; margin-bottom: 72px; }
.about-quote blockquote { font-size: clamp(18px, 3vw, 26px); font-style: italic; color: var(--text-muted); line-height: 1.5; }

/* Contact */
.contact-section {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 56px 48px;
  margin-bottom: 32px;
  overflow: hidden;
}

.contact-inner {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 40px;
  align-items: center;
}

.contact-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--lavender); margin-bottom: 16px; font-weight: 500; }
.contact-title { font-family: var(--font-display); font-size: clamp(22px, 3vw, 32px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; }
.contact-sub { font-size: 15px; color: var(--text-muted); line-height: 1.7; max-width: 420px; margin-bottom: 28px; }

.contact-btn { display: inline-flex; }
.contact-email-hint { margin-top: 12px; font-size: 13px; color: var(--text-muted); }

.contact-deco { position: relative; display: flex; align-items: center; justify-content: center; height: 120px; }
.contact-orb { position: absolute; width: 160px; height: 160px; border-radius: 50%; background: var(--lavender); filter: blur(50px); opacity: 0.15; }
.contact-card-deco { display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative; }
.deco-line { display: block; width: 2px; height: 32px; background: linear-gradient(to bottom, transparent, var(--lavender), transparent); }
.deco-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--yellow); box-shadow: 0 0 16px var(--yellow); }

/* CTA */
.about-cta { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 48px; text-align: center; margin-top: 32px; }
.about-cta h2 { font-family: var(--font-display); font-size: clamp(22px, 3vw, 32px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; }
.about-cta p { color: var(--text-muted); font-size: 15px; max-width: 400px; margin: 0 auto 28px; line-height: 1.7; }

@media (max-width: 640px) {
  .contact-section { padding: 32px 24px; }
  .contact-inner { grid-template-columns: 1fr; }
  .contact-deco { display: none; }
  .about-cta { padding: 32px 24px; }
}
</style>
