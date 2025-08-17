const API = '/api';

const qs = s => document.querySelector(s);
const todoList = qs('#todoList');
const nameList = qs('#nameList');
const todoForm = qs('#todoForm');
const nameForm = qs('#nameForm');

async function fetchJSON(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}

// ---- Todos ----
async function loadTodos() {
  const items = await fetchJSON(`${API}/todos`);
  todoList.innerHTML = items.map(renderTodo).join('');
  bindTodoEvents();
}

function renderTodo(t) {
  return `<li class="p-3 border rounded-xl flex items-center justify-between">
    <label class="flex items-center gap-2">
      <input type="checkbox" data-id="${t._id}" class="todo-toggle" ${t.done ? 'checked' : ''}/>
      <span class="${t.done ? 'line-through text-gray-400' : ''}">${escapeHtml(t.text)}</span>
    </label>
    <button data-id="${t._id}" class="todo-del text-xs px-2 py-1 rounded-full border">Delete</button>
  </li>`;
}

function bindTodoEvents() {
  document.querySelectorAll('.todo-toggle').forEach(cb => {
    cb.addEventListener('change', async e => {
      const id = e.target.dataset.id;
      await fetchJSON(`${API}/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ done: e.target.checked }) });
      loadTodos();
    });
  });
  document.querySelectorAll('.todo-del').forEach(b => {
    b.addEventListener('click', async e => {
      const id = e.target.dataset.id;
      await fetchJSON(`${API}/todos/${id}`, { method: 'DELETE' });
      loadTodos();
    });
  });
}

todoForm.addEventListener('submit', async e => {
  e.preventDefault();
  const input = qs('#todoInput');
  if (!input.value.trim()) return;
  await fetchJSON(`${API}/todos`, { method: 'POST', body: JSON.stringify({ text: input.value }) });
  input.value = '';
  loadTodos();
});

// ---- Names ----
async function loadNames() {
  const items = await fetchJSON(`${API}/names`);
  nameList.innerHTML = items.map(renderName).join('');
  bindNameEvents();
}

function renderName(n) {
  return `<li class="p-3 border rounded-xl flex items-center justify-between">
    <span>${escapeHtml(n.name)}</span>
    <button data-id="${n._id}" class="name-del text-xs px-2 py-1 rounded-full border">Delete</button>
  </li>`;
}

function bindNameEvents() {
  document.querySelectorAll('.name-del').forEach(b => {
    b.addEventListener('click', async e => {
      const id = e.target.dataset.id;
      await fetchJSON(`${API}/names/${id}`, { method: 'DELETE' });
      loadNames();
    });
  });
}

nameForm.addEventListener('submit', async e => {
  e.preventDefault();
  const input = qs('#nameInput');
  if (!input.value.trim()) return;
  await fetchJSON(`${API}/names`, { method: 'POST', body: JSON.stringify({ name: input.value }) });
  input.value = '';
  loadNames();
});

// ---- Seed buttons ----
qs('#seedTodos').addEventListener('click', async () => {
  const seeds = ['Design landing page', 'Write CI/CD workflow', 'Deploy to EC2'];
  for (const text of seeds) await fetchJSON(`${API}/todos`, { method: 'POST', body: JSON.stringify({ text }) });
  loadTodos();
});

qs('#seedNames').addEventListener('click', async () => {
  const seeds = ['Abir', 'Amina', 'Rahim', 'Anika'];
  for (const name of seeds) await fetchJSON(`${API}/names`, { method: 'POST', body: JSON.stringify({ name }) });
  loadNames();
});

// ---- Utils ----
function escapeHtml(s) {
  const div = document.createElement('div');
  div.innerText = s;
  return div.innerHTML;
}

// Initial load
loadTodos();
loadNames();
