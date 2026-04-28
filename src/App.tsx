import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   COLOUR TOKENS
───────────────────────────────────────────── */
const C = {
  red: "#E94B2C",
  orange: "#F5A623",
  yellow: "#F2C94C",
  green: "#2E9E58",
  blue: "#2F5DA8",
  dark: "#2B2B2B",
  mid: "#6B7280",
  light: "#D1D5DB",
  white: "#FFFFFF",
  navy: "#1f2a3a",
};

/* ─────────────────────────────────────────────
   QUIZ DATA
───────────────────────────────────────────── */
const quizData = [
  {
    q: "Which Google Sheets sort option permanently rearranges ALL rows in the entire sheet?",
    options: ["Sort Range", "Sort Sheet", "SORT Function", "SORTN Function"],
    correct: 1,
  },
  {
    q: "In the SORT formula =SORT(A2:C10, 2, FALSE), what does FALSE mean?",
    options: [
      "Sort ascending (A→Z)",
      "Exclude the header row",
      "Sort descending (Z→A)",
      "Return only 2 rows",
    ],
    correct: 2,
  },
  {
    q: "When sorting multiple colors, why must you sort in REVERSE order of your desired sequence?",
    options: [
      "Google Sheets limitation on color depth",
      "Each subsequent sort pushes the chosen color to the top, overriding the previous",
      "Ascending order is reversed for colors",
      "The Sort dialog resets after each sort",
    ],
    correct: 1,
  },
  {
    q: "What does SORTN's display_ties_mode = 2 do?",
    options: [
      "Returns N+ rows if the Nth row has ties",
      "Shows boundary ties only",
      "Returns only UNIQUE rows (removes duplicates)",
      "Returns exactly N rows with no special handling",
    ],
    correct: 2,
  },
  {
    q: "Which statement is TRUE about the SORT formula function?",
    options: [
      "It permanently changes the original data",
      "It can only sort by one column",
      "It creates a dynamic sorted view and the original data stays unchanged",
      "It returns only the top 5 rows",
    ],
    correct: 2,
  },
];

/* ─────────────────────────────────────────────
   FAQ DATA
───────────────────────────────────────────── */
const faqData = [
  {
    q: "What is the difference between Sort Sheet and Sort Range?",
    a: "Sort Sheet sorts ALL data in the entire sheet together, preserving row relationships. Sort Range only sorts a specific selected range, leaving the rest of the sheet untouched. Use Sort Sheet for single-table sheets and Sort Range when you have multiple separate tables.",
  },
  {
    q: "Does sorting with the Data Menu change my original data permanently?",
    a: "Yes — menu-based sorting (Sort Sheet and Sort Range) permanently rearranges your data. However, you can always press Ctrl+Z (Cmd+Z on Mac) immediately after to undo the sort. Formula-based sorting with SORT or SORTN does NOT change the original data.",
  },
  {
    q: "Can I sort by multiple colors at once in Google Sheets?",
    a: "No — Google Sheets only allows sorting one color at a time (Move to Top or Move to Bottom). To arrange multiple colors in a custom order, sort them in REVERSE sequence. For example, to get Red → Yellow → Green from top to bottom, first sort Green to top, then Yellow, then Red.",
  },
  {
    q: "What is the SORTN function best used for?",
    a: "SORTN is ideal for creating Top-N leaderboards or ranked lists where you want only the top (or bottom) N rows. Its display_ties_mode parameter gives you fine control over how tied values are handled — you can include all tied rows, remove duplicates, or show only unique boundary ties.",
  },
  {
    q: "How do I apply multi-level sorting from the Data Menu?",
    a: "Go to Data → Sort Range → Advanced Range Sorting Options. In the dialog, choose your primary sort column and order, then click '+ Add another sort column' to add secondary and tertiary sort levels. Check the 'Data has header row' box to prevent the header from being sorted.",
  },
  {
    q: "Can the SORT formula handle sorting by multiple columns?",
    a: "Yes! The SORT function supports multiple sort columns by adding extra pairs of arguments: =SORT(range, sort_col1, is_ascending1, sort_col2, is_ascending2, ...). You can chain as many sort levels as needed.",
  },
  {
    q: "Do Sort by Color options work with conditional formatting colors?",
    a: "Yes — Sort by Color works with BOTH manually applied fill/text colors AND colors applied through conditional formatting rules. As long as cells visually have a color (regardless of how it was applied), Google Sheets can sort by it.",
  },
];

/* ─────────────────────────────────────────────
   PRACTICE CSV GENERATOR
───────────────────────────────────────────── */
function generateCSV(): string {
  const sheets: string[] = [];

  // Sheet 1 — Employee Dataset (Sort Sheet Practice)
  sheets.push(
    "SHEET 1 — Sort Sheet Practice,,,,\n" +
      "Task: Sort the entire dataset by Salary (Highest first) using Sort Sheet,,,,,\n" +
      "Name,Department,Salary,Join Date,Status\n" +
      "Alice Johnson,Marketing,72000,2021-03-15,Active\n" +
      "Bob Smith,Engineering,95000,2019-07-22,Active\n" +
      "Carol White,HR,58000,2022-01-10,Active\n" +
      "Dave Brown,Engineering,110000,2018-05-30,Active\n" +
      "Eve Davis,Marketing,63000,2020-11-18,Inactive\n" +
      "Frank Wilson,HR,54000,2023-02-28,Active\n" +
      "Grace Lee,Engineering,88000,2019-09-14,Active\n" +
      "Henry Moore,Finance,76000,2021-06-01,Active\n" +
      ",,,,,\n" +
      "ANSWER KEY: Dave(110000) > Bob(95000) > Grace(88000) > Henry(76000) > Alice(72000) > Eve(63000) > Carol(58000) > Frank(54000),,,,\n"
  );

  // Sheet 2 — Sort Range Advanced
  sheets.push(
    "SHEET 2 — Advanced Sort Range Practice,,,,\n" +
      "Task: Sort by Department (A→Z) THEN by Salary (Z→A) using Advanced Range Sorting,,,,,\n" +
      "Name,Department,Salary,Performance,City\n" +
      "Alice,Engineering,95000,Excellent,New York\n" +
      "Bob,Marketing,62000,Good,Chicago\n" +
      "Carol,Engineering,88000,Good,New York\n" +
      "Dave,HR,54000,Average,Houston\n" +
      "Eve,Marketing,71000,Excellent,Chicago\n" +
      "Frank,Finance,83000,Good,New York\n" +
      "Grace,HR,59000,Excellent,Houston\n" +
      "Henry,Finance,91000,Excellent,Boston\n" +
      ",,,,,\n" +
      "ANSWER KEY: Engineering(Alice 95000 > Carol 88000) → Finance(Henry 91000 > Frank 83000) → HR(Grace 59000 > Dave 54000) → Marketing(Eve 71000 > Bob 62000),,,,\n"
  );

  // Sheet 3 — Sort by Color
  sheets.push(
    "SHEET 3 — Sort by Color Practice,,,,\n" +
      "Task: Apply fill colors manually then sort Red→Yellow→Green (top to bottom),,,,,\n" +
      "Product,Priority,Units,Color Code,Action Required\n" +
      "Server Upgrade,Urgent,1,RED — Apply Red Fill,Immediate\n" +
      "Software License,Pending,5,YELLOW — Apply Yellow Fill,This Week\n" +
      "Team Training,Done,12,GREEN — Apply Green Fill,Complete\n" +
      "Network Patch,Urgent,2,RED — Apply Red Fill,Immediate\n" +
      "Report Writing,Done,8,GREEN — Apply Green Fill,Complete\n" +
      "Budget Review,Pending,3,YELLOW — Apply Yellow Fill,This Week\n" +
      "Security Audit,Urgent,1,RED — Apply Red Fill,Immediate\n" +
      ",,,,,\n" +
      "ANSWER KEY Strategy: Sort Green→Top | Sort Yellow→Top | Sort Red→Top | Result: Red=top Yellow=middle Green=bottom,,,,\n"
  );

  // Sheet 4 — SORT Formula
  sheets.push(
    "SHEET 4 — SORT Formula Practice,,,,\n" +
      "Task: Write SORT formulas in column G onwards to create dynamic sorted views,,,,,\n" +
      "Student,Subject,Score,Grade,City\n" +
      "Emma,Math,88,B,London\n" +
      "Liam,Science,95,A,Paris\n" +
      "Olivia,Math,72,C,Berlin\n" +
      "Noah,Science,85,B,London\n" +
      "Sophia,English,91,A,Paris\n" +
      "Mason,English,67,D,Berlin\n" +
      "Ava,Math,96,A,London\n" +
      "James,Science,78,C,Paris\n" +
      ",,,,,\n" +
      "Formula Tasks:,,,,\n" +
      "Task 1: =SORT(A2:E9,3,FALSE) — Sort by Score highest first,,,,\n" +
      "Task 2: =SORT(A2:E9,1,TRUE) — Sort by Student name A→Z,,,,\n" +
      "Task 3: =SORT(A2:E9,2,TRUE,3,FALSE) — Sort by Subject A→Z then Score Z→A,,,,\n"
  );

  // Sheet 5 — SORTN Formula
  sheets.push(
    "SHEET 5 — SORTN Formula Practice,,,,\n" +
      "Task: Use SORTN formulas to extract Top-N leaderboard results,,,,,\n" +
      "SalesRep,Region,Q1_Sales,Q2_Sales,Total\n" +
      "Alex Turner,North,45000,52000,97000\n" +
      "Beth King,South,38000,41000,79000\n" +
      "Chris Park,East,61000,59000,120000\n" +
      "Diana Fox,West,55000,48000,103000\n" +
      "Ethan Ross,North,42000,46000,88000\n" +
      "Fiona Gray,South,67000,61000,128000\n" +
      "George Hill,East,38000,41000,79000\n" +
      "Hannah Cole,West,51000,55000,106000\n" +
      ",,,,,\n" +
      "SORTN Formula Tasks:,,,,\n" +
      "Task 1: =SORTN(A2:E9,3,0,5,FALSE) — Top 3 by Total Sales,,,,\n" +
      "Task 2: =SORTN(A2:E9,3,1,5,FALSE) — Top 3 including tied 3rd place,,,,\n" +
      "Task 3: =SORTN(A2:E9,5,2,3,FALSE) — Top 5 unique Total values,,,,\n" +
      "ANSWER KEY: Fiona(128000) > Chris(120000) > Hannah(106000) > Diana(103000) > Alex(97000),,,,\n"
  );

  return sheets.join("\n\n");
}

/* ─────────────────────────────────────────────
   SHEET PREVIEW DATA
───────────────────────────────────────────── */
const sheetPreviews = [
  {
    title: "Sheet 1",
    subtitle: "Sort Sheet Practice",
    color: "#2F5DA8",
    headers: ["Name", "Dept", "Salary", "Status"],
    rows: [
      ["Alice", "Marketing", "72,000", "Active"],
      ["Bob", "Engineering", "95,000", "Active"],
      ["Dave", "Engineering", "110,000", "Active"],
      ["Grace", "HR", "88,000", "Active"],
    ],
    highlight: [2, 3],
    tasks: ["Sort entire sheet by Salary Z→A", "Undo and sort by Department A→Z", "Identify header auto-detection"],
  },
  {
    title: "Sheet 2",
    subtitle: "Advanced Sort Range",
    color: "#2E9E58",
    headers: ["Name", "Dept", "Salary", "Perf"],
    rows: [
      ["Alice", "Engineering", "95,000", "Excellent"],
      ["Bob", "Marketing", "62,000", "Good"],
      ["Henry", "Finance", "91,000", "Excellent"],
      ["Dave", "HR", "54,000", "Average"],
    ],
    highlight: [0, 2],
    tasks: ["Sort by Dept A→Z then Salary Z→A", "Use Advanced Range Sorting dialog", "Add 3 sort levels"],
  },
  {
    title: "Sheet 3",
    subtitle: "Sort by Color",
    color: "#E94B2C",
    headers: ["Product", "Priority", "Units", "Color"],
    rows: [
      ["Server", "Urgent", "1", "🔴 Red"],
      ["License", "Pending", "5", "🟡 Yellow"],
      ["Training", "Done", "12", "🟢 Green"],
      ["Patch", "Urgent", "2", "🔴 Red"],
    ],
    highlight: [0, 3],
    tasks: ["Apply fill colors to each row", "Sort Red to top first", "Use reverse-order strategy"],
  },
  {
    title: "Sheet 4",
    subtitle: "SORT Formula",
    color: "#F5A623",
    headers: ["Student", "Subject", "Score", "Grade"],
    rows: [
      ["Ava", "Math", "96", "A"],
      ["Liam", "Science", "95", "A"],
      ["Sophia", "English", "91", "A"],
      ["Noah", "Science", "85", "B"],
    ],
    highlight: [0, 2],
    tasks: ["Write SORT formula for top scores", "Sort by Subject then Score", "Test dynamic update"],
  },
  {
    title: "Sheet 5",
    subtitle: "SORTN Formula",
    color: "#9333ea",
    headers: ["SalesRep", "Region", "Q1", "Total"],
    rows: [
      ["Fiona", "South", "67,000", "128,000"],
      ["Chris", "East", "61,000", "120,000"],
      ["Hannah", "West", "51,000", "106,000"],
      ["Diana", "West", "55,000", "103,000"],
    ],
    highlight: [0, 3],
    tasks: ["Write SORTN for Top 3 salesreps", "Use mode=1 for tied 3rd place", "Extract unique totals only"],
  },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#d1fae5", border: "1.5px solid #6ee7b7", borderRadius: 12, padding: "16px 20px", margin: "18px 0", color: "#1a5c35", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>💡</span>
      <div style={{ fontSize: 15, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "16px 20px", margin: "18px 0", color: "#8a2015", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <div style={{ fontSize: 15, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function CodeBlock({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div style={{ margin: "18px 0" }}>
      {label && (
        <div style={{ display: "inline-block", background: C.blue, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: "8px 8px 0 0", letterSpacing: 0.5 }}>
          {label}
        </div>
      )}
      <pre style={{ background: "#0d1117", borderRadius: label ? "0 8px 8px 8px" : 8, padding: "18px 22px", overflowX: "auto", margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#79c0ff", fontFamily: "'Courier New', Courier, monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {children}
      </pre>
    </div>
  );
}

function SectionCard({ id, icon, title, color, children }: { id: string; icon: string; title: string; color?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: "36px 40px", marginBottom: 32, scrollMarginTop: 80, border: `1px solid ${C.light}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ background: color || C.blue, width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {icon}
        </div>
        <h2 style={{ color: C.blue, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StepItem({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "flex-start" }}>
      <div style={{ background: C.blue, color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0, boxShadow: "0 2px 8px rgba(47,93,168,0.3)" }}>
        {n}
      </div>
      <div style={{ color: C.dark, fontSize: 15, lineHeight: 1.7, paddingTop: 4 }}>{children}</div>
    </div>
  );
}

function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, display: "inline-block" }}>{text}</span>
  );
}

/* ─────────────────────────────────────────────
   QUIZ COMPONENT
───────────────────────────────────────────── */
function QuizSection() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizData.length).fill(null));
  const [score, setScore] = useState<number | null>(null);

  function handleAnswer(qi: number, oi: number) {
    if (answers[qi] !== null) return;
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);
    const answered = next.filter((a) => a !== null).length;
    if (answered === quizData.length) {
      const sc = next.reduce((acc, a, i) => (acc ?? 0) + (a === quizData[i].correct ? 1 : 0), 0);
      setScore(sc);
    }
  }

  return (
    <section id="quiz" style={{ marginBottom: 32, scrollMarginTop: 80 }}>
      <div style={{ background: C.blue, borderRadius: 18, padding: "32px 40px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 36 }}>🧠</span>
        <div>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, margin: 0 }}>Quick Knowledge Check</h2>
          <p style={{ color: "#bfd3f5", margin: "4px 0 0", fontSize: 14 }}>5 questions · Click an option to reveal the answer</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {quizData.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <div key={qi} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: "24px 28px", border: `1px solid ${C.light}` }}>
              <p style={{ color: C.dark, fontWeight: 700, fontSize: 15.5, marginBottom: 16, lineHeight: 1.5 }}>
                <span style={{ color: C.blue, marginRight: 8 }}>Q{qi + 1}.</span>{q.q}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {q.options.map((opt, oi) => {
                  let bg = "#f3f4f6", border = "#D1D5DB", textCol = C.dark;
                  if (chosen !== null) {
                    if (oi === q.correct) { bg = "#d1fae5"; border = "#2E9E58"; textCol = "#1a5c35"; }
                    else if (oi === chosen) { bg = "#fee2e2"; border = C.red; textCol = "#8a2015"; }
                  }
                  return (
                    <button key={oi} onClick={() => handleAnswer(qi, oi)}
                      style={{ background: bg, border: `2px solid ${border}`, borderRadius: 10, padding: "10px 16px", cursor: chosen !== null ? "default" : "pointer", textAlign: "left", color: textCol, fontSize: 14, fontWeight: 600, transition: "all 0.2s", lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 800, marginRight: 6 }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              {chosen !== null && (
                <div style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8, background: chosen === q.correct ? "#d1fae5" : "#fee2e2", color: chosen === q.correct ? "#1a5c35" : "#8a2015", fontSize: 14, fontWeight: 600 }}>
                  {chosen === q.correct ? "✅ Correct! Great job!" : `❌ Incorrect. The correct answer is: ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}`}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {score !== null && (
        <div style={{ background: score >= 4 ? "#d1fae5" : score >= 2 ? "#fef3c7" : "#fee2e2", borderRadius: 14, padding: "20px 28px", marginTop: 24, textAlign: "center", border: `2px solid ${score >= 4 ? C.green : score >= 2 ? C.orange : C.red}` }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: score >= 4 ? "#1a5c35" : score >= 2 ? "#92400e" : "#8a2015", margin: 0 }}>
            {score >= 4 ? "🏆" : score >= 2 ? "📚" : "💪"} You scored {score} / {quizData.length}
          </p>
          <p style={{ color: C.dark, margin: "6px 0 0", fontSize: 15 }}>
            {score === 5 ? "Perfect score! You're a sorting expert!" : score >= 3 ? "Good work! Review the missed questions above." : "Keep studying — you've got this!"}
          </p>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ COMPONENT
───────────────────────────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ marginBottom: 32, scrollMarginTop: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ background: C.orange, width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>❓</div>
        <h2 style={{ color: C.blue, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, margin: 0 }}>Frequently Asked Questions</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {faqData.map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.light}`, overflow: "hidden" }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", background: "none", border: "none", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 12 }}>
              <span style={{ color: C.dark, fontWeight: 700, fontSize: 15, textAlign: "left", lineHeight: 1.4 }}>{item.q}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div style={{ maxHeight: open === i ? 300 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
              <div style={{ padding: "0 22px 18px", color: "#4b5563", fontSize: 14.5, lineHeight: 1.75 }}>{item.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MODAL COMPONENT
───────────────────────────────────────────── */
function SheetModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const sheet = sheetPreviews[activeTab];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1a2332", borderRadius: 18, width: "min(860px,100%)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        {/* Header */}
        <div style={{ background: "#0d1117", borderRadius: "18px 18px 0 0", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ color: "#79c0ff", margin: 0, fontSize: 18, fontWeight: 800 }}>📊 Practice File Preview</h3>
            <p style={{ color: "#8b949e", margin: "4px 0 0", fontSize: 13 }}>Google Sheets — Sort &amp; SortN Practice</p>
          </div>
          <button onClick={onClose} style={{ background: "#30363d", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#cdd6f4", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "16px 28px 0", borderBottom: "1px solid #30363d", overflowX: "auto" }}>
          {sheetPreviews.map((s, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              style={{ background: activeTab === i ? s.color : "transparent", color: activeTab === i ? "#fff" : "#8b949e", border: `1px solid ${activeTab === i ? s.color : "#30363d"}`, borderRadius: "8px 8px 0 0", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {s.title}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{ padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: "#cdd6f4", margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>{sheet.subtitle}</h4>
          </div>
          {/* Table */}
          <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: sheet.color }}>
                  {sheet.headers.map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", color: "#fff", textAlign: "left", fontWeight: 700, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.map((row, ri) => (
                  <tr key={ri} style={{ background: sheet.highlight.includes(ri) ? "#fef3c7" : "#fff", borderBottom: "1px solid #e5e7eb" }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "9px 14px", color: "#2B2B2B", fontWeight: ri === 0 ? 700 : 400, fontSize: 13 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tasks */}
          <div style={{ background: "#0d1117", borderRadius: 10, padding: "16px 20px" }}>
            <p style={{ color: "#79c0ff", margin: "0 0 10px", fontWeight: 700, fontSize: 13 }}>📋 Tasks for this sheet:</p>
            {sheet.tasks.map((t, i) => (
              <div key={i} style={{ color: "#cdd6f4", fontSize: 13.5, padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: C.green, flexShrink: 0 }}>✓</span> {t}
              </div>
            ))}
          </div>
          {/* Download btn */}
          <button onClick={() => { downloadCSV(); onClose(); }}
            style={{ marginTop: 20, background: C.green, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", transition: "background 0.2s" }}>
            ⬇️ Download Practice File (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOWNLOAD CSV
───────────────────────────────────────────── */
let toastTimeout: ReturnType<typeof setTimeout>;
function downloadCSV() {
  const csv = generateCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Sort_SortN_Google_Sheets_Practice.csv";
  a.click();
  URL.revokeObjectURL(url);
  // toast
  const toast = document.getElementById("toast-notification");
  if (toast) {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 3500);
  }
}

/* ─────────────────────────────────────────────
   PRACTICE DOWNLOAD SECTION
───────────────────────────────────────────── */
function PracticeSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="practice" style={{ marginBottom: 32, scrollMarginTop: 80 }}>
      {showModal && <SheetModal onClose={() => setShowModal(false)} />}

      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{ background: C.green, color: "#fff", borderRadius: 20, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: 1, display: "inline-block", marginBottom: 12 }}>FREE DOWNLOAD</span>
        <h2 style={{ color: C.dark, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, margin: "0 0 10px" }}>📂 Practice File</h2>
        <p style={{ color: C.mid, fontSize: 16, maxWidth: 560, margin: "0 auto" }}>Hands-on CSV practice file covering all 5 sorting methods with step-by-step tasks and answer keys.</p>
      </div>

      {/* Main Download Card */}
      <div style={{ background: "#111827", borderRadius: 20, padding: "32px 36px", marginBottom: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
          {/* Icon + Info */}
          <div style={{ display: "flex", gap: 20, flex: "1 1 260px" }}>
            <div style={{ background: "#1a2e1a", border: "2px solid #2E9E58", borderRadius: 16, width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>📊</div>
            <div>
              <h3 style={{ color: "#fff", margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>Sort_SortN_Google_Sheets_Practice.csv</h3>
              <p style={{ color: "#9ca3af", margin: "0 0 12px", fontSize: 13.5 }}>Complete practice dataset with tasks, examples & answer keys for all sorting methods</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[["📁 Format", "CSV"], ["📋 Sheets", "5"], ["✅ Tasks", "15+"], ["📊 Level", "Beginner→Pro"]].map(([label, val]) => (
                  <div key={label} style={{ background: "#1f2937", borderRadius: 8, padding: "4px 12px", fontSize: 12 }}>
                    <span style={{ color: "#6b7280" }}>{label}: </span>
                    <span style={{ color: "#e5e7eb", fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "0 0 auto" }}>
            <button onClick={downloadCSV}
              style={{ background: C.green, color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", transition: "background 0.2s", whiteSpace: "nowrap" }}>
              ⬇️ Download Practice File
            </button>
            <button onClick={() => setShowModal(true)}
              style={{ background: "transparent", color: C.green, border: `2px solid ${C.green}`, borderRadius: 10, padding: "11px 24px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
              👁 Preview Sheets
            </button>
          </div>
        </div>

        {/* What's Included */}
        <div style={{ marginTop: 28, borderTop: "1px solid #1f2937", paddingTop: 24 }}>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, letterSpacing: 1, margin: "0 0 14px", textTransform: "uppercase" }}>What's Included</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Sort Sheet Practice", "Advanced Sort Range", "Sort by Color Tasks", "SORT Formula Exercises", "SORTN Leaderboard Tasks", "Answer Keys Included", "Multi-level Sort Examples", "Color Strategy Practice"].map((item) => (
              <span key={item} style={{ background: "#1a2e1a", border: "1px solid #2E9E58", color: "#6ee7b7", borderRadius: 20, padding: "5px 14px", fontSize: 12.5, fontWeight: 600 }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet Tab Preview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 28 }}>
        {sheetPreviews.map((sheet, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: `1px solid ${C.light}` }}>
            {/* Tab Header */}
            <div style={{ background: sheet.color, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 10px", color: "#fff", fontSize: 12, fontWeight: 700 }}>{sheet.title}</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12.5, fontWeight: 600 }}>{sheet.subtitle}</span>
            </div>
            {/* Mini Table */}
            <div style={{ padding: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    {sheet.headers.map((h, hi) => (
                      <th key={hi} style={{ padding: "6px 8px", color: "#2B2B2B", textAlign: "left", fontWeight: 700, fontSize: 10.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheet.rows.slice(0, 3).map((row, ri) => (
                    <tr key={ri} style={{ background: sheet.highlight.includes(ri) ? "#fef9c3" : "#fff", borderBottom: "1px solid #f3f4f6" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: "5px 8px", color: "#2B2B2B", fontSize: 11 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Tasks */}
            <div style={{ borderTop: `1px solid ${C.light}`, padding: "10px 12px 12px" }}>
              {sheet.tasks.map((t, ti) => (
                <div key={ti} style={{ fontSize: 11.5, color: "#4b5563", padding: "2px 0", display: "flex", gap: 6 }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* How to Use */}
      <div style={{ background: "#0d1117", borderRadius: 16, padding: "28px 32px" }}>
        <h3 style={{ color: "#79c0ff", margin: "0 0 20px", fontSize: 16, fontWeight: 800 }}>🚀 How to Use This Practice File</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {["Download the CSV file using the button above", "Open with Google Sheets (File → Import)", "Read the task description in Row 2 of each section", "Complete each sort task using the methods taught", "Check your result against the Answer Key rows", "Repeat with different columns to build muscle memory"].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ background: C.green, color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
              <p style={{ color: "#cdd6f4", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#part1", label: "Data Menu" },
    { href: "#part2", label: "Sort by Color" },
    { href: "#part3", label: "Formulas" },
    { href: "#comparison", label: "Comparison" },
    { href: "#practice", label: "Practice" },
    { href: "#quiz", label: "Quiz" },
    { href: "#faq", label: "FAQ" },
    { href: "#summary", label: "Summary" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#F8FAFC", color: C.dark, minHeight: "100vh" }}>

      {/* Toast */}
      <div id="toast-notification"
        style={{ position: "fixed", bottom: 28, right: 28, background: C.green, color: "#fff", borderRadius: 12, padding: "14px 22px", fontSize: 14.5, fontWeight: 700, zIndex: 10000, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 10, opacity: 0, transform: "translateY(20px)", transition: "all 0.4s ease", pointerEvents: "none" }}>
        ✅ Practice file downloaded successfully!
      </div>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,0.97)" : "#fff", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "0 1px 0 #e5e7eb", transition: "box-shadow 0.3s", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: C.blue, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔢</div>
            <span style={{ color: C.blue, fontWeight: 900, fontSize: 17, letterSpacing: -0.3 }}>Sort &amp; SortN</span>
          </div>
          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }} className="desktop-nav">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}
                style={{ color: C.dark, textDecoration: "none", padding: "6px 12px", borderRadius: 8, fontSize: 13.5, fontWeight: 600, transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#EEF2FF"; (e.target as HTMLElement).style.color = C.blue; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = C.dark; }}>
                {l.label}
              </a>
            ))}
          </div>
          {/* Hamburger */}
          <button onClick={() => setNavOpen(!navOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.dark, fontSize: 24, padding: 4 }} className="hamburger">
            {navOpen ? "✕" : "☰"}
          </button>
        </div>
        {/* Mobile Nav */}
        {navOpen && (
          <div style={{ background: "#fff", borderTop: `1px solid ${C.light}`, padding: "12px 24px 16px" }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}
                style={{ display: "block", color: C.dark, textDecoration: "none", padding: "10px 0", fontWeight: 600, fontSize: 15, borderBottom: `1px solid #f3f4f6` }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #2F5DA8 60%, #1a4080 100%)`, padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* BG orbs */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(47,93,168,0.2)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -80, right: -40, width: 360, height: 360, borderRadius: "50%", background: "rgba(46,158,88,0.12)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 18px", marginBottom: 22 }}>
            <span style={{ color: C.yellow, fontSize: 14 }}>⭐</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>Google Sheets — Advanced Sorting Guide</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 18px", letterSpacing: -0.5 }}>
            Complete Guide to Sort &amp; SortN
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(1rem,2vw,1.2rem)", lineHeight: 1.7, margin: "0 0 36px" }}>
            Built-in Menu Tools · Sort by Color · SORT &amp; SORTN Formula Functions — Everything in one place.
          </p>
          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 20, marginBottom: 36 }}>
            {[["3", "Core Methods"], ["5", "Formula Examples"], ["4", "Tie Modes"], ["15+", "Practice Tasks"]].map(([n, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 24px", minWidth: 110, textAlign: "center" }}>
                <div style={{ color: C.yellow, fontSize: 26, fontWeight: 900 }}>{n}</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12.5, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <a href="#part1" style={{ background: "#fff", color: C.blue, borderRadius: 10, padding: "13px 28px", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
              🚀 Start Learning
            </a>
            <a href="#practice" style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}>
              ⬇️ Practice File
            </a>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* ── PART 1: DATA MENU ── */}
        <SectionCard id="part1" icon="📋" title="Part 1 — Sorting from the Data Menu (Built-in Tool)">
          <p style={{ color: C.mid, fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
            Sorting from the Data Menu is the most basic and visual way to sort data in Google Sheets — no formulas required. You simply select your data and choose sort options from the menu bar.
          </p>

          {/* Sort Sheet */}
          <h3 style={{ color: C.blue, fontSize: 18, fontWeight: 800, marginBottom: 8, borderLeft: `4px solid ${C.blue}`, paddingLeft: 12 }}>1.1 Sort Sheet</h3>
          <p style={{ color: C.dark, fontSize: 15, marginBottom: 14, lineHeight: 1.7 }}>
            <strong>Sort Sheet</strong> sorts the <em>entire sheet's data</em> based on one selected column. All rows move together, keeping data relationships intact.
          </p>
          <CodeBlock label="PATH">
{`Data Menu
   └── Sort Sheet
           ├── Sort Sheet by Column A (A → Z)
           └── Sort Sheet by Column A (Z → A)`}
          </CodeBlock>
          <h4 style={{ color: C.dark, fontSize: 15, fontWeight: 700, margin: "20px 0 12px" }}>Step-by-Step:</h4>
          <StepItem n={1}>Click any cell in the column you want to sort by.</StepItem>
          <StepItem n={2}>Go to the top menu and click <strong>"Data"</strong>.</StepItem>
          <StepItem n={3}>Hover over <strong>"Sort Sheet"</strong>.</StepItem>
          <StepItem n={4}>Choose <strong>"Sort Sheet by Column A, A→Z"</strong> (Ascending) or <strong>"Z→A"</strong> (Descending).</StepItem>
          <StepItem n={5}>The entire sheet gets sorted immediately.</StepItem>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, margin: "20px 0" }}>
            {["Sorts the entire sheet — every column moves together", "Preserves row relationships (data stays aligned)", "Permanent change — use Ctrl+Z to undo", "Header row is automatically detected and stays at top", "Works on the currently active sheet only"].map((pt) => (
              <div key={pt} style={{ background: "#f0f5ff", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: C.blue, fontWeight: 900, flexShrink: 0 }}>📌</span>
                <span style={{ color: "#2B2B2B", fontSize: 13.5, lineHeight: 1.6 }}>{pt}</span>
              </div>
            ))}
          </div>

          {/* Sort Range */}
          <h3 style={{ color: C.blue, fontSize: 18, fontWeight: 800, margin: "32px 0 8px", borderLeft: `4px solid ${C.green}`, paddingLeft: 12 }}>1.2 Sort Range</h3>
          <p style={{ color: C.dark, fontSize: 15, marginBottom: 14, lineHeight: 1.7 }}>
            <strong>Sort Range</strong> sorts only a specific selected range of cells — not the entire sheet. You have more control over which data gets sorted.
          </p>
          <CodeBlock label="PATH">
{`Data Menu
   └── Sort Range
           ├── Sort Range by Column A (A → Z)
           ├── Sort Range by Column A (Z → A)
           └── Advanced Range Sorting Options...`}
          </CodeBlock>

          <h4 style={{ color: C.dark, fontSize: 15, fontWeight: 700, margin: "20px 0 12px" }}>Advanced Range Sorting Dialog:</h4>
          <CodeBlock label="DIALOG BOX">
{`┌─────────────────────────────────────────────┐
│         Sort Range (Advanced)               │
│                                             │
│  ☑ Data has header row                      │
│                                             │
│  Sort by:  [Column A ▼]  [A→Z ▼]           │
│                                             │
│  + Add another sort column                  │
│                                             │
│  [Cancel]              [Sort]               │
└─────────────────────────────────────────────┘`}
          </CodeBlock>

          <h4 style={{ color: C.dark, fontSize: 15, fontWeight: 700, margin: "20px 0 12px" }}>Multi-Level Sort Example:</h4>
          <CodeBlock label="MULTI-LEVEL SORT">
{`├── Sort by: Department (A→Z)     ← Primary Sort
├── Then by: Salary (Z→A)         ← Secondary Sort
└── Then by: Name (A→Z)           ← Tertiary Sort

Result:
  1. Departments sorted alphabetically
  2. Within same department → Salary highest first
  3. If salary also same → Name A→Z`}
          </CodeBlock>

          <TipBox>
            <strong>Multi-Level Sort is powerful!</strong> Use Advanced Range Sorting to apply up to multiple sort columns in a single operation — perfect for complex datasets like employee records or sales data.
          </TipBox>

          {/* Comparison Table */}
          <h3 style={{ color: C.blue, fontSize: 17, fontWeight: 800, margin: "28px 0 14px" }}>🔍 Sort Sheet vs Sort Range</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.blue }}>
                  {["Feature", "Sort Sheet", "Sort Range"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", color: "#fff", textAlign: "left", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["What gets sorted", "Entire sheet", "Selected range only"],
                  ["Header handling", "Auto-detected", "Manual checkbox"],
                  ["Multi-level sort", "❌ No", "✅ Yes (Advanced)"],
                  ["Other data affected", "✅ Yes — all moves", "❌ No — only selection"],
                  ["Best for", "Single table sheets", "Multiple tables / partial data"],
                ].map(([feat, s, r], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                    <td style={{ padding: "11px 16px", color: "#2B2B2B", fontWeight: 600 }}>{feat}</td>
                    <td style={{ padding: "11px 16px", color: "#2B2B2B" }}>{s}</td>
                    <td style={{ padding: "11px 16px", color: "#2B2B2B" }}>{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── PART 2: SORT BY COLOR ── */}
        <SectionCard id="part2" icon="🎨" title="Part 2 — Sort by Color & Cell Color" color={C.orange}>
          <p style={{ color: C.mid, fontSize: 15, marginBottom: 20, lineHeight: 1.7 }}>
            After applying cell background colors or text/font colors (manually or via conditional formatting), Google Sheets allows you to sort data based on those colors. This is extremely useful for priority-based and category-coded datasets.
          </p>

          {/* Use Cases */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            {[["🔴", "Red = Urgent", "#fee2e2", "#8a2015"], ["🟢", "Green = Done", "#d1fae5", "#1a5c35"], ["🟡", "Yellow = Pending", "#fef9c3", "#92400e"]].map(([icon, label, bg, col]) => (
              <div key={label} style={{ background: bg, borderRadius: 10, padding: "10px 18px", display: "flex", gap: 8, alignItems: "center" }}>
                <span>{icon}</span>
                <span style={{ color: col, fontWeight: 700, fontSize: 14 }}>{label}</span>
              </div>
            ))}
          </div>

          <h3 style={{ color: C.blue, fontSize: 17, fontWeight: 800, margin: "0 0 14px", borderLeft: `4px solid ${C.orange}`, paddingLeft: 12 }}>How to Apply Colors (Pre-requisite)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { title: "Method 1 — Manual Fill Color", steps: ["Select cells", "Click 'Fill Color' bucket icon in toolbar", "Choose a color", "Cells now have background color"] },
              { title: "Method 2 — Conditional Formatting", steps: ["Select range", "Format → Conditional Formatting", "Set rules: value > 100 → Green, value < 50 → Red", "Colors apply automatically"] },
              { title: "Method 3 — Text / Font Color", steps: ["Select cells", "Click 'Text Color' (A icon) in toolbar", "Choose font color", "Now text has color — sortable too"] },
            ].map((m) => (
              <div key={m.title} style={{ background: "#f9fafb", borderRadius: 12, padding: "18px 20px", border: `1px solid ${C.light}` }}>
                <h4 style={{ color: C.blue, fontWeight: 800, margin: "0 0 12px", fontSize: 14 }}>{m.title}</h4>
                {m.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: C.orange, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ color: "#2B2B2B", fontSize: 13.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Sort by Cell Color */}
          <h3 style={{ color: C.blue, fontSize: 17, fontWeight: 800, margin: "0 0 12px", borderLeft: `4px solid ${C.blue}`, paddingLeft: 12 }}>2.1 Sort by Cell (Background) Color</h3>
          <CodeBlock label="METHOD — RIGHT CLICK">
{`Step 1: Right-click on any colored cell in your column
Step 2: Hover on "Sort Range"
Step 3: Choose "Sort Range by Color"
           ├── Fill Color → [Pick the color]
           │                    ├── Move to Top
           │                    └── Move to Bottom
           └── Text Color → [Pick the color]
                                ├── Move to Top
                                └── Move to Bottom`}
          </CodeBlock>

          {/* Before/After */}
          <h4 style={{ color: C.dark, fontSize: 15, fontWeight: 700, margin: "20px 0 14px" }}>📊 Before / After — Sort by Cell Color (Red → Top)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[
              { title: "Before Sorting", data: [["Alice", "Pending", "🟡"], ["Bob", "Done", "🟢"], ["Carol", "Urgent", "🔴"], ["Dave", "Pending", "🟡"], ["Frank", "Urgent", "🔴"]], colors: ["#fef9c3", "#d1fae5", "#fee2e2", "#fef9c3", "#fee2e2"] },
              { title: "After Sorting (Red → Top)", data: [["Carol", "Urgent", "🔴"], ["Frank", "Urgent", "🔴"], ["Alice", "Pending", "🟡"], ["Dave", "Pending", "🟡"], ["Bob", "Done", "🟢"]], colors: ["#fee2e2", "#fee2e2", "#fef9c3", "#fef9c3", "#d1fae5"] },
            ].map((table) => (
              <div key={table.title} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.light}` }}>
                <div style={{ background: C.navy, padding: "10px 14px", color: "#fff", fontWeight: 700, fontSize: 13 }}>{table.title}</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr style={{ background: "#f3f4f6" }}>{["Name", "Status", "Color"].map((h) => <th key={h} style={{ padding: "8px 10px", color: "#2B2B2B", fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {table.data.map((row, i) => (
                      <tr key={i} style={{ background: table.colors[i] }}>
                        {row.map((cell, ci) => <td key={ci} style={{ padding: "7px 10px", color: "#2B2B2B", fontSize: 12.5 }}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Multi-color strategy */}
          <h3 style={{ color: C.blue, fontSize: 17, fontWeight: 800, margin: "24px 0 12px", borderLeft: `4px solid ${C.red}`, paddingLeft: 12 }}>2.2 Sorting Multiple Colors — Strategy</h3>
          <WarnBox>
            Google Sheets can only sort <strong>ONE color at a time</strong>. To arrange multiple colors in a specific order, you must sort them in <strong>REVERSE sequence</strong>.
          </WarnBox>
          <CodeBlock label="STRATEGY EXAMPLE">
{`Goal: Red on top → Yellow in middle → Green at bottom

Strategy (work in REVERSE order):

Step 1: Sort Green  → Move to Top
Step 2: Sort Yellow → Move to Top
Step 3: Sort Red    → Move to Top

Final Result:
  🔴 Red     ← on top (last sorted)
  🟡 Yellow  ← in middle
  🟢 Green   ← at bottom

⚠️ Always sort in REVERSE order of your desired sequence!`}
          </CodeBlock>

          {/* Rules Table */}
          <h3 style={{ color: C.blue, fontSize: 17, fontWeight: 800, margin: "24px 0 12px" }}>📋 Sort by Color — Rules &amp; Limitations</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.orange }}>
                  <th style={{ padding: "11px 16px", color: "#fff", textAlign: "left", fontWeight: 700 }}>Rule</th>
                  <th style={{ padding: "11px 16px", color: "#fff", textAlign: "left", fontWeight: 700 }}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Only ONE color at a time", "You can only sort one color to top/bottom per operation"],
                  ["Multiple color sorting", "Repeat the sort step for each color separately"],
                  ["Move to Top / Bottom only", "Cannot arrange multiple colors in custom order directly"],
                  ["Conditional format colors", "✅ Works with conditional formatting colors"],
                  ["Manual fill colors", "✅ Works with manually applied colors"],
                  ["Permanent change", "Sorting by color rearranges rows permanently"],
                  ["Undo available", "Ctrl+Z to reverse the sort"],
                ].map(([rule, detail], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                    <td style={{ padding: "10px 16px", color: "#2B2B2B", fontWeight: 600 }}>{rule}</td>
                    <td style={{ padding: "10px 16px", color: "#2B2B2B" }}>{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── PART 3: FORMULA FUNCTIONS ── */}
        <SectionCard id="part3" icon="⚡" title="Part 3 — SORT & SORTN Formula Functions" color={C.green}>
          <p style={{ color: C.mid, fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
            Formula-based sorting creates a <strong>dynamic sorted view</strong> — the original data is never changed. Results update automatically when source data changes.
          </p>

          {/* SORT */}
          <h3 style={{ color: C.blue, fontSize: 18, fontWeight: 800, margin: "0 0 14px", borderLeft: `4px solid ${C.green}`, paddingLeft: 12 }}>3.1 SORT Function</h3>
          <CodeBlock label="SYNTAX">
{`=SORT(range, sort_column, is_ascending, [sort_column2, is_ascending2, ...])`}
          </CodeBlock>

          <h4 style={{ color: C.dark, fontWeight: 700, fontSize: 15, margin: "18px 0 12px" }}>Parameters:</h4>
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.green }}>
                  {["Parameter", "Description", "Required"].map((h) => <th key={h} style={{ padding: "10px 14px", color: "#fff", textAlign: "left", fontWeight: 700 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["range", "Data range to sort", "✅ Yes"],
                  ["sort_column", "Column number to sort by (1 = first column)", "✅ Yes"],
                  ["is_ascending", "TRUE = A→Z (Ascending), FALSE = Z→A (Descending)", "✅ Yes"],
                  ["sort_column2", "Second sort column (optional)", "❌ Optional"],
                  ["is_ascending2", "Order for second column (optional)", "❌ Optional"],
                ].map(([p, d, r], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#f0faf4" : "#fff" }}>
                    <td style={{ padding: "9px 14px", color: "#2B2B2B", fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>{p}</td>
                    <td style={{ padding: "9px 14px", color: "#2B2B2B" }}>{d}</td>
                    <td style={{ padding: "9px 14px" }}><Badge text={r} bg={r.includes("Yes") ? "#d1fae5" : "#f3f4f6"} color={r.includes("Yes") ? "#1a5c35" : "#4b5563"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ color: C.dark, fontWeight: 700, fontSize: 15, margin: "18px 0 12px" }}>Examples:</h4>
          <CodeBlock label="FORMULA EXAMPLES">
{`=SORT(A2:C10, 1, TRUE)
→ Sort entire range by column 1, Ascending (A→Z)

=SORT(A2:C10, 2, FALSE)
→ Sort by column 2, Descending (Z→A)

=SORT(A2:D20, 1, TRUE, 2, FALSE)
→ Primary:   Column 1 Ascending
→ Secondary: Column 2 Descending`}
          </CodeBlock>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, marginBottom: 24 }}>
            {["Returns all rows sorted", "Original data not changed", "Dynamic — auto-updates when source changes", "Handles text, numbers & dates", "Blank cells go to end"].map((pt) => (
              <div key={pt} style={{ background: "#f0faf4", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: C.green, fontWeight: 900 }}>📌</span>
                <span style={{ color: "#2B2B2B", fontSize: 13.5 }}>{pt}</span>
              </div>
            ))}
          </div>

          {/* SORTN */}
          <h3 style={{ color: C.blue, fontSize: 18, fontWeight: 800, margin: "12px 0 14px", borderLeft: `4px solid #9333ea`, paddingLeft: 12 }}>3.2 SORTN Function</h3>
          <CodeBlock label="SYNTAX">
{`=SORTN(range, [n], [display_ties_mode], [sort_column1, is_ascending1, ...])`}
          </CodeBlock>

          <h4 style={{ color: C.dark, fontWeight: 700, fontSize: 15, margin: "18px 0 12px" }}>Parameters:</h4>
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#9333ea" }}>
                  {["Parameter", "Description", "Required"].map((h) => <th key={h} style={{ padding: "10px 14px", color: "#fff", textAlign: "left", fontWeight: 700 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["range", "Data range to sort", "✅ Yes"],
                  ["n", "Number of rows to return (Top N)", "❌ Optional"],
                  ["display_ties_mode", "0, 1, 2, or 3 — controls tie handling", "❌ Optional"],
                  ["sort_column", "Column to sort by", "❌ Optional"],
                  ["is_ascending", "TRUE = A→Z, FALSE = Z→A", "❌ Optional"],
                ].map(([p, d, r], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#faf0ff" : "#fff" }}>
                    <td style={{ padding: "9px 14px", color: "#2B2B2B", fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>{p}</td>
                    <td style={{ padding: "9px 14px", color: "#2B2B2B" }}>{d}</td>
                    <td style={{ padding: "9px 14px" }}><Badge text={r} bg={r.includes("Yes") ? "#d1fae5" : "#f3f4f6"} color={r.includes("Yes") ? "#1a5c35" : "#4b5563"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ color: C.dark, fontWeight: 700, fontSize: 15, margin: "18px 0 12px" }}>display_ties_mode Values:</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { mode: "0", name: "Default", desc: "Exact N rows, no special tie handling", color: "#e0e7ff", text: "#3730a3" },
              { mode: "1", name: "Show Boundary Ties", desc: "Returns N+ rows if Nth row has ties", color: "#fef3c7", text: "#92400e" },
              { mode: "2", name: "Remove Duplicates", desc: "Only unique rows returned", color: "#d1fae5", text: "#1a5c35" },
              { mode: "3", name: "Unique + Ties", desc: "Removes duplicates AND shows boundary ties", color: "#fee2e2", text: "#8a2015" },
            ].map((m) => (
              <div key={m.mode} style={{ background: m.color, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 20, color: m.text, marginBottom: 4 }}>Mode {m.mode}</div>
                <div style={{ color: m.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{m.name}</div>
                <div style={{ color: m.text, fontSize: 12.5, opacity: 0.85 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          <CodeBlock label="SORTN FORMULA EXAMPLES">
{`=SORTN(A2:B100, 5, 0, 2, FALSE)
→ Top 5 rows by column 2 descending

=SORTN(A2:B50, 3, 1, 2, FALSE)
→ Top 3 with ALL tied 3rd-place rows included

=SORTN(A2:A100, 10, 2, 1, TRUE)
→ Top 10 UNIQUE values only`}
          </CodeBlock>
        </SectionCard>

        {/* ── COMPARISON TABLE ── */}
        <SectionCard id="comparison" icon="⚖️" title="SORT vs SORTN — Full Comparison">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.navy }}>
                  {["Feature", "SORT", "SORTN"].map((h) => <th key={h} style={{ padding: "13px 18px", color: "#fff", textAlign: "left", fontWeight: 700 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Returns all rows", "✅ Yes", "❌ No"],
                  ["Limit rows (Top N)", "❌ No", "✅ Yes"],
                  ["Multi-column sort", "✅ Yes", "✅ Yes"],
                  ["Tie / Duplicate handling", "❌ No", "✅ Yes (4 modes)"],
                  ["Dynamic output", "✅ Auto-updates", "✅ Auto-updates"],
                  ["Best for", "Full sorted lists", "Top-N Leaderboards"],
                ].map(([feat, s, n], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                    <td style={{ padding: "11px 18px", color: "#2B2B2B", fontWeight: 600 }}>{feat}</td>
                    <td style={{ padding: "11px 18px", color: "#2B2B2B" }}>{s}</td>
                    <td style={{ padding: "11px 18px", color: "#2B2B2B" }}>{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── QUICK REFERENCE ── */}
        <SectionCard id="reference" icon="📖" title="Quick Reference — All Sorting Methods" color={C.yellow}>
          <CodeBlock label="COMPLETE SORTING MAP">
{`SORTING IN GOOGLE SHEETS
│
├── 1. DATA MENU SORTING (No Formula)
│       ├── Sort Sheet
│       │      ├── A → Z (Ascending)
│       │      └── Z → A (Descending)
│       │
│       └── Sort Range
│              ├── Quick A→Z / Z→A
│              └── Advanced Options
│                     ├── Header row checkbox
│                     ├── Multi-level sorting
│                     └── Sort by COLOR 🎨
│                            ├── Cell/Fill Color
│                            │      ├── Move to Top
│                            │      └── Move to Bottom
│                            └── Text/Font Color
│                                   ├── Move to Top
│                                   └── Move to Bottom
│
└── 2. FORMULA-BASED SORTING
        ├── SORT Function
        │      └── Returns all rows sorted (dynamic)
        │
        └── SORTN Function
               └── Returns Top N rows with tie control`}
          </CodeBlock>
        </SectionCard>

        {/* ── PRO TIPS ── */}
        <SectionCard id="protips" icon="🏆" title="Pro Tips" color={C.green}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TipBox>
              <strong>Use Data Menu Sort for quick, one-time permanent sorting.</strong> Use SORT/SORTN formulas for dynamic auto-updating sorted views that refresh whenever source data changes.
            </TipBox>
            <TipBox>
              <strong>Multi-color strategy — always work in reverse!</strong> To achieve Red → Yellow → Green order, sort Green first (move to top), then Yellow (move to top), then Red (move to top). The last sort wins.
            </TipBox>
            <TipBox>
              <strong>SORTN Mode 1 is perfect for leaderboards</strong> where you want Top 3 but must show all tied 3rd-place records — no one gets unfairly cut off.
            </TipBox>
            <TipBox>
              <strong>Combine SORT with other functions!</strong> For example: <code style={{ background: "#d1fae5", borderRadius: 4, padding: "1px 6px", fontFamily: "monospace", color: "#1a5c35" }}>=SORT(FILTER(A2:C100, B2:B100="Engineering"), 3, FALSE)</code> — filter Engineering employees, then sort by salary.
            </TipBox>
            <TipBox>
              <strong>Always check "Data has header row"</strong> in the Advanced Sort Range dialog. Missing this checkbox will sort your headers into the data, causing row 1 to be rearranged incorrectly.
            </TipBox>
            <WarnBox>
              <strong>Menu-based sorting is PERMANENT.</strong> It physically rearranges your data. If you need a sorted view while keeping the original order intact, always use the SORT or SORTN formula functions instead.
            </WarnBox>
          </div>
        </SectionCard>

        {/* ── PRACTICE ── */}
        <PracticeSection />

        {/* ── QUIZ ── */}
        <QuizSection />

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── SUMMARY ── */}
        <SectionCard id="summary" icon="📝" title="Summary" color={C.blue}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 24 }}>
            {[
              { icon: "📋", title: "Sort Sheet", color: C.blue, bg: "#f0f5ff", points: ["Sorts the ENTIRE sheet together", "Header auto-detected", "One-click A→Z or Z→A", "Permanent change — use Ctrl+Z"] },
              { icon: "🔲", title: "Sort Range", color: C.green, bg: "#f0faf4", points: ["Sorts SELECTED range only", "Manual header checkbox", "Multi-level sorting supported", "Multiple tables stay separate"] },
              { icon: "🎨", title: "Sort by Color", color: C.orange, bg: "#fff7ed", points: ["Sort by fill OR text color", "One color per operation", "Reverse order for multi-color", "Works with conditional format"] },
              { icon: "⚡", title: "SORT Formula", color: C.blue, bg: "#f0f5ff", points: ["Returns ALL rows sorted", "Original data unchanged", "Multi-column support", "Dynamic — auto-updates"] },
              { icon: "🏆", title: "SORTN Formula", color: "#9333ea", bg: "#faf0ff", points: ["Returns TOP N rows only", "4 tie-handling modes", "Perfect for leaderboards", "Dynamic — auto-updates"] },
            ].map((card) => (
              <div key={card.title} style={{ background: card.bg, borderRadius: 14, padding: "20px 22px", border: `1px solid ${card.color}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{card.icon}</span>
                  <h4 style={{ color: card.color, fontWeight: 800, margin: 0, fontSize: 15 }}>{card.title}</h4>
                </div>
                {card.points.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: card.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                    <span style={{ color: "#2B2B2B", fontSize: 13.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.navy})`, borderRadius: 14, padding: "22px 28px", textAlign: "center" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0, lineHeight: 1.7 }}>
              💡 Use <strong>Data Menu Sort</strong> for quick permanent sorting · Use <strong>SORT/SORTN</strong> for dynamic views · Use <strong>Sort by Color</strong> for priority-coded datasets
            </p>
          </div>
        </SectionCard>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.navy, padding: "36px 40px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 28 }}>
          {/* Left */}
          <div>
            <p style={{ color: "#d1d5db", margin: 0, fontSize: 14.5 }}>© 2026 All rights reserved by <strong style={{ color: "#fff" }}>Data Explore</strong></p>
          </div>
          {/* Right */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 12px" }}>Follow Us</p>
            <div style={{ display: "flex", gap: 12 }}>
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61587418725142" target="_blank" rel="noopener noreferrer"
                style={{ background: "#2d3748", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.blue; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2d3748"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/prosenjitbappii/" target="_blank" rel="noopener noreferrer"
                style={{ background: "#2d3748", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.blue; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2d3748"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@dataexplore_prosenjit" target="_blank" rel="noopener noreferrer"
                style={{ background: "#2d3748", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.blue; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2d3748"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1f2a3a" /></svg>
              </a>
            </div>
          </div>
        </div>
        {/* Bottom info button */}
        <div style={{ maxWidth: 1100, margin: "20px auto 0", display: "flex", alignItems: "center" }}>
          <button title="Sort & SortN — Google Sheets Complete Guide by Data Explore"
            style={{ background: "#2d3748", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontStyle: "italic", fontWeight: 700, fontSize: 14 }}>
            i
          </button>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          section[id] { padding: 24px 18px !important; }
          #hero-btns { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          table { font-size: 12px !important; }
          th, td { padding: 7px 8px !important; }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        a { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
