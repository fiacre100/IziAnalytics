# 📋 CAHIER DES CHARGES DÉTAILLÉ & SPÉCIFICATIONS TECHNIQUES (PRD)
# PROJET : IziAnalytics
## *Analytics & Revenue Tracking pour Fondateurs de Micro-SaaS & Créateurs*

---

## 1. VISION DU PRODUIT & POSITIONNEMENT STRATÉGIQUE

### 1.1 La Promesse
**« Vois en 10 secondes sur ton smartphone d'où viennent tes visiteurs et combien d'argent tu gagnes — sans cookie banner, sans usine à gaz, sans ralentir ton site. »**

### 1.2 Le Problème Réel Résolu
* **Google Analytics (GA4) :** Trop lourd, illisible pour un créateur, exige des bandeaux de cookies (RGPD), configuration complexe.
* **Mixpanel / PostHog :** Outils d'ingénieurs produit, payants en dollars avec cartes bancaires internationales, métriques de churn/LTV trop complexes à paramétrer.
* **Le besoin du fondateur de micro-SaaS :**
  1. Combien de visiteurs uniques aujourd'hui ?
  2. Quelle vidéo / lien a amené ce trafic (TikTok, Instagram Reels, WhatsApp, X, Google) ?
  3. Combien ont cliqué sur le bouton de paiement ?
  4. Combien de revenus générés en direct ?

---

## 2. STACK TECHNIQUE STANDARDISÉE (0€ DE DÉPENSE EXTERNE)

Tout repose sur des technologies gratuites et scalables :

* **Framework Full-Stack :** Next.js 14 (App Router) + TypeScript.
* **Design & UI :** Tailwind CSS + composants shadcn/ui + Lucide Icons + Recharts (graphiques épurés).
* **Base de données & Auth :** Supabase (PostgreSQL + Auth Google en 1 clic + Row Level Security actif).
* **Moteur d'IA intégré :** Google AI Studio (API Gemini 1.5 Flash gratuite) pour générer le "Digest IA Quotidien" (*ex: « Ton trafic TikTok a augmenté de +45% aujourd'hui, mais ton taux de conversion au paywall a baissé de 2%. Voici la recommandation... »*).
* **Déploiement & CI/CD :** Vercel (Hébergement gratuit) + GitHub.
* **Passerelles de Paiement :**
  * **SasPay / FedaPay / CinetPay :** Mobile Money (Wave, Orange Money, MTN, Moov) pour l'Afrique et la diaspora.
  * **Stripe / Whop :** Cartes bancaires internationales.

---

## 3. ARCHITECTURE DES DONNÉES (SCHÉMA SUPABASE POSTGRESQL)

### Table 1 : `users` (Profils des Fondateurs)
* `id` : UUID (Primary Key, lié à `auth.users`)
* `email` : TEXT NOT NULL
* `full_name` : TEXT
* `currency` : TEXT DEFAULT 'XOF' (ou 'EUR', 'USD')
* `plan` : TEXT DEFAULT 'free' ('free', 'pro_monthly', 'pro_annual')
* `subscription_status` : TEXT DEFAULT 'trial'
* `created_at` : TIMESTAMP WITH TIME ZONE DEFAULT NOW()

### Table 2 : `websites` (Projets / SaaS Trackés)
* `id` : UUID (Primary Key)
* `user_id` : UUID (Foreign Key -> `users.id`)
* `name` : TEXT NOT NULL (ex: "Mon Super SaaS")
* `domain` : TEXT NOT NULL (ex: "monsaas.com")
* `tracking_id` : TEXT UNIQUE NOT NULL (ex: "izi_live_abc123")
* `created_at` : TIMESTAMP WITH TIME ZONE DEFAULT NOW()

### Table 3 : `pageviews` (Événements de Trafic Ultra-Légers)
* `id` : BIGSERIAL (Primary Key)
* `website_id` : UUID (Foreign Key -> `websites.id`)
* `path` : TEXT NOT NULL (ex: "/", "/pricing", "/checkout")
* `referrer` : TEXT (ex: "tiktok.com", "instagram.com", "direct", "wa.me")
* `source` : TEXT (tag UTM ou détecté : "tiktok", "reels", "whatsapp", "google")
* `country` : TEXT (code pays : "SN", "CI", "FR", "BJ", "CM")
* `device` : TEXT ("mobile", "desktop", "tablet")
* `browser` : TEXT ("chrome", "safari", "tiktok_inapp")
* `session_id` : TEXT NOT NULL (hash anonyme quotidien sans cookies)
* `created_at` : TIMESTAMP WITH TIME ZONE DEFAULT NOW()

### Table 4 : `conversions` (Paiements & Objectifs Clés)
* `id` : BIGSERIAL (Primary Key)
* `website_id` : UUID (Foreign Key -> `websites.id`)
* `session_id` : TEXT NOT NULL
* `event_name` : TEXT NOT NULL (ex: "checkout_click", "payment_success")
* `amount` : NUMERIC DEFAULT 0
* `currency` : TEXT DEFAULT 'XOF'
* `created_at` : TIMESTAMP WITH TIME ZONE DEFAULT NOW()

---

## 4. LE SCRIPT DE TRACKING (COLLECTEUR 1 LIGNE < 2 Ko)

Le client insère simplement cette balise dans le `<head>` de son SaaS :
```html
<script defer src="https://izianalytics.app/script.js" data-site="izi_live_abc123"></script>
```

### Fonctionnalités du script :
1. Poids plume : **moins de 1.8 Ko** (aucun impact sur la vitesse Google PageSpeed).
2. **Zero-Cookie :** Respect strict de la vie privée (pas besoin d'afficher de bandeau de cookies RGPD).
3. Détection automatique des referrers sociaux (TikTok in-app browser, Instagram, WhatsApp Web/App, YouTube).
4. Détection automatique des clics sur les boutons de paiement (attribut `data-izi-event="pay"`).

---

## 5. LES 4 ÉCRANS DE L'APPLICATION

### Écran 1 : La Landing Page (Conversion Maximale)
* **Hero Section :** Titre percutant, capture vidéo brute d'un smartphone montrant le dashboard en direct, bouton CTA "Commencer Gratuitement".
* **Comparatif en 3 colonnes :** Google Analytics (Rouge / Compliqué) vs Mixpanel (Orange / Cher en $) vs IziAnalytics (Vert / Simple, 3 chiffres, Mobile Money).
* **Tarifs clairs :** 
  * Gratuit : Jusqu'à 1 000 vues/mois (floutage partiel des métriques avancées au-delà).
  * Annuel Pro : 39 000 FCFA / an (~59 € / an) par défaut.
  * Mensuel Pro : 4 900 FCFA / mois (~7,50 € / mois).

### Écran 2 : L'Onboarding en 3 Questions
1. "Quel est le nom de ton projet / SaaS ?"
2. "Quel est son lien de domaine (ex: monsaas.com) ?"
3. "Générer mon script de tracking" -> Affichage de la balise prête à copier en 1 clic.

### Écran 3 : Le Dashboard Principal (Minimaliste & Mobile-First)
* **En-tête :** Sélecteur de date (Aujourd'hui, 7 jours, 30 jours) + Statut en direct (pastille verte "3 personnes en ligne actuellement").
* **Les 3 Cartes Majeures :**
  1. **Visiteurs Uniques** (avec comparatif % veille).
  2. **Top Source de Trafic** (ex: 68% TikTok, 22% WhatsApp, 10% Direct).
  3. **Revenus / Ventes Encaissées** (taux de conversion global).
* **Graphique épuré :** Courbe heure par heure des visites.
* **Top 5 des Pages Vues.**
* **Résumé IA Gemini en 1 clic :** "Analyser mes stats du jour" -> Résumé texte actionnable généré par Gemini 1.5 Flash.

### Écran 4 : Le Paywall & Paramètres de Compte
* Intégration SasPay (Mobile Money Wave/Orange/MTN) + Stripe.
* Option Add-on au panier (+25% de CA) : "Pack de 10 Templates de Landing Pages Optimisées pour la Conversion" (9 900 FCFA / 15 €).

---

## 6. SÉCURITÉ & RÈGLES CRITIQUES (Row Level Security Supabase)

* Toutes les tables Supabase ont `RLS ENABLED`.
* Politiques de sécurité :
  * `SELECT`, `UPDATE`, `DELETE` sur `websites` réservés uniquement à `auth.uid() = user_id`.
  * `INSERT` sur `pageviews` ouvert via fonction API serveur sécurisée (Next.js Route Handler avec rate limiting par IP).
  * Les clés secrètes `SUPABASE_SERVICE_ROLE_KEY` et `GEMINI_API_KEY` ne doivent JAMAIS être préfixées par `NEXT_PUBLIC_` et restent enfermées côté serveur.
