# TymOra — MVP Definition & Product Blueprint

---

## 🧩 1. MVP Feature List

### 🎯 MVP Goal

Help users **see where their day actually goes** and provide **actionable insights** with minimal friction.

---

### ✅ Core Features (Must-Have)

#### 1️⃣ Fast Activity Logging

* One-tap **Start / Switch activity**
* Manual time entry (for past activities)
* Category & sub-category
* Auto duration calculation
* Edit / reclassify activities

#### 2️⃣ Daily Timeline View

* Chronological timeline of the day
* Color-coded by category
* Gaps highlighted (untracked time)

#### 3️⃣ Daily Summary Dashboard

* Total tracked time
* Category breakdown (pie / bar)
* Top 3 time-consuming activities
* First & last activity of the day

#### 4️⃣ Insight Engine (Rule-Based for MVP)

* 2–5 short insights per day
* Plain-language insights (not charts only)

#### 5️⃣ Local-First Storage

* Works offline
* Daily data stored locally
* Export as JSON

---

### 🚫 Out of MVP (Phase 2+)

* AI free-text analysis
* Calendar auto-import
* Wearable integrations
* Social / sharing features
* Goals, streaks, gamification

---

## 🧠 2. Insight Rules & Algorithms (MVP)

> **Principle:** Insights must be *actionable*, not decorative.

---

### 🔍 Insight Category 1: Time Allocation

#### Rule: Category Dominance

```text
If category_time > 40% of total_day_time
→ Trigger insight
```

**Example**

> “Home activities dominated your day (52%). Consider planning a lighter household day tomorrow.”

---

#### Rule: Missing Priority Time

```text
If Learning OR Health < 30 minutes
→ Highlight gap
```

**Example**

> “You spent little time on learning today. Even 15 minutes tomorrow could help maintain consistency.”

---

### 🔄 Insight Category 2: Context Switching

#### Rule: Frequent Switching

```text
If activity_count > 12 in a day
→ High context switching
```

**Example**

> “Your day had frequent activity switches. Grouping similar tasks may improve focus.”

---

### ⚡ Insight Category 3: Energy vs Effort Mismatch

#### Rule: Late High-Effort Tasks

```text
If high-effort activities occur after 8 PM
→ Fatigue risk
```

**Example**

> “You handled demanding home tasks late in the evening. Consider moving them earlier if possible.”

---

### 🕳️ Insight Category 4: Untracked Time

#### Rule: Logging Gaps

```text
If untracked_time > 60 minutes
→ Awareness alert
```

**Example**

> “About 1 hour of your day went untracked. Logging it may reveal hidden patterns.”

---

### 🧮 Pre-Computed Metrics

* Total tracked minutes
* Category-wise minutes
* Activity count
* Longest continuous block

---

## 🎨 3. UX Flow

### 🔁 Core Loop

**Log → Reflect → Adjust → Repeat**

---

### 📱 Screen 1: Today (Home)

* Current activity (prominent)
* Running timer
* “Switch Activity” button
* Last 3 activities (quick resume)

---

### ➕ Screen 2: Log / Switch Activity

* Category selection (icons)
* Activity name
* Optional notes
* Save in one tap

---

### 📊 Screen 3: Daily Summary

* Timeline strip
* Category breakdown
* Key stats:

  * Total tracked time
  * Activity count
  * Longest focus block

---

### 💡 Screen 4: Insights

* Max 5 insight cards
* Clear, human-readable language
* Optional “Try this tomorrow” suggestion

---

### ⚙️ Screen 5: Settings

* Manage categories
* Day start time
* Export data (JSON)
* Privacy controls (local-first)

---

### UX Tone

* Calm
* Non-judgmental
* Insight-driven, not guilt-driven

---

## 🎤 4. Pitch-Style Product Description

### 🔹 One-Liner

**TymOra helps you understand where your time goes — and how to use it better.**

---

### 🔹 Problem

People feel busy all day but rarely know **what actually consumed their time**.
Most time trackers are rigid, work-only, or overwhelming.

---

### 🔹 Solution

**TymOra** is a lightweight daily activity tracker that turns simple logs into **clear, practical insights**, helping users design better days without pressure.

---

### 🔹 What Makes TymOra Different

* Tracks **real life**, not just work
* Focuses on **awareness over productivity guilt**
* Delivers **human-readable insights**
* Works **offline first**
* Built for **busy parents, professionals, and learners**

---

### 🔹 Target Users

* Knowledge workers
* Parents balancing work & family
* Lifelong learners
* Anyone asking: *“Where did my day go?”*

---

### 🔹 Vision

**TymOra aims to become a personal time mirror — helping people live intentionally, one day at a time.**
