(function () {
  const keys = window.SPECED_QUIZ_KEYS;
  const result = document.getElementById("quiz-result");
  const scoreBtn = document.getElementById("quiz-score");
  const revealBtn = document.getElementById("quiz-reveal");
  if (!keys || !result) return;

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[*_`]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function matchKey(answer, key) {
    const a = norm(answer);
    const k = norm(key);
    if (!a || !k) return false;
    return a === k || k.includes(a) || a.includes(k);
  }

  function collect() {
    const out = { L: {}, B: {}, H: {}, extra: "" };
    document.querySelectorAll("[data-quiz-id]").forEach((el) => {
      const id = el.getAttribute("data-quiz-id");
      if (el.type === "radio") {
        if (el.checked) out.B[id] = el.value;
        return;
      }
      if (id.startsWith("L")) out.L[id] = el.value;
      else if (id.startsWith("H")) out.H[id] = el.value;
      else if (id === "C-extra") out.extra = el.value;
    });
    return out;
  }

  function score() {
    if (!keys.hasKeys) {
      result.textContent = "Read-only quiz text — no grading (no keys found).";
      return;
    }
    let right = 0;
    let total = 0;
    const lines = [];
    for (const [id, key] of Object.entries(keys.L || {})) {
      total += 1;
      const ok = matchKey(collect().L[id], key);
      if (ok) right += 1;
      lines.push((ok ? "ok" : "no") + " " + id);
    }
    for (const [id, key] of Object.entries(keys.B || {})) {
      total += 1;
      const picked = document.querySelector("[data-quiz-id='" + id + "']:checked");
      const ok = picked && matchKey(picked.value, key);
      if (ok) right += 1;
      lines.push((ok ? "ok" : "no") + " " + id);
    }
    for (const [id, key] of Object.entries(keys.H || {})) {
      total += 1;
      const ok = matchKey(collect().H[id], key);
      if (ok) right += 1;
      lines.push((ok ? "ok" : "no") + " " + id);
    }
    if (keys.extra) {
      total += 1;
      const picked = document.querySelector("[data-quiz-id='C-extra']:checked");
      const ok = picked && matchKey(picked.value, keys.extra);
      if (ok) right += 1;
      lines.push((ok ? "ok" : "no") + " C-extra");
    }
    result.innerHTML =
      "<strong>Local score:</strong> " +
      right +
      " / " +
      total +
      " keyed items. Section D is not auto-graded (no winner key). " +
      "<span class='muted'>" +
      lines.join(" · ") +
      "</span>";
  }

  function reveal() {
    const box = document.getElementById("quiz-keys");
    if (box) box.hidden = !box.hidden;
  }

  if (scoreBtn) scoreBtn.addEventListener("click", score);
  if (revealBtn) revealBtn.addEventListener("click", reveal);
})();
