const STORAGE_KEY = 'focusflow-planner-v1';
const DEFAULT_CATEGORIES = ['Gym', 'Study', 'Work', 'Health', 'Personal'];
let alarmAudioContext = null;
const CUSTOM_FIELDS = {
  Gym: [
    { key: 'equipment', label: 'Equipment', type: 'text' },
    { key: 'workoutType', label: 'Workout type', type: 'text' },
    { key: 'duration', label: 'Duration (min)', type: 'number' },
    { key: 'focusArea', label: 'Focus area', type: 'text' }
  ],
  Study: [
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'chapter', label: 'Topic/chapter', type: 'text' },
    { key: 'target', label: 'Study target', type: 'text' }
  ],
  Work: [
    { key: 'project', label: 'Project', type: 'text' },
    { key: 'client', label: 'Client / team', type: 'text' },
    { key: 'deliverable', label: 'Deliverable', type: 'text' }
  ],
  Health: [
    { key: 'measure', label: 'Measure / metric', type: 'text' },
    { key: 'routine', label: 'Routine', type: 'text' },
    { key: 'goal', label: 'Goal', type: 'text' }
  ],
  Personal: [
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'mood', label: 'Mood', type: 'text' },
    { key: 'notes', label: 'Personal notes', type: 'text' }
  ]
};

const state = {
  categories: [...DEFAULT_CATEGORIES],
  selectedCategory: 'Gym',
  selectedDate: formatDateInput(new Date()),
  selectedPriority: 'all',
  selectedTaskStatus: 'all',
  mobileView: 'tasks',
  taskOriginCategory: 'Gym',
  tasks: [],
  deletedTasks: [],
  profile: { name: '', goal: '', instagram: '', linkedIn: '', x: '', email: '' },
  categoryDialogMode: 'add',
  pendingCategoryDelete: '',
  notificationPermission: 'default',
  pomodoro: {
    isRunning: false,
    minutes: 25,
    remainingSeconds: 25 * 60,
    intervalId: null
  }
};

const els = {
  categoryList: document.getElementById('categoryList'),
  selectedCategoryTitle: document.getElementById('selectedCategoryTitle'),
  taskPanel: document.querySelector('.task-panel'),
  taskList: document.getElementById('taskList'),
  taskListMode: document.getElementById('taskListMode'),
  statsGrid: document.querySelector('.stats-grid'),
  taskForm: document.getElementById('taskForm'),
  taskCategory: document.getElementById('taskCategory'),
  taskTitle: document.getElementById('taskTitle'),
  taskPriority: document.getElementById('taskPriority'),
  taskDate: document.getElementById('taskDate'),
  taskTime: document.getElementById('taskTime'),
  taskNotes: document.getElementById('taskNotes'),
  taskReminderMinutes: document.getElementById('taskReminderMinutes'),
  taskReminderMode: document.getElementById('taskReminderMode'),
  taskRecurrence: document.getElementById('taskRecurrence'),
  clearTaskForm: document.getElementById('clearTaskForm'),
  closeTaskFormBtn: document.getElementById('closeTaskFormBtn'),
  taskFormPanel: document.getElementById('taskFormPanel'),
  customFields: document.getElementById('customFields'),
  datePicker: document.getElementById('datePicker'),
  calendarPickerBtn: document.getElementById('calendarPickerBtn'),
  focusModeBtn: document.getElementById('focusModeBtn'),
  focusModeDialog: document.getElementById('focusModeDialog'),
  closeFocusModeBtn: document.getElementById('closeFocusModeBtn'),
  addCategoryBtn: document.getElementById('addCategoryBtn'),
  newTaskBtn: document.getElementById('newTaskBtn'),
  priorityFilter: document.getElementById('priorityFilter'),
  tasksAddedCount: document.getElementById('tasksAddedCount'),
  completedCount: document.getElementById('completedCount'),
  openCount: document.getElementById('openCount'),
  completionRate: document.getElementById('completionRate'),
  timerDisplay: document.getElementById('timerDisplay'),
  startPomodoroBtn: document.getElementById('startPomodoroBtn'),
  resetPomodoroBtn: document.getElementById('resetPomodoroBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importFile: document.getElementById('importFile'),
  requestNotificationBtn: document.getElementById('requestNotificationBtn'),
  toastContainer: document.getElementById('toastContainer'),
  alarmSound: document.getElementById('alarmSound'),
  sidebar: document.getElementById('categoryDrawer'),
  menuToggle: document.getElementById('menuToggle'),
  menuScrim: document.getElementById('menuScrim'),
  trashCount: document.getElementById('trashCount'),
  trashList: document.getElementById('trashList'),
  trashPanel: document.getElementById('trashPanel'),
  profilePanel: document.getElementById('profilePanel'),
  profileForm: document.getElementById('profileForm'),
  profileName: document.getElementById('profileName'),
  profileGoal: document.getElementById('profileGoal'),
  profileInstagram: document.getElementById('profileInstagram'),
  profileLinkedIn: document.getElementById('profileLinkedIn'),
  profileX: document.getElementById('profileX'),
  profileEmail: document.getElementById('profileEmail'),
  greeting: document.getElementById('greeting'),
  smartSuggestion: document.getElementById('smartSuggestion'),
  useSuggestionBtn: document.getElementById('useSuggestionBtn'),
  socialLinks: document.getElementById('socialLinks'),
  categoryDialog: document.getElementById('categoryDialog'),
  categoryDialogForm: document.getElementById('categoryDialogForm'),
  categoryDialogTitle: document.getElementById('categoryDialogTitle'),
  categoryDialogMessage: document.getElementById('categoryDialogMessage'),
  categoryDialogInputWrap: document.getElementById('categoryDialogInputWrap'),
  categoryDialogInput: document.getElementById('categoryDialogInput'),
  confirmCategoryDialog: document.getElementById('confirmCategoryDialog'),
  cancelCategoryDialog: document.getElementById('cancelCategoryDialog')
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function formatDateInput(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function parseDateInput(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(dateString) {
  const date = parseDateInput(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.tasks = [
      {
        id: generateId(),
        title: 'Morning workout',
        category: 'Gym',
        date: formatDateInput(new Date()),
        time: '06:30',
        priority: 'high',
        notes: 'Warm-up and push routine.',
        customFields: { equipment: 'Shoes', workoutType: 'Strength', duration: '45', focusArea: 'Chest' },
        reminderMinutes: 15,
        recurrence: 'none',
        completed: false,
        createdAt: Date.now(),
        reminderTriggered: false
      },
      {
        id: generateId(),
        title: 'Read entrepreneurship chapter',
        category: 'Study',
        date: formatDateInput(new Date()),
        time: '19:30',
        priority: 'medium',
        notes: 'Finish chapter 4 summary.',
        customFields: { subject: 'Business', chapter: 'Chapter 4', target: 'Take 4 notes' },
        reminderMinutes: 15,
        recurrence: 'weekly',
        completed: false,
        createdAt: Date.now(),
        reminderTriggered: false
      }
    ];
    state.deletedTasks = [];
    persistState();
    return;
  }

  try {
    const saved = JSON.parse(raw);
    state.categories = Array.isArray(saved.categories) && saved.categories.length ? saved.categories : [...DEFAULT_CATEGORIES];
    state.tasks = Array.isArray(saved.tasks) ? saved.tasks : [];
    state.deletedTasks = Array.isArray(saved.deletedTasks) ? saved.deletedTasks : [];
    state.profile = { ...state.profile, ...(saved.profile || {}) };
  } catch (error) {
    console.error('Failed to parse saved state', error);
    state.tasks = [];
  }
}

function persistState() {
  const toSave = {
    categories: state.categories,
    tasks: state.tasks,
    deletedTasks: state.deletedTasks,
    profile: state.profile
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

function seedForm() {
  els.taskCategory.innerHTML = '<option value="" disabled selected>Choose a category</option>' + state.categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join('');

  els.taskDate.value = state.selectedDate;
  els.taskTime.value = '';
  els.taskTitle.value = '';
  els.taskNotes.value = '';
  els.taskPriority.value = 'medium';
  els.taskReminderMinutes.value = '15';
  els.taskReminderMode.value = 'both';
  els.taskRecurrence.value = 'none';
  renderCustomFields();
}

function renderCustomFields() {
  const selectedCategory = els.taskCategory.value;
  const fields = CUSTOM_FIELDS[selectedCategory] || [];

  if (!fields.length) {
    els.customFields.innerHTML = '';
    return;
  }

  els.customFields.innerHTML = fields
    .map((field) => `
      <div class="custom-field">
        <label for="custom-${field.key}">${field.label}</label>
        <input id="custom-${field.key}" name="${field.key}" type="${field.type}" placeholder="${field.label}" />
      </div>
    `)
    .join('');
}

function formatPriority(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function getCategoryColor(category) {
  const palette = {
    Gym: '#8b5cf6',
    Study: '#38bdf8',
    Work: '#f97316',
    Health: '#22c55e',
    Personal: '#f43f5e'
  };
  return palette[category] || '#94a3b8';
}

function getTasksForSelectedDate() {
  const selected = state.selectedDate;
  return state.tasks.filter((task) => task.date === selected);
}

function getVisibleTasks() {
  const tasks = getTasksForSelectedDate();
  return tasks.filter((task) => {
    if (state.selectedCategory !== 'All') {
      if (task.category !== state.selectedCategory) return false;
    }
    if (state.selectedPriority !== 'all' && task.priority !== state.selectedPriority) return false;
    if (state.selectedTaskStatus === 'open' && task.completed) return false;
    if (state.selectedTaskStatus === 'completed' && !task.completed) return false;
    return true;
  });
}

function renderCategories() {
  const totalCounts = {};
  state.categories.forEach((category) => {
    totalCounts[category] = state.tasks.filter((task) => task.category === category).length;
  });

  const categoryButtons = state.categories
    .map((category) => {
      const label = escapeHtml(category);
      return `
        <div class="category-row">
          <button class="category-pill ${state.selectedCategory === category ? 'active' : ''}" data-category="${label}" type="button">
            <span class="category-meta">
              <span class="category-dot" style="background:${getCategoryColor(category)}"></span>
              <span>${label}</span>
            </span>
            <span class="category-count">${totalCounts[category] || 0}</span>
          </button>
          <button class="category-delete" type="button" data-action="delete-category" data-category-name="${label}" aria-label="Delete ${label} category" title="Delete ${label}">×</button>
        </div>
      `;
    })
    .join('');

  els.categoryList.innerHTML = categoryButtons;
  els.selectedCategoryTitle.textContent = state.selectedCategory;

  const allButton = `
    <button class="category-pill ${state.selectedCategory === 'All' ? 'active' : ''}" data-category="All" type="button">
      <span class="category-meta">
        <span class="category-dot" style="background:#a78bfa"></span>
        <span>All</span>
      </span>
      <span class="category-count">${state.tasks.length}</span>
    </button>
  `;

  els.categoryList.innerHTML = allButton + categoryButtons;
  els.trashCount.textContent = String(state.deletedTasks.length);
}

function renderTaskList() {
  const modeLabels = {
    all: 'All tasks',
    open: 'Open tasks',
    completed: 'Completed tasks'
  };
  els.taskListMode.textContent = `${modeLabels[state.selectedTaskStatus]} · ${formatDateLabel(state.selectedDate)}`;

  const tasks = getVisibleTasks();
  const inOrder = [...tasks].sort((a, b) => {
    const timeA = a.time || '23:59';
    const timeB = b.time || '23:59';
    return timeA.localeCompare(timeB);
  });

  if (!inOrder.length) {
    const emptyMessages = {
      all: 'No tasks for this category and date. Add something focused and productive.',
      open: 'No open tasks for this category and date.',
      completed: 'No completed tasks for this category and date.'
    };
    els.taskList.innerHTML = `<div class="empty-state">${emptyMessages[state.selectedTaskStatus]}</div>`;
    return;
  }

  els.taskList.innerHTML = inOrder
    .map((task) => {
      const customParts = Object.entries(task.customFields || {})
        .filter(([, value]) => value && String(value).trim() !== '')
        .map(([key, value]) => `<span class="custom-chip">${key}: ${value}</span>`)
        .join('');

      return `
        <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
          <input class="task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} data-action="toggle" data-task-id="${task.id}" />
          <div class="task-main">
            <div class="task-header">
              <span class="task-title">${task.title}</span>
              <span class="task-tag priority-${task.priority}">${formatPriority(task.priority)}</span>
              <span class="task-tag" style="background:${getCategoryColor(task.category)}20; color:${getCategoryColor(task.category)};">${task.category}</span>
            </div>
            <div class="task-meta">
              <span class="task-meta-item">📅 ${task.date}</span>
              <span class="task-meta-item">⏰ ${task.time || 'Any time'}</span>
              <span class="task-meta-item">🔔 ${task.reminderMinutes || 0}m before</span>
              ${task.recurring && task.recurring !== 'none' ? `<span class="task-meta-item">🔁 ${task.recurring}</span>` : ''}
            </div>
            ${task.notes ? `<div class="task-meta-item">${task.notes}</div>` : ''}
            ${customParts ? `<div class="task-custom">${customParts}</div>` : ''}
          </div>
          <div class="task-side">
            <span class="task-time">${task.completed ? 'Done' : isTaskLate(task) ? 'Overdue' : 'On track'}</span>
            <button class="delete-btn" type="button" data-action="delete-task" data-task-id="${task.id}">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function isTaskLate(task) {
  if (task.completed) return false;
  if (!task.time || !task.date) return false;
  const taskDate = new Date(`${task.date}T${task.time}:00`);
  return taskDate.getTime() < Date.now();
}

function renderStats() {
  const categoryTasks = state.selectedCategory === 'All'
    ? state.tasks
    : state.tasks.filter((task) => task.category === state.selectedCategory);
  const completed = categoryTasks.filter((task) => task.completed).length;
  const open = categoryTasks.length - completed;
  const completion = categoryTasks.length ? Math.round((completed / categoryTasks.length) * 100) : 0;

  els.tasksAddedCount.textContent = String(categoryTasks.length);
  els.completedCount.textContent = String(completed);
  els.openCount.textContent = String(open);
  els.completionRate.textContent = `${completion}%`;
  els.statsGrid.querySelectorAll('[data-task-filter]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.taskFilter === state.selectedTaskStatus));
  });
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

function renderPersonalization() {
  const name = state.profile.name.trim();
  els.greeting.textContent = name ? `Welcome back, ${name}` : 'Welcome to your planner';

  const category = state.selectedCategory === 'All'
    ? state.categories
      .map((name) => ({ name, count: state.tasks.filter((task) => task.category === name && task.completed).length }))
      .sort((a, b) => b.count - a.count)[0]?.name || state.categories[0]
    : state.selectedCategory;
  const history = state.tasks
    .filter((task) => task.category === category && task.completed)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (state.profile.goal.trim()) {
    els.smartSuggestion.textContent = `Your goal: ${state.profile.goal.trim()} Try a small 15-minute ${category} session today to keep moving toward it.`;
    state.suggestion = {
      title: `15-minute ${category.toLowerCase()} session`,
      category,
      notes: `A small step toward your goal: ${state.profile.goal.trim()}`
    };
  } else if (history.length) {
    els.smartSuggestion.textContent = `You completed ${history.length} ${category} task${history.length === 1 ? '' : 's'} in your history. Repeating “${history[0].title}” could help build a routine.`;
    state.suggestion = {
      title: history[0].title,
      category,
      notes: 'Suggested from a previously completed task.'
    };
  } else {
    els.smartSuggestion.textContent = `Try adding one small ${category} task today. Your completed tasks will help personalize future suggestions.`;
    state.suggestion = {
      title: `Plan a first ${category.toLowerCase()} task`,
      category,
      notes: 'A small, specific step is easier to complete.'
    };
  }

  els.useSuggestionBtn.hidden = false;
  els.socialLinks.innerHTML = [
    ['Instagram', 'IG', state.profile.instagram],
    ['LinkedIn', 'in', state.profile.linkedIn],
    ['X', 'X', state.profile.x]
  ].map(([label, icon, value]) => {
    const href = safeExternalUrl(value);
    return href
      ? `<a class="social-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}">${icon}</a>`
      : `<span class="social-link social-link-placeholder" aria-label="${label} link not set" title="Add ${label} in Profile & goals">${icon}</span>`;
  }).join('');
  if (state.profile.email.trim()) {
    const email = state.profile.email.trim();
    els.socialLinks.insertAdjacentHTML('beforeend', `<a class="social-link" href="mailto:${encodeURIComponent(email)}" aria-label="Email" title="Email">@</a>`);
  } else {
    els.socialLinks.insertAdjacentHTML('beforeend', '<span class="social-link social-link-placeholder" aria-label="Email link not set" title="Add an email in Profile & goals">@</span>');
  }
}

function loadProfileForm() {
  els.profileName.value = state.profile.name || '';
  els.profileGoal.value = state.profile.goal || '';
  els.profileInstagram.value = state.profile.instagram || '';
  els.profileLinkedIn.value = state.profile.linkedIn || '';
  els.profileX.value = state.profile.x || '';
  els.profileEmail.value = state.profile.email || '';
}

function saveProfile(event) {
  event.preventDefault();
  state.profile = {
    name: els.profileName.value.trim(),
    goal: els.profileGoal.value.trim(),
    instagram: els.profileInstagram.value.trim(),
    linkedIn: els.profileLinkedIn.value.trim(),
    x: els.profileX.value.trim(),
    email: els.profileEmail.value.trim()
  };
  persistState();
  renderAll();
  showToast('Profile and goal saved', 'success');
}

function useSuggestion() {
  const originCategory = state.selectedCategory;
  state.selectedCategory = state.suggestion.category;
  els.newTaskBtn.click();
  state.taskOriginCategory = originCategory;
  els.taskCategory.value = state.suggestion.category;
  els.taskTitle.value = state.suggestion.title;
  els.taskNotes.value = state.suggestion.notes;
  renderCustomFields();
}

function purgeExpiredDeletedTasks() {
  const retentionCutoff = Date.now() - 15 * 24 * 60 * 60 * 1000;
  state.deletedTasks = state.deletedTasks.filter((entry) => Number(entry.deletedAt) >= retentionCutoff);
}

function renderTrashList() {
  els.trashCount.textContent = String(state.deletedTasks.length);
  if (!state.deletedTasks.length) {
    els.trashList.innerHTML = '<div class="empty-state">The deleted list is empty.</div>';
    return;
  }

  els.trashList.innerHTML = [...state.deletedTasks]
    .sort((a, b) => b.deletedAt - a.deletedAt)
    .map(({ task, deletedAt }) => `
      <div class="task-card trash-card">
        <div class="task-main">
          <span class="task-title">${escapeHtml(task.title)}</span>
          <div class="task-meta">${escapeHtml(task.category)} · Deleted ${new Date(deletedAt).toLocaleDateString()}</div>
        </div>
        <div class="task-side trash-actions">
          <button class="complete-task-btn" type="button" data-action="restore-task" data-task-id="${task.id}">Restore</button>
          <button class="delete-btn" type="button" data-action="discard-trash" data-task-id="${task.id}">Delete permanently</button>
        </div>
      </div>
    `)
    .join('');
}

function restoreDeletedTask(taskId) {
  const index = state.deletedTasks.findIndex((entry) => entry.task.id === taskId);
  if (index < 0) return;
  const [{ task }] = state.deletedTasks.splice(index, 1);
  state.tasks.push(task);
  persistState();
  renderAll();
  showToast('Task restored', 'success');
}

function discardDeletedTask(taskId) {
  state.deletedTasks = state.deletedTasks.filter((entry) => entry.task.id !== taskId);
  persistState();
  renderAll();
  showToast('Task permanently deleted', 'success');
}

function renderAll() {
  renderCategories();
  renderTaskList();
  renderStats();
  renderTrashList();
  renderPersonalization();
}

function updateCategoryFormValue() {
  els.taskCategory.value = state.selectedCategory === 'All' ? DEFAULT_CATEGORIES[0] : state.selectedCategory;
  renderCustomFields();
}

function setMobileView(view) {
  state.mobileView = view;
  document.body.dataset.mobileView = view;
  els.trashPanel.hidden = view !== 'trash';
  els.profilePanel.hidden = view !== 'profile';
}

function setTaskFormOpen(isOpen) {
  els.taskFormPanel.hidden = !isOpen;
  if (window.matchMedia('(max-width: 860px)').matches) {
    setMobileView(isOpen ? 'planner' : 'tasks');
  }
}

function setMobileMenuOpen(isOpen) {
  els.sidebar.classList.toggle('is-open', isOpen);
  els.menuScrim.hidden = !isOpen;
  els.menuToggle.setAttribute('aria-expanded', String(isOpen));
  els.menuToggle.setAttribute('aria-label', isOpen ? 'Close categories menu' : 'Open categories menu');
  document.body.classList.toggle('menu-open', isOpen);
}

function addCategory() {
  state.categoryDialogMode = 'add';
  state.pendingCategoryDelete = '';
  els.categoryDialogTitle.textContent = 'Add category';
  els.categoryDialogMessage.textContent = 'Create a category for a new area of focus.';
  els.categoryDialogInputWrap.hidden = false;
  els.categoryDialogInput.required = true;
  els.categoryDialogInput.value = '';
  els.confirmCategoryDialog.textContent = 'Add category';
  els.categoryDialog.showModal();
  els.categoryDialogInput.focus();
}

function prepareCategoryDeletion(category) {
  if (state.categories.length <= 1) {
    showToast('Keep at least one category in your planner', 'warning');
    return;
  }

  const movedTasks = state.tasks.filter((task) => task.category === category).length;
  const replacement = state.categories.find((item) => item !== category);
  state.categoryDialogMode = 'delete';
  state.pendingCategoryDelete = category;
  els.categoryDialogTitle.textContent = `Delete ${category}?`;
  els.categoryDialogMessage.textContent = movedTasks
    ? `${movedTasks} task${movedTasks === 1 ? '' : 's'} will be moved to ${replacement} so they are kept.`
    : 'This category will be removed from your planner.';
  els.categoryDialogInputWrap.hidden = true;
  els.categoryDialogInput.required = false;
  els.confirmCategoryDialog.textContent = 'Delete category';
  els.categoryDialog.showModal();
}

function handleCategoryDialogSubmit(event) {
  event.preventDefault();

  if (state.categoryDialogMode === 'add') {
    const name = els.categoryDialogInput.value.trim();
    if (!name) return;
    if (state.categories.some((category) => category.toLowerCase() === name.toLowerCase())) {
      showToast('Category already exists', 'warning');
      return;
    }

    state.categories.push(name);
    state.selectedCategory = name;
    state.taskOriginCategory = name;
    persistState();
    seedForm();
    els.taskCategory.value = name;
    renderCustomFields();
    renderAll();
    els.categoryDialog.close();
    showToast(`Category ${name} added`, 'success');
    return;
  }

  const category = state.pendingCategoryDelete;
  const replacement = state.categories.find((item) => item !== category);
  if (!replacement) return;

  state.tasks.forEach((task) => {
    if (task.category === category) task.category = replacement;
  });
  state.deletedTasks.forEach((entry) => {
    if (entry.task.category === category) entry.task.category = replacement;
  });
  state.categories = state.categories.filter((item) => item !== category);
  if (state.selectedCategory === category) state.selectedCategory = 'All';
  state.taskOriginCategory = state.selectedCategory;
  persistState();
  seedForm();
  updateCategoryFormValue();
  renderAll();
  els.categoryDialog.close();
  showToast(`Category removed. Tasks moved to ${replacement}.`, 'success');
}

function showToast(message, type = 'warning') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<strong>FocusFlow</strong><span>${message}</span>`;
  els.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function createTask(event) {
  event.preventDefault();
  unlockAlarmAudio();

  const title = els.taskTitle.value.trim();
  if (!title) {
    showToast('Task title is required', 'warning');
    return;
  }

  const category = els.taskCategory.value;
  if (!category) {
    showToast('Choose a category for this task', 'warning');
    els.taskCategory.focus();
    return;
  }
  const date = els.taskDate.value || state.selectedDate;
  const time = els.taskTime.value || '09:00';

  const customFields = {};
  const fields = CUSTOM_FIELDS[category] || [];
  fields.forEach((field) => {
    const value = document.getElementById(`custom-${field.key}`)?.value?.trim();
    if (value) customFields[field.key] = value;
  });

  const newTask = {
    id: generateId(),
    title,
    category,
    date,
    time,
    priority: els.taskPriority.value,
    notes: els.taskNotes.value.trim(),
    customFields,
    reminderMinutes: Number(els.taskReminderMinutes.value || 0),
    reminderMode: els.taskReminderMode.value,
    recurrence: els.taskRecurrence.value,
    completed: false,
    createdAt: Date.now(),
    reminderTriggered: false
  };

  state.tasks.push(newTask);
  state.selectedCategory = state.taskOriginCategory === 'All' ? 'All' : category;
  state.selectedDate = date;
  if (window.matchMedia('(max-width: 860px)').matches) {
    setMobileView('tasks');
  }
  persistState();
  runReminderCheck();
  renderAll();
  els.taskForm.reset();
  els.taskPriority.value = 'medium';
  els.taskReminderMinutes.value = '15';
  els.taskRecurrence.value = 'none';
  els.taskDate.value = date;
  renderCustomFields();
  showToast('Task saved to your planner', 'success');
}

function toggleTaskComplete(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  task.reminderTriggered = true;

  if (task.completed && task.recurrence && task.recurrence !== 'none') {
    rescheduleRecurringTask(task);
  }

  persistState();
  renderAll();
  showToast(task.completed ? 'Task completed! Nice work.' : 'Task reopened', 'success');
}

function rescheduleRecurringTask(task) {
  const currentDate = parseDateInput(task.date);
  const nextDate = new Date(currentDate);

  if (task.recurrence === 'daily') nextDate.setDate(nextDate.getDate() + 1);
  if (task.recurrence === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
  if (task.recurrence === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

  const newTask = {
    ...task,
    id: generateId(),
    completed: false,
    reminderTriggered: false,
    date: formatDateInput(nextDate),
    createdAt: Date.now(),
    notes: task.notes
  };

  state.tasks = state.tasks.filter((item) => item.id !== task.id);
  state.tasks.push(newTask);
}

function deleteTask(taskId) {
  const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex < 0) return;
  const [task] = state.tasks.splice(taskIndex, 1);
  state.deletedTasks.push({ task, deletedAt: Date.now() });
  purgeExpiredDeletedTasks();
  persistState();
  renderAll();
  showToast('Task moved to Recently deleted', 'success');
}

function handleTaskInteraction(event) {
  const actionTarget = event.target.dataset.action;
  const taskId = event.target.dataset.taskId;

  if (!taskId) return;

  if (actionTarget === 'toggle') {
    toggleTaskComplete(taskId);
  }

  if (actionTarget === 'delete') {
    deleteTask(taskId);
  }
}

function attachCalendarListeners() {
  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      const { action, taskId, categoryName } = actionButton.dataset;
      if (action === 'toggle-task' || action === 'toggle') toggleTaskComplete(taskId);
      if (action === 'delete-task') deleteTask(taskId);
      if (action === 'restore-task') restoreDeletedTask(taskId);
      if (action === 'discard-trash') discardDeletedTask(taskId);
      if (action === 'delete-category') prepareCategoryDeletion(categoryName);
      return;
    }

    const categoryBtn = event.target.closest('[data-category]');
    if (categoryBtn) {
      const selected = categoryBtn.dataset.category;
      state.selectedCategory = selected;
      state.taskOriginCategory = selected;
      els.taskCategory.value = selected === 'All' ? '' : selected;
      renderCustomFields();
      if (window.matchMedia('(max-width: 860px)').matches) {
        setMobileView('tasks');
        setMobileMenuOpen(false);
      }
      if (selected !== 'All') {
        state.selectedDate = state.selectedDate || formatDateInput(new Date());
      }
      renderAll();
      return;
    }

  });
}

function exportData() {
  const blob = new Blob([JSON.stringify({
    categories: state.categories,
    tasks: state.tasks,
    deletedTasks: state.deletedTasks,
    profile: state.profile
  }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'focusflow-backup.json';
  link.click();
  URL.revokeObjectURL(url);
  showToast('Backup exported successfully', 'success');
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed.tasks)) throw new Error('Invalid backup file');
      state.categories = Array.isArray(parsed.categories) && parsed.categories.length ? parsed.categories : state.categories;
      state.tasks = parsed.tasks;
      state.deletedTasks = Array.isArray(parsed.deletedTasks) ? parsed.deletedTasks : [];
      state.profile = { ...state.profile, ...(parsed.profile || {}) };
      purgeExpiredDeletedTasks();
      persistState();
      seedForm();
      updateCategoryFormValue();
      loadProfileForm();
      renderAll();
      showToast('Data imported successfully', 'success');
    } catch (error) {
      console.error('Import failed', error);
      showToast('Could not import that backup', 'warning');
    }
  };
  reader.readAsText(file);
}

function requestNotifications() {
  if (!('Notification' in window)) {
    showToast('Browser notifications are not supported here', 'warning');
    return;
  }

  Notification.requestPermission().then((permission) => {
    state.notificationPermission = permission;
    if (permission === 'granted') {
      showToast('Reminder notifications enabled', 'success');
    } else {
      showToast('Notifications are off, but in-app reminders still work', 'warning');
    }
  });
}

function playAlarmTone() {
  const context = alarmAudioContext || unlockAlarmAudio();
  if (!context) return;

  const play = () => {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(960, now);
    oscillator.frequency.setValueAtTime(720, now + 0.3);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.16, now + 0.025);
    gainNode.gain.setValueAtTime(0.16, now + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.72);
  };

  if (context.state === 'suspended') {
    context.resume().then(play).catch((error) => console.warn('Alarm audio could not resume', error));
  } else {
    play();
  }
}

function unlockAlarmAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!alarmAudioContext) alarmAudioContext = new AudioCtx();
  if (alarmAudioContext.state === 'suspended') {
    alarmAudioContext.resume().catch((error) => console.warn('Alarm audio could not unlock', error));
  }
  return alarmAudioContext;
}

function raiseReminder(task) {
  if (!task || task.completed || task.reminderTriggered) return;

  const priority = task.priority || 'medium';
  const due = new Date(`${task.date}T${task.time || '09:00'}:00`);
  const reminderMode = task.reminderMode || 'both';
  const leadTime = Math.max(0, Number(task.reminderMinutes || 0)) * 60 * 1000;
  if (reminderMode === 'none' || Date.now() < due.getTime() - leadTime) return;

  task.reminderTriggered = true;
  persistState();
  if (reminderMode === 'both' || reminderMode === 'notification') {
    notifyTask(task, priority);
  }
  if (reminderMode === 'both' || reminderMode === 'alarm') {
    showToast(`${task.title} is coming up`, 'warning');
    playAlarmTone();
  } else {
    showToast(`Notification: ${task.title} is coming up`, 'warning');
  }
  if ((reminderMode === 'both' || reminderMode === 'alarm') && priority === 'high') {
    setTimeout(() => {
      playAlarmTone();
      showToast(`${task.title} high-priority alarm is repeating`, 'warning');
    }, 1500);
  }
}

function notifyTask(task, priority) {
  const title = `Reminder: ${task.title}`;
  const body = `${task.category} • ${priority.toUpperCase()} priority • due ${task.date}`;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function runReminderCheck() {
  purgeExpiredDeletedTasks();
  state.tasks.forEach((task) => {
    raiseReminder(task);
  });
  persistState();
}

function setPomodoroTimer() {
  const minutes = state.pomodoro.minutes;
  const seconds = state.pomodoro.remainingSeconds;
  const totalSeconds = minutes * 60;
  const remaining = Math.max(0, totalSeconds - seconds);
  const display = formatTimer(remaining);
  els.timerDisplay.textContent = display;
}

function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startPomodoro() {
  if (state.pomodoro.isRunning) return;

  state.pomodoro.isRunning = true;
  state.pomodoro.intervalId = setInterval(() => {
    state.pomodoro.remainingSeconds += 1;
    const total = state.pomodoro.minutes * 60;
    const remaining = total - state.pomodoro.remainingSeconds;
    if (remaining <= 0) {
      clearInterval(state.pomodoro.intervalId);
      state.pomodoro.isRunning = false;
      state.pomodoro.remainingSeconds = state.pomodoro.minutes * 60;
      showToast('Pomodoro complete. Great focus session.', 'success');
      playAlarmTone();
      els.timerDisplay.textContent = formatTimer(0);
      return;
    }
    els.timerDisplay.textContent = formatTimer(remaining);
  }, 1000);

  showToast('Pomodoro started', 'success');
}

function resetPomodoro() {
  if (state.pomodoro.intervalId) {
    clearInterval(state.pomodoro.intervalId);
  }
  state.pomodoro.isRunning = false;
  state.pomodoro.remainingSeconds = state.pomodoro.minutes * 60;
  els.timerDisplay.textContent = formatTimer(state.pomodoro.minutes * 60);
}

function wireEvents() {
  document.addEventListener('pointerdown', unlockAlarmAudio, { once: true });
  document.addEventListener('keydown', unlockAlarmAudio, { once: true });
  els.taskForm.addEventListener('submit', createTask);
  els.clearTaskForm.addEventListener('click', () => {
    els.taskForm.reset();
    els.taskCategory.value = state.taskOriginCategory === 'All' ? '' : state.taskOriginCategory;
    els.taskPriority.value = 'medium';
    els.taskReminderMinutes.value = '15';
    els.taskReminderMode.value = 'both';
    els.taskRecurrence.value = 'none';
    els.taskDate.value = state.selectedDate;
    renderCustomFields();
  });

  els.taskCategory.addEventListener('change', renderCustomFields);
  els.priorityFilter.addEventListener('change', (event) => {
    state.selectedPriority = event.target.value;
    renderTaskList();
  });
  els.statsGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-task-filter]');
    if (!card) return;

    state.selectedTaskStatus = card.dataset.taskFilter;
    state.selectedPriority = 'all';
    els.priorityFilter.value = 'all';
    if (window.matchMedia('(max-width: 860px)').matches) {
      setMobileView('tasks');
    }
    renderAll();
    els.taskPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.calendarPickerBtn.addEventListener('click', () => {
    try {
      if (typeof els.datePicker.showPicker === 'function') {
        els.datePicker.showPicker();
      } else {
        els.datePicker.click();
      }
    } catch {
      els.datePicker.focus();
      els.datePicker.click();
    }
  });
  els.datePicker.addEventListener('change', (event) => {
    state.selectedDate = event.target.value;
    renderAll();
  });
  els.focusModeBtn.addEventListener('click', () => els.focusModeDialog.showModal());
  els.closeFocusModeBtn.addEventListener('click', () => els.focusModeDialog.close());
  els.focusModeDialog.addEventListener('click', (event) => {
    if (event.target === els.focusModeDialog) els.focusModeDialog.close();
  });

  els.addCategoryBtn.addEventListener('click', addCategory);
  els.newTaskBtn.addEventListener('click', () => {
    state.taskOriginCategory = state.selectedCategory;
    els.taskForm.reset();
    els.taskCategory.value = state.selectedCategory === 'All' ? '' : state.selectedCategory;
    els.taskDate.value = state.selectedDate;
    els.taskPriority.value = 'medium';
    els.taskReminderMinutes.value = '15';
    els.taskReminderMode.value = 'both';
    els.taskRecurrence.value = 'none';
    renderCustomFields();
    setTaskFormOpen(true);
    els.taskCategory.focus();
  });
  els.closeTaskFormBtn.addEventListener('click', () => setTaskFormOpen(false));

  els.categoryDialogForm.addEventListener('submit', handleCategoryDialogSubmit);
  els.cancelCategoryDialog.addEventListener('click', () => els.categoryDialog.close());
  els.profileForm.addEventListener('submit', saveProfile);
  els.useSuggestionBtn.addEventListener('click', useSuggestion);

  els.menuToggle.addEventListener('click', () => {
    setMobileMenuOpen(!els.sidebar.classList.contains('is-open'));
  });
  els.menuScrim.addEventListener('click', () => setMobileMenuOpen(false));
  els.sidebar.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-mobile-view]');
    if (!viewButton) return;
    if (viewButton.dataset.mobileView === 'overview') {
      state.selectedCategory = 'All';
      state.taskOriginCategory = 'All';
      renderAll();
    }
    if (viewButton.dataset.mobileView === 'profile') loadProfileForm();
    setMobileView(viewButton.dataset.mobileView);
    setMobileMenuOpen(false);
    if (viewButton.dataset.mobileView === 'planner') {
      els.taskTitle.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMobileMenuOpen(false);
  });

  els.exportBtn.addEventListener('click', exportData);
  els.importFile.addEventListener('change', importData);
  els.requestNotificationBtn.addEventListener('click', requestNotifications);
  els.startPomodoroBtn.addEventListener('click', startPomodoro);
  els.resetPomodoroBtn.addEventListener('click', resetPomodoro);

  document.addEventListener('click', (event) => {
    const taskCard = event.target.closest('.task-card');
    if (!taskCard) return;
    const taskId = taskCard.dataset.taskId;
    if (event.target.closest('[data-action]')) return;
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    state.taskOriginCategory = task.category;
    els.taskFormPanel.hidden = false;
    if (window.matchMedia('(max-width: 860px)').matches) setMobileView('planner');
    els.taskTitle.value = task.title;
    els.taskCategory.value = task.category;
    els.taskPriority.value = task.priority;
    els.taskDate.value = task.date;
    els.taskTime.value = task.time || '';
    els.taskNotes.value = task.notes || '';
    els.taskReminderMinutes.value = String(task.reminderMinutes || 0);
    els.taskReminderMode.value = task.reminderMode || 'both';
    els.taskRecurrence.value = task.recurrence || 'none';
    renderCustomFields();
    const fieldEntries = Object.entries(task.customFields || {});
    fieldEntries.forEach(([key, value]) => {
      const input = document.getElementById(`custom-${key}`);
      if (input) input.value = value;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  attachCalendarListeners();
}

function init() {
  loadState();
  purgeExpiredDeletedTasks();
  state.selectedCategory = state.categories[0] || 'All';
  setMobileView('tasks');
  els.datePicker.value = state.selectedDate;
  state.selectedPriority = 'all';
  els.priorityFilter.value = 'all';
  seedForm();
  updateCategoryFormValue();
  loadProfileForm();
  renderAll();
  wireEvents();
  setInterval(() => {
    runReminderCheck();
    renderAll();
  }, 30000);
  setInterval(() => {
    if (state.pomodoro.isRunning) {
      state.pomodoro.remainingSeconds += 1;
      const total = state.pomodoro.minutes * 60;
      const remaining = total - state.pomodoro.remainingSeconds;
      if (remaining <= 0) {
        state.pomodoro.isRunning = false;
        state.pomodoro.remainingSeconds = total;
        showToast('Pomodoro complete. Great focus session.', 'success');
        playAlarmTone();
      }
      els.timerDisplay.textContent = formatTimer(Math.max(0, remaining));
    }
  }, 1000);
  showToast('Planner ready. Stay consistent and focused.', 'success');
}

init();
