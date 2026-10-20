const STORAGE_KEY = 'focusflow-planner-v1';
const DEFAULT_CATEGORIES = ['Gym', 'Study', 'Work', 'Health', 'Personal'];
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
  mobileView: 'tasks',
  taskOriginCategory: 'Gym',
  tasks: [],
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
  taskList: document.getElementById('taskList'),
  taskForm: document.getElementById('taskForm'),
  taskCategory: document.getElementById('taskCategory'),
  taskTitle: document.getElementById('taskTitle'),
  taskPriority: document.getElementById('taskPriority'),
  taskDate: document.getElementById('taskDate'),
  taskTime: document.getElementById('taskTime'),
  taskNotes: document.getElementById('taskNotes'),
  taskReminderMinutes: document.getElementById('taskReminderMinutes'),
  taskRecurrence: document.getElementById('taskRecurrence'),
  clearTaskForm: document.getElementById('clearTaskForm'),
  customFields: document.getElementById('customFields'),
  datePicker: document.getElementById('datePicker'),
  prevDayBtn: document.getElementById('prevDayBtn'),
  nextDayBtn: document.getElementById('nextDayBtn'),
  todayBtn: document.getElementById('todayBtn'),
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
  menuScrim: document.getElementById('menuScrim')
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
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
    persistState();
    return;
  }

  try {
    const saved = JSON.parse(raw);
    state.categories = Array.isArray(saved.categories) && saved.categories.length ? saved.categories : [...DEFAULT_CATEGORIES];
    state.tasks = Array.isArray(saved.tasks) ? saved.tasks : [];
  } catch (error) {
    console.error('Failed to parse saved state', error);
    state.tasks = [];
  }
}

function persistState() {
  const toSave = {
    categories: state.categories,
    tasks: state.tasks
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
    return true;
  });
}

function renderCategories() {
  const totalCounts = {};
  state.categories.forEach((category) => {
    totalCounts[category] = state.tasks.filter((task) => task.category === category).length;
  });

  const categoryButtons = state.categories
    .map((category) => `
      <button class="category-pill ${state.selectedCategory === category ? 'active' : ''}" data-category="${category}" type="button">
        <span class="category-meta">
          <span class="category-dot" style="background:${getCategoryColor(category)}"></span>
          <span>${category}</span>
        </span>
        <span class="category-count">${totalCounts[category] || 0}</span>
      </button>
    `)
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
}

function renderTaskList() {
  const tasks = getVisibleTasks();
  const inOrder = [...tasks].sort((a, b) => {
    const timeA = a.time || '23:59';
    const timeB = b.time || '23:59';
    return timeA.localeCompare(timeB);
  });

  if (!inOrder.length) {
    els.taskList.innerHTML = '<div class="empty-state">No tasks for this category and date. Add something focused and productive.</div>';
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
            <button class="delete-btn" type="button" data-action="delete" data-task-id="${task.id}">Delete</button>
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
}

function renderAll() {
  renderCategories();
  renderTaskList();
  renderStats();
}

function updateCategoryFormValue() {
  els.taskCategory.value = state.selectedCategory === 'All' ? DEFAULT_CATEGORIES[0] : state.selectedCategory;
  renderCustomFields();
}

function setMobileView(view) {
  state.mobileView = view;
  document.body.dataset.mobileView = view;
}

function setMobileMenuOpen(isOpen) {
  els.sidebar.classList.toggle('is-open', isOpen);
  els.menuScrim.hidden = !isOpen;
  els.menuToggle.setAttribute('aria-expanded', String(isOpen));
  els.menuToggle.setAttribute('aria-label', isOpen ? 'Close categories menu' : 'Open categories menu');
  document.body.classList.toggle('menu-open', isOpen);
}

function addCategory() {
  const name = window.prompt('Add a new category name:');
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  if (state.categories.some((category) => category.toLowerCase() === trimmed.toLowerCase())) {
    showToast('Category already exists', 'warning');
    return;
  }

  state.categories.push(trimmed);
  state.selectedCategory = trimmed;
  persistState();
  renderAll();
  updateCategoryFormValue();
  showToast(`Category ${trimmed} added`, 'success');
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
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  persistState();
  renderAll();
  showToast('Task removed', 'success');
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

    if (event.target.matches('.task-checkbox')) {
      toggleTaskComplete(event.target.dataset.taskId);
    }

    if (event.target.matches('.delete-btn')) {
      deleteTask(event.target.dataset.taskId);
    }
  });
}

function handleDateNavigation(direction) {
  const currentDate = parseDateInput(state.selectedDate);
  currentDate.setDate(currentDate.getDate() + direction);
  state.selectedDate = formatDateInput(currentDate);
  els.datePicker.value = state.selectedDate;
  renderAll();
}

function exportData() {
  const blob = new Blob([JSON.stringify({ categories: state.categories, tasks: state.tasks }, null, 2)], { type: 'application/json' });
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
      persistState();
      renderAll();
      updateCategoryFormValue();
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
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const context = new AudioCtx();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.06;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    context.close();
  }, 500);
}

function raiseReminder(task) {
  if (!task || task.completed || task.reminderTriggered) return;

  const priority = task.priority || 'medium';
  const due = new Date(`${task.date}T${task.time || '09:00'}:00`);
  const shouldAlarm = Date.now() >= due.getTime();
  if (!shouldAlarm) return;

  task.reminderTriggered = true;
  persistState();
  notifyTask(task, priority);
  showToast(`${task.title} is due and needs attention`, 'warning');
  playAlarmTone();
  if (priority === 'high') {
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
  const cutoff = Date.now() - 60 * 1000;
  state.tasks.forEach((task) => {
    if (task.completed) return;
    if (task.reminderTriggered && task.lastAlarmAt && task.lastAlarmAt < cutoff) {
      task.reminderTriggered = false;
    }
    if (!task.reminderTriggered) {
      const dueDate = task.date && task.time ? new Date(`${task.date}T${task.time}:00`) : null;
      if (dueDate && Date.now() >= dueDate.getTime()) {
        raiseReminder(task);
      }
    }
  });
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
  els.taskForm.addEventListener('submit', createTask);
  els.clearTaskForm.addEventListener('click', () => {
    els.taskForm.reset();
    els.taskPriority.value = 'medium';
    els.taskReminderMinutes.value = '15';
    els.taskRecurrence.value = 'none';
    els.taskDate.value = state.selectedDate;
    renderCustomFields();
  });

  els.taskCategory.addEventListener('change', renderCustomFields);
  els.priorityFilter.addEventListener('change', (event) => {
    state.selectedPriority = event.target.value;
    renderTaskList();
  });

  els.prevDayBtn.addEventListener('click', () => handleDateNavigation(-1));
  els.nextDayBtn.addEventListener('click', () => handleDateNavigation(1));
  els.todayBtn.addEventListener('click', () => {
    state.selectedDate = formatDateInput(new Date());
    els.datePicker.value = state.selectedDate;
    renderAll();
  });

  els.datePicker.addEventListener('change', (event) => {
    state.selectedDate = event.target.value;
    renderAll();
  });

  els.addCategoryBtn.addEventListener('click', addCategory);
  els.newTaskBtn.addEventListener('click', () => {
    state.taskOriginCategory = state.selectedCategory;
    els.taskForm.reset();
    els.taskCategory.value = state.selectedCategory === 'All' ? '' : state.selectedCategory;
    els.taskDate.value = state.selectedDate;
    els.taskPriority.value = 'medium';
    els.taskReminderMinutes.value = '15';
    els.taskRecurrence.value = 'none';
    renderCustomFields();
    if (window.matchMedia('(max-width: 860px)').matches) {
      setMobileView('planner');
    }
    els.taskCategory.focus();
  });

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
    if (event.target.dataset.action) return;
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    els.taskTitle.value = task.title;
    els.taskCategory.value = task.category;
    els.taskPriority.value = task.priority;
    els.taskDate.value = task.date;
    els.taskTime.value = task.time || '';
    els.taskNotes.value = task.notes || '';
    els.taskReminderMinutes.value = String(task.reminderMinutes || 0);
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
  state.selectedCategory = state.categories[0] || 'All';
  if (window.matchMedia('(max-width: 860px)').matches) {
    setMobileView('tasks');
  }
  els.datePicker.value = state.selectedDate;
  state.selectedPriority = 'all';
  els.priorityFilter.value = 'all';
  seedForm();
  updateCategoryFormValue();
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
