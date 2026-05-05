const STORAGE_KEY = "practice_memos";

const memoInput = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const memoList = document.getElementById("memoList");
const emptyState = document.getElementById("emptyState");

function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMemos(memos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("ja-JP");
}

function render() {
  const memos = loadMemos();
  memoList.innerHTML = "";

  if (memos.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  memos.forEach((memo) => {
    const li = document.createElement("li");

    const p = document.createElement("p");
    p.className = "memo-text";
    p.textContent = memo.text;

    const meta = document.createElement("div");
    meta.className = "meta";

    const time = document.createElement("span");
    time.textContent = `作成日時: ${formatDate(memo.createdAt)}`;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "削除";
    del.addEventListener("click", () => {
      const next = loadMemos().filter((m) => m.id !== memo.id);
      saveMemos(next);
      render();
    });

    meta.append(time, del);
    li.append(p, meta);
    memoList.append(li);
  });
}

addBtn.addEventListener("click", () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const memos = loadMemos();
  memos.unshift({
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  });

  saveMemos(memos);
  memoInput.value = "";
  render();
});

clearBtn.addEventListener("click", () => {
  if (!confirm("すべてのメモを削除します。よろしいですか？")) return;
  localStorage.removeItem(STORAGE_KEY);
  render();
});

render();
