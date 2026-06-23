# -*- coding: utf-8 -*-
"""Generate the multi-page SEO structure for kllo.com.ua from the
single-page Webflow export, reusing the original head/navbar/footer chrome."""
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.kllo.com.ua"

P = lambda name: open(os.path.join(ROOT, "_partials", name), encoding="utf-8").read()

def rootify(s: str) -> str:
    """Make Webflow relative asset paths root-relative so they work in subfolders."""
    s = re.sub(r'(src|href)="css/', r'\1="/css/', s)
    s = re.sub(r'(src|href)="js/', r'\1="/js/', s)
    s = re.sub(r'(src|href)="images/', r'\1="/images/', s)
    s = s.replace('href="site.webmanifest"', 'href="/site.webmanifest"')
    s = s.replace('href="index.html#"', 'href="/#"')
    s = s.replace('href="index.html"', 'href="/"')
    return s

NAVBAR = rootify(P("navbar.html"))
FOOTER = rootify(P("footer.html"))
BODY_PREFIX = rootify(P("body_prefix.html"))
TAIL = rootify(P("tail.html"))

# ---- Rewire navbar real routes ---------------------------------------------
# Dropdown "Кейси" / "Галерея"
NAVBAR = NAVBAR.replace(
    '<a href="#" class="dropdown-link w-inline-block"><div class="dropdown_inner-container">'
    '<img src="/images/699db2f47b4a477bc049f9ab_case-study-icon.svg"',
    '<a href="/cases/" class="dropdown-link w-inline-block"><div class="dropdown_inner-container">'
    '<img src="/images/699db2f47b4a477bc049f9ab_case-study-icon.svg"', 1)
# "Галерея" — coming soon: keep non-clickable + add a black "скоро" badge
NAVBAR = NAVBAR.replace(
    '<div class="text-13 weight-medium lh-125 text-gray-900">Галерея</div>',
    '<div class="text-13 weight-medium lh-125 text-gray-900">Галерея</div>'
    '<span class="soon-badge">скоро</span>', 1)
# Top-level links: "Послуги" -> /services/, "Процес" -> /#how-it-wroks, "Про нас" -> /about/
NAVBAR = NAVBAR.replace('<a href="#services-block" class="navbar-link">Послуги</a>',
                        '<a href="/services/" class="navbar-link">Послуги</a>')
NAVBAR = NAVBAR.replace('<a href="#how-it-wroks" class="navbar-link">Процес</a>',
                        '<a href="/#how-it-wroks" class="navbar-link">Процес</a>'
                        '<a href="/blog/" class="navbar-link">Блог</a>')
NAVBAR = NAVBAR.replace('<a href="#about" class', '<a href="/about/" class', 1)

# (Львів / Київ links removed from the "Роботи" dropdown per request)

# ---------------------------------------------------------------------------
# HEAD template (built fresh per page; mirrors original meta block)
FONTS = ('<link href="/css/styles.min.css" rel="stylesheet" type="text/css"/>'
         '<link href="/css/cyrillic-fonts.css" rel="stylesheet" type="text/css"/>'
         '<link href="/css/custom.css" rel="stylesheet" type="text/css"/>')
ICONS = ('<link rel="icon" type="image/png" href="/images/favicon-96x96.png" sizes="96x96"/>'
         '<link rel="icon" type="image/svg+xml" href="/images/favicon.svg"/>'
         '<link rel="shortcut icon" href="/images/favicon.ico"/>'
         '<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"/>'
         '<link rel="manifest" href="/site.webmanifest"/>')

def head(title, desc, path, jsonld=""):
    canon = SITE + path
    og = f"{SITE}/images/og-image.jpg"
    ld = f'<script type="application/ld+json">{jsonld}</script>' if jsonld else ""
    return (
        '<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"/>'
        f'<title>{title}</title>'
        f'<meta content="{desc}" name="description"/>'
        f'<meta content="{title}" property="og:title"/>'
        f'<meta content="{desc}" property="og:description"/>'
        f'<meta content="{og}" property="og:image"/>'
        f'<meta content="{canon}" property="og:url"/>'
        '<meta property="og:type" content="website"/>'
        f'<meta content="{title}" name="twitter:title"/>'
        f'<meta content="{desc}" name="twitter:description"/>'
        f'<meta content="{og}" name="twitter:image"/>'
        '<meta content="summary_large_image" name="twitter:card"/>'
        '<meta content="width=device-width, initial-scale=1" name="viewport"/>'
        '<meta content="z790Eh7WsNc3VPeFLSLyBq1OjJBH2QXtrdaDzfvqxfM" name="google-site-verification"/>'
        + FONTS + ICONS +
        f'<link href="{canon}" rel="canonical"/>'
        + ld + '</head>')

# ---------------------------------------------------------------------------
# Reusable content blocks (Webflow design classes)
def hero(h1_main, h1_accent, lead):
    return f'''
<header class="section-hero"><div class="padding-global"><div class="container-1280">
  <div class="spacer-64"></div>
  <div class="tablet_max-width-600">
    <h1 class="pseo_h1">{h1_main} <span class="text-gray-400">{h1_accent}</span></h1>
  </div>
  <div class="spacer-20"></div>
  <div class="pseo-hero-text tablet_max-width-600">{lead}</div>
  <div class="spacer-48 landscape_spacer-40"></div>
  <div class="hero-buttons-row">
    <a href="/contact/" button-black="" data-wf--button-black-m--variant="base" class="button w-inline-block"><div class="z-index-1">Обговорити проєкт</div>
      <div class="button-background"></div></a>
  </div>
  <div class="spacer-64"></div>
</div></div></header>'''

def section(title, intro, items):
    cards = ""
    for t, d in items:
        cards += (f'<div class="pseo-card"><div class="text-20 weight-medium text-gray-900">{t}</div>'
                  f'<div class="spacer-8"></div><div class="text-16 lh-150 text-gray-600">{d}</div></div>')
    return f'''
<section class="section-radius"><div class="padding-global"><div class="container-1280">
  <div class="spacer-64"></div>
  <h2 class="heading-style-h2">{title}</h2>
  <div class="spacer-16"></div>
  <div class="text-18 lh-150 text-gray-600 tablet_max-width-600">{intro}</div>
  <div class="spacer-40"></div>
  <div class="pseo-cards-grid">{cards}</div>
  <div class="spacer-64"></div>
</div></div></section>'''

def faq_block(qas):
    rows = ""
    for q, a in qas:
        rows += (f'<div class="faq-item"><div class="text-20 weight-medium text-gray-900">{q}</div>'
                 f'<div class="spacer-8"></div><div class="text-16 lh-150 text-gray-600">{a}</div>'
                 f'<div class="spacer-24"></div></div>')
    return f'''
<section class="background-gray-100 section-radius"><div class="padding-global"><div class="container-1280">
  <div class="spacer-64"></div>
  <h2 class="heading-style-h2">Часті запитання</h2>
  <div class="spacer-40"></div>{rows}<div class="spacer-32"></div>
</div></div></section>'''

def cta(text):
    return f'''
<section class="section-radius"><div class="padding-global"><div class="container-1280">
  <div class="spacer-64"></div>
  <h2 class="heading-style-h2 tablet_max-width-600">{text}</h2>
  <div class="spacer-32"></div>
  <a href="/contact/" button-black="" data-wf--button-black-m--variant="base" class="button w-inline-block"><div class="z-index-1">Обговорити проєкт</div>
    <div class="button-background"></div></a>
  <div class="spacer-64"></div>
</div></div></section>'''

def project_form(options, context=""):
    """'Create your project' form: category pills + email + submit (like the design).
    Functional via JS: validates email, builds a structured mailto with the chosen
    category + page context, then shows a success state. `context` = page/case name."""
    import html as _html
    pills = ""
    for i, opt in enumerate(options):
        active = " is-active" if i == 0 else ""
        pills += (f'<button type="button" class="proj-form_pill{active}" '
                  f'data-value="{_html.escape(opt, quote=True)}">{opt}</button>')
    ctx_attr = f' data-context="{_html.escape(context, quote=True)}"' if context else ""
    return f'''
<div class="proj-form_card"{ctx_attr}>
  <form action="mailto:inbox@kllo.com.ua" method="post" enctype="text/plain" class="proj-form_form" novalidate>
    <div class="text-24 weight-semibold lh-128 text-gray-900">Створіть проєкт</div>
    <div class="spacer-20"></div>
    <div class="text-15 weight-medium text-gray-700">Чим вам допомогти?</div>
    <div class="spacer-12"></div>
    <div class="proj-form_pills">{pills}</div>
    <input type="hidden" name="help-with" value="{options[0]}" class="proj-form_hidden"/>
    <input type="hidden" name="case" value="{_html.escape(context, quote=True)}"/>
    <div class="spacer-24"></div>
    <label class="text-15 weight-medium text-gray-700" for="proj-email">Ваш email</label>
    <div class="spacer-8"></div>
    <input class="input proj-form_input w-input" maxlength="256" name="email" id="proj-email" placeholder="Введіть email" type="email" autocomplete="email" required=""/>
    <div class="proj-form_error" hidden>Введіть коректний email.</div>
    <div class="spacer-16"></div>
    <button type="submit" button-black="" data-wf--button-black-m--variant="base" class="button is-large proj-form_submit w-inline-block">
      <div class="z-index-1">Почати</div><div class="button-background"></div>
    </button>
  </form>
  <div class="proj-form_success" hidden>
    <div class="text-24 weight-semibold lh-128 text-gray-900">Дякуємо! 🎉</div>
    <div class="spacer-8"></div>
    <div class="text-15 lh-150 text-gray-600">Заявку отримано. Ми відкрили лист — надішліть його, і ми звʼяжемося з вами найближчим часом.</div>
  </div>
</div>'''

def breadcrumbs(trail):
    """trail: list of (label, href or None)"""
    parts = []
    for label, href in trail:
        if href:
            parts.append(f'<a href="{href}" class="text-14 text-gray-500">{label}</a>')
        else:
            parts.append(f'<span class="text-14 text-gray-700">{label}</span>')
    sep = '<span class="text-14 text-gray-400"> / </span>'
    return ('<div class="padding-global"><div class="container-1280"><div class="spacer-24"></div>'
            + sep.join(parts) + '</div></div>')

def faq_jsonld(qas):
    import json
    return json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qas]
    }, ensure_ascii=False)

def service_jsonld(name, desc, path):
    import json
    return json.dumps({
        "@context": "https://schema.org", "@type": "Service",
        "name": name, "description": desc,
        "serviceType": name, "areaServed": "UA",
        "url": SITE + path,
        "provider": {"@type": "Organization", "name": "Kllo", "url": SITE}
    }, ensure_ascii=False)

def localbusiness_jsonld(city, desc, path):
    import json
    return json.dumps({
        "@context": "https://schema.org", "@type": "ProfessionalService",
        "name": f"Kllo — digital-агенція ({city})",
        "description": desc,
        "url": SITE + path,
        "areaServed": {"@type": "City", "name": city},
        # TODO: заповнити реальними даними Google Business Profile по місту
        "telephone": "TODO",
        "address": {"@type": "PostalAddress", "addressLocality": city, "addressCountry": "UA"},
        "parentOrganization": {"@type": "Organization", "name": "Kllo", "url": SITE}
    }, ensure_ascii=False)

def services_links_block(title="Послуги для вашого бізнесу"):
    """Internal links to all service pages — for local-hub pages."""
    items = [
        ("Створення сайтів під ключ", "/services/stvorennia-saitiv/"),
        ("SEO-просування сайтів", "/services/seo-prosuvannia/"),
        ("SEO-аудит сайту", "/services/seo-audit/"),
        ("UX/UI дизайн", "/services/ux-ui-dyzain/"),
        ("Редизайн сайту", "/services/redesign-saitu/"),
        ("Digital-маркетинг", "/services/marketing/"),
        ("Мобільні додатки", "/services/mobilni-dodatky/"),
        ("Сайти на Webflow / Framer", "/services/webflow-framer/"),
    ]
    cards = ""
    for t, h in items:
        cards += (f'<a href="{h}" class="pseo-card w-inline-block">'
                  f'<div class="text-20 weight-medium text-gray-900">{t}</div></a>')
    return f'''
<section class="section-radius"><div class="padding-global"><div class="container-1280">
  <div class="spacer-64"></div>
  <h2 class="heading-style-h2">{title}</h2>
  <div class="spacer-40"></div>
  <div class="pseo-cards-grid">{cards}</div>
  <div class="spacer-64"></div>
</div></div></section>'''

# ---------------------------------------------------------------------------
def write_page(path, html):
    out_dir = ROOT + path
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", path + "index.html", f"({len(html)} bytes)")

def page(path, title, desc, crumbs, body, jsonld=""):
    html = (head(title, desc, path, jsonld) + BODY_PREFIX + NAVBAR
            + breadcrumbs(crumbs) + body + FOOTER + TAIL)
    write_page(path, html)

import pages  # content lives in pages.py
pages.build(globals())
