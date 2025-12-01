# SpinBack Studio — Clause Reframe Console

SpinBack Studio turns dense, legalistic clauses into four short, human-readable “spinbacks” and a simple color-coded Tone Signal that reflects how the language *feels* — not what it means legally.

> **Important:** SpinBack Studio does **not** provide legal advice. It only analyzes and reframes *tone and style*.

---

## 🧠 What It Is

SpinBack Studio is a small but opinionated web app built for people who are tired of scrolling past endless Terms & Conditions without any sense of what they’re agreeing to.

You paste in a clause from a T&C, content license, platform rule, or policy. The app:

- Generates **four rewrites** of that clause:
  - `plain` – clear, neutral, simple language
  - `cheeky` – lightly playful, irreverent but not hostile
  - `psa` – awareness-focused “heads up” tone
  - `succulent` – richer, textured language that surfaces emotional subtext

- Returns a **Tone Signal**:
  - `green` – language sounds standard and low-friction
  - `yellow` – language sounds vague, concerning, or open-ended
  - `red` – language includes hostile, harmful, coercive, or threatening phrasing

The whole point: make the “vibe layer” of policy text visible in seconds.

---

## 🤔 Why It Exists

Most tools that touch legal text either:

- Pretend to summarize enforceability, or  
- Drown you in more legalese.

SpinBack Studio does something deliberately simpler and safer:

- **It doesn’t interpret law.**
- **It doesn’t tell you what’s fair.**
- **It doesn’t say what’s binding.**

Instead, it translates *tone*.

We focus on the human reading experience: “Does this sound casual, vague, controlling, aggressive?” That’s often the first instinct people have before they ever call a lawyer — and that instinct is exactly what SpinBack Studio tries to honor.

---

## ✨ Core Features

- **Clause Input:** Paste any single clause or short section of T&Cs, policies, or licenses.
- **Four Spinbacks:**
  - **Plain:** A neutral, clear version stripped of legal jargon.
  - **Cheeky:** A wink, not a punch — playful without becoming hostile.
  - **PSA:** A “friend in the group chat” framing: what you should pay attention to.
  - **Succulent:** Our signature voice; textured, premium language that captures the emotional and power dynamics of the clause.
- **Tone Signal (Green / Yellow / Red):**
  - Linguistic-only analysis based on wording patterns.
  - **Green** → standard, non-alarming phrasing.
  - **Yellow** → vague, open-ended, or “this feels off” style language.
  - **Red** → any presence of threats, coercion, hostility, intimidation, or harmful phrasing (even once).
- **JSON Under the Hood:**
  - Responses are structured with explicit fields: `spinbacks`, `tone_signal`, `tone_reason`, `warnings`.
  - Frontend renders these into cards and a simple tone badge.

---

## 🛟 Safety & Limitations

SpinBack Studio is intentionally limited.

- It does **not**:
  - Give legal advice or opinions.
  - Judge the fairness, enforceability, or legality of any clause.
  - Replace lawyers, regulators, or formal review.

- It **only**:
  - Rewrites text for human readability.
  - Labels linguistic tone and style.
  - Highlights when phrasing *sounds* vague, concerning, or hostile.

**Hybrid Tone Signal Logic:**

- Mild snark, sarcasm, or corporate fuzziness → often **Yellow**.
- Any instance of:
  - threats (“we will punish…”, “you will be jailed…”),
  - coercion,
  - intimidation,
  - explicit harm,
  - or apathy toward user rights (“we don’t care”),
  
  …triggers **Red**, regardless of how long or otherwise neutral the full clause is.

This keeps the tool expressive without crossing into legal interpretation.

---

## 🏗️ Architecture Overview

> Note: adjust this section if your actual stack differs.

- **Frontend:**  
  - React / Next.js (or your chosen framework)  
  - Single-page interface with:
    - Input textarea
    - “Spin Back” button
    - Four output cards
    - Tone Signal badge and explanation
    - Mobile-responsive layout

- **Backend / Function:**
  - Edge function that:
    - Receives the clause
    - Calls the LLM with a strict system prompt
    - Returns JSON with:
      - `spinbacks` (plain/cheeky/psa/succulent)
      - `tone_signal` (green/yellow/red)
      - `tone_reason` (short natural language explanation)
      - `warnings` (e.g., “This is not legal advice”)

- **LLM Prompting:**
  - “Succulent Tech Tone” is implemented via system prompt constraints.
  - Four distinct output personas for each spinback style.
  - Hard constraints against:
    - Legal advice
    - Claims of enforceability
    - Changes to the underlying rights

---

## 🚀 Getting Started

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd spinback-studio
