# 🎨 STITCH DESIGN SYSTEM & BLUEPRINT : IziAnalytics
# Architecture Visuelle Ultra-Premium pour Google Stitch & AI Studio

Ce document contient l'intégralité des directives artistiques, de la charte visuelle (tokens, gradients, glassmorphism) et des prompts exacts à injecter dans **Google Stitch** pour générer les maquettes haute fidélité de niveau mondial avant importation dans **Google AI Studio**.

---

## 1. DIRECTION ARTISTIQUE : « Linear / Vercel Dark Mode »

Pour que le produit inspire immédiatement une confiance absolue (et justifie un abonnement payé sans hésiter), le design ne doit pas ressembler à un template Bootstrap ou un projet d'étudiant. Il doit emprunter les codes des meilleurs produits tech de 2026 :

* **Ambiance :** Dark mode profond, contrastes ciselés, typographies denses et épurées.
* **Palette de Couleurs :**
  * Fond principal : `#05070B` (Noir spatial profond)
  * Fond cartes (Surfaces) : `#0D111A` avec bordures subtiles `rgba(255, 255, 255, 0.08)`
  * Accent Primaire (Signal de vie & Conversion) : **Émeraude / Vert Néon** (`#10B981` / `#059669`)
  * Accent Secondaire (Intelligence & IA Gemini) : **Indigo Électrique / Violet Deep** (`#6366F1` / `#8B5CF6`)
  * Signal d'alerte : Ambre discret (`#F59E0B`)
* **Effets Visuels Clés :**
  * **Glow & Mesh Gradients :** Halos lumineux diffus en arrière-plan des métriques importantes.
  * **Glassmorphism Sobre :** `backdrop-filter: blur(16px)` sur la barre de navigation et les modales.
  * **Micro-badges typographiques :** Police monospace pour les chiffres, devises et pourcentages.

---

## 2. PROMPT GOOGLE STITCH #1 : LE DASHBOARD PROPRIÉTAIRE (Web & Mobile)

Copiez-collez ce prompt textuel dans le canvas **Google Stitch** pour générer l'écran de contrôle :

```text
Create an ultra-premium, dark-mode analytics dashboard designed for SaaS solopreneurs and digital creators, inspired by Linear, Raycast, and Vercel. 

Canvas Theme:
- Background: Pitch black (#06080D) with subtle dark navy surfaces (#0E131F) and fine borders (1px solid rgba(255,255,255,0.07)).
- Accent Colors: Vibrant neon emerald (#10B981) for revenue/conversions, electric indigo (#6366F1) for AI insights, and soft slate (#94A3B8) for secondary data.

Header:
- Sleek top bar with subtle logo icon, project selector dropdown ("CalFood Africa"), live pulsating green beacon ("18 online now"), date range toggle (Today, 7D, 30D), and a minimalist user profile avatar.

Section 1: The Three Golden Metrics (Hero Cards):
- Card 1: "Unique Visitors" -> Bold metric "2,840" with an emerald badge "+54% vs yesterday" and a clean sparkline graph.
- Card 2: "Top Traffic Driver" -> Bold metric "TikTok (68%)" with subtitle "1,930 clicks from link-in-bio", accompanied by social icons.
- Card 3: "Real-Time Revenue" -> Bold metric "384,500 FCFA ($630)" with badge "42 sales" and payment gateway pills: "Wave (60%)", "Orange Money (30%)", "Stripe (10%)".

Section 2: Gemini AI Strategist Widget:
- A glassmorphic card with an indigo/violet glowing gradient border.
- Title: "Gemini 1.5 Flash • Live Growth Digest" with a glowing sparkle icon.
- 3 clear, crisp executive bullets:
  1. "🔥 TikTok viral spike: Your 14:00 video is driving 85% of traffic. Conversion on the mobile checkout is at 4.2%."
  2. "⚠️ Friction Alert: 14 visitors dropped off at the card payment step. Mobile Money accounted for 92% of completed checkouts."
  3. "🎯 Recommended Action: Launch a follow-up story on WhatsApp targeting the abandoned sessions."
- Action button: "Ask Gemini for Next Move" (pill button, subtle hover state).

Section 3: Live Attribution & Funnel (2-column layout):
- Left column: "Traffic Sources Breakdown" -> Visual progress bars for TikTok (68%), WhatsApp Direct (20%), Instagram Reels (8%), Google Search (4%).
- Right column: "Device & Conversion Rate" -> Circular radial progress or clean funnel showing: 2,840 Visits -> 310 Checkout Page views (10.9%) -> 42 Completed Orders (13.5% checkout conversion).

Style: Sharp typography (Inter/Geist), generous whitespace, no cartoonish icons, zero clutter, high executive density.
```

---

## 3. PROMPT GOOGLE STITCH #2 : LA LANDING PAGE DE HAUTE CONVERSION

Copiez-collez ce prompt textuel dans **Google Stitch** pour générer la page d'accueil publique :

```text
Create a high-converting, world-class SaaS landing page for "IziAnalytics", an ultra-minimalist revenue & traffic tracker built for creators and SaaS founders in emerging and international markets.

Aesthetic:
- Dark luxury aesthetic, deep charcoal background, subtle green ambient glow behind hero elements, typography reminiscent of Stripe and Vercel.

Hero Section:
- Announcement Pill: "Zero-Cookie • Built for TikTok, Reels & WhatsApp Traffic" with green glowing dot.
- Headline (Massive, tight tracking): "Know where your money comes from in 10 seconds. Not 30 minutes."
- Subheadline: "Replace Google Analytics' complex maze with a single dashboard that tracks your visitors, orders, and Mobile Money & Stripe payments in real-time. Less than 2KB script. Zero privacy banners."
- Dual CTA: Primary button "Start Free Trial (1-click script)" in bright emerald, Secondary button "Explore Interactive Live Demo" in dark frosted glass.
- Social Proof Bar: "Trusted by 500+ micro-SaaS founders across Africa & Diaspora" with subtle minimalist logos.

Product Showcase:
- A high-resolution, angled 3D mockup of the IziAnalytics dashboard running on both a desktop browser and an iPhone 16 screen, displaying real African CFA Francs and USD metrics.

The "Kill Google Analytics" Comparison Table:
- A beautifully styled 3-column comparison table:
  - Column 1: Feature / Pain Point
  - Column 2: Google Analytics 4 (Red badges, "Complex maze, 45KB slow script, Cookie banner required, No Mobile Money tracking")
  - Column 3: IziAnalytics (Glowing green border, "10-second glance, 1.8KB featherweight script, Zero-cookie privacy compliance, Native Wave / Orange Money / Stripe attribution")

Pricing Tier Section:
- Clean 2-card layout with the "Annual Pro" card highlighted as "Best Value (Save 50%)":
  - Card 1: Starter (Free forever up to 1,000 views)
  - Card 2: Founder Pro (Annual billing default: 39,000 FCFA / year (~$60/yr) with "Mobile Money & Card Accepted in 1 click").
  - Order Bump Banner: "Optional add-on: 10 High-Converting Landing Page Templates (+9,900 FCFA)".

Footer: Minimalist, clean links, copyright, compliance guarantees.
```

---

## 4. WORKFLOW D'IMPORTATION : DE GOOGLE STITCH VERS GOOGLE AI STUDIO

Une fois vos deux écrans générés et validés sur votre canvas Stitch :

1. **Sur Google Stitch :**
   * Cliquez sur le bouton **Export** en haut à droite.
   * Choisissez **Export to Google AI Studio** (ou téléchargez le bundle `HTML / Tailwind CSS`).
2. **Sur Google AI Studio :**
   * Ouvrez un nouveau prompt système avec **Gemini 1.5 Pro**.
   * Injectez le bundle Stitch et le prompt de liaison :
     > *« Voici les maquettes et composants exportés depuis Google Stitch pour IziAnalytics. Intègre cette charte visuelle exacte dans le projet Next.js existant : remplace les composants basiques par ces designs glassmorphiques haute fidélité, connecte les graphiques interactifs Recharts, et relie les données en direct de l'API /api/collect. »*
3. **Récupération du code :**
   * Dès que le code haute fidélité est généré dans AI Studio, vous me le collez ici, ou je l'applique directement dans vos fichiers Next.js pour le voir tourner immédiatement en local sur votre machine !
