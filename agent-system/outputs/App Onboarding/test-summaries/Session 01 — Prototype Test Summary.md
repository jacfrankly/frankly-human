# Session 01 — Prototype Test Summary
**App Onboarding Service** · 09 April 2026

## Session overview

| | |
|---|---|
| Tasks completed | 4 / 4 |
| Pass | 2 |
| Fail | 2 |
| Annotations | 5 |

---

## Task results

### Task 1: Check what's already available

**Hypothesis:** E5 — H1 App Discovery
**Scenario:** Your team would like to start using Miro for remote workshops. You've been told there's a new IT portal for app requests. This is it.
**Result:** PASS

---

### Task 2: Submit a request for a new application

**Hypothesis:** E4 — H4 Adversarial Triage + E6 — H2 Intake Completeness
**Scenario:** Your team wants to use PeopleInsight — a workforce analytics tool that generates headcount and absence reports by pulling data from the company's HR system. It's not in the catalogue.
**Result:** FAIL

---

### Task 3: Review your submission confirmation

**Hypothesis:** E7 — H3 Status-Chasing Intent
**Scenario:** You've just submitted the PeopleInsight request. This is the confirmation screen.
**Result:** FAIL

**Annotations:**

- **[1]** Too many fields. Could be simple qualifying questions earlier
- **[2]** Check if this links anywhere. Are we working on the catalogue as well?

---

### Task 4: Understand the decision on your request

**Hypothesis:** TD-04 — Decision Notification
**Scenario:** Two weeks have passed. You've received a notification that a decision has been made on your PeopleInsight request.
**Result:** PASS

**Annotations:**

- **[3]** Too subtle and difficult to navigate back to home screen
- **[4]** It would be great to show the list of updates/actions for this specific user, rather than make them click into this screen.
- **[5]** App name should be at the top, very prominent

---

## Design implications

| Annotation | Screen | Finding | Priority |
|---|---|---|---|
| [1] | Intake form (TD-02) | Form has too many fields upfront — qualifying questions should gate access to full form | High |
| [2] | Confirmation (TD-02) | Link back to catalogue is not obvious; relationship between form and catalogue unclear | Medium |
| [3] | Decision screen (TD-04) | Home navigation is too subtle — breadcrumb not prominent enough | High |
| [4] | Decision screen (TD-04) | User wants proactive update list, not click-in navigation to status | High |
| [5] | Decision screen (TD-04) | App name hierarchy is too low — should be the primary heading | Medium |

---

*Generated from App Onboarding Prototype — Testing Harness*
