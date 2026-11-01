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
  currentPage: 'home',
  pageHistory: [],
  taskOriginCategory: 'Gym',
  tasks: [],
  deletedTasks: [],
  profile: { name: '', goal: '', instagram: '', linkedIn: '', x: '', email: '' },
  categoryDialogMode: 'add',
  pendingCategoryDelete: '',
  notificationPermission: 'default',
  challengeTemplates: [
    { id: 'week-1', label: 'Challenge Week 1', durationDays: 7 },
    { id: 'week-2', label: 'Challenge Week 2', durationDays: 14 },
    { id: '21-days', label: '21 Days Challenge', durationDays: 21 },
    { id: '1-month', label: '1 Month Challenge', durationDays: 30 }
  ],
  customChallenges: [],
  activeChallenge: null,
  pomodoroHistory: [],
  pomodoro: {
    isRunning: false,
    minutes: 25,
    remainingSeconds: 25 * 60,
    endTime: null,
    intervalId: null
  }
};

const els = {
  categoryQuickSelect: document.getElementById('categoryQuickSelect'),
  appPages: [...document.querySelectorAll('[data-app-page].app-page')],
  pageBackButtons: [...document.querySelectorAll('[data-back]')],
  homeGreeting: document.getElementById('homeGreeting'),
  homeDateLabel: document.getElementById('homeDateLabel'),
  homeGoal: document.getElementById('homeGoal'),
  homeTaskCount: document.getElementById('homeTaskCount'),
  homeCompletedCount: document.getElementById('homeCompletedCount'),
  homeFocusCount: document.getElementById('homeFocusCount'),
  homeChallengeCard: document.getElementById('homeChallengeCard'),
  homeChallengeTitle: document.getElementById('homeChallengeTitle'),
  homeChallengeStatus: document.getElementById('homeChallengeStatus'),
  homeChallengeBar: document.getElementById('homeChallengeBar'),
  homeChallengeTrack: document.querySelector('#homeChallengeCard .challenge-progress-track'),
  homeChallengeDay: document.getElementById('homeChallengeDay'),
  homeChallengeDates: document.getElementById('homeChallengeDates'),
  reportRange: document.getElementById('reportRange'),
  reportTaskCount: document.getElementById('reportTaskCount'),
  reportCompletedCount: document.getElementById('reportCompletedCount'),
  reportCompletionRate: document.getElementById('reportCompletionRate'),
  categoryReportChart: document.getElementById('categoryReportChart'),
  activityReportChart: document.getElementById('activityReportChart'),
  challengeSelect: document.getElementById('challengeSelect'),
  challengeProgressPanel: document.getElementById('challengeProgressPanel'),
  challengeProgressTitle: document.getElementById('challengeProgressTitle'),
  challengeProgressStatus: document.getElementById('challengeProgressStatus'),
  challengeProgressTrack: document.querySelector('.challenge-progress-track'),
  challengeProgressBar: document.getElementById('challengeProgressBar'),
  challengeProgressDay: document.getElementById('challengeProgressDay'),
  challengeProgressDates: document.getElementById('challengeProgressDates'),
  customChallengeDialog: document.getElementById('customChallengeDialog'),
  customChallengeForm: document.getElementById('customChallengeForm'),
  customChallengeName: document.getElementById('customChallengeName'),
  customChallengeDays: document.getElementById('customChallengeDays'),
  cancelCustomChallenge: document.getElementById('cancelCustomChallenge'),
  customPomodoroDialog: document.getElementById('customPomodoroDialog'),
  customPomodoroForm: document.getElementById('customPomodoroForm'),
  customPomodoroMinutes: document.getElementById('customPomodoroMinutes'),
  cancelCustomPomodoro: document.getElementById('cancelCustomPomodoro'),
  pomodoroDurationSelect: document.getElementById('pomodoroDurationSelect'),
  pomodoroTodayCount: document.getElementById('pomodoroTodayCount'),
  pomodoroWeekCount: document.getElementById('pomodoroWeekCount'),
  pomodoroMonthCount: document.getElementById('pomodoroMonthCount'),
  pomodoroHistorySummary: document.getElementById('pomodoroHistorySummary'),
  pomodoroHistoryList: document.getElementById('pomodoroHistoryList'),
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
  deleteCategoryBtn: document.getElementById('deleteCategoryBtn'),
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

function normalizePomodoroHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.filter((entry) =>
    entry &&
    typeof entry === 'object' &&
    Number.isFinite(entry.completedAt) &&
    entry.completedAt >= 0 &&
    entry.completedAt <= 8640000000000000 &&
    Number.isInteger(entry.minutes) &&
    entry.minutes >= 1 &&
    entry.minutes <= 180);
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
    state.customChallenges = Array.isArray(saved.customChallenges) ? saved.customChallenges : [];
    state.activeChallenge = saved.activeChallenge || null;
    state.pomodoroHistory = normalizePomodoroHistory(saved.pomodoroHistory);
    state.pomodoro.minutes = Number.isInteger(saved.pomodoroMinutes)
      ? Math.min(180, Math.max(1, saved.pomodoroMinutes))
      : 25;
    state.pomodoro.remainingSeconds = state.pomodoro.minutes * 60;
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
    profile: state.profile,
    customChallenges: state.customChallenges,
    activeChallenge: state.activeChallenge,
    pomodoroHistory: state.pomodoroHistory,
    pomodoroMinutes: state.pomodoro.minutes
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

function buildChallengeOptions() {
  const challengeOptions = [
    { id: '', label: 'No challenge' },
    ...state.challengeTemplates,
    ...state.customChallenges,
    { id: 'custom', label: 'Custom timeline...' }
  ];

  if (!els.challengeSelect) return;

  const selectedValue = state.activeChallenge ? state.activeChallenge.id : '';
  els.challengeSelect.innerHTML = challengeOptions
    .map((challenge) => `<option value="${challenge.id}">${escapeHtml(challenge.label)}</option>`)
    .join('');

  const customChoice = state.customChallenges.find((challenge) => challenge.id === selectedValue);
  if (state.activeChallenge && customChoice) {
    els.challengeSelect.value = customChoice.id;
  } else if (state.activeChallenge) {
    els.challengeSelect.value = state.activeChallenge.id;
  } else {
    els.challengeSelect.value = '';
  }
}

function renderPomodoroDuration() {
  const duration = state.pomodoro.minutes;
  let option = els.pomodoroDurationSelect.querySelector('option[value="custom-selected"]');
  if (duration !== 15 && duration !== 25 && duration !== 50) {
    if (!option) {
      option = document.createElement('option');
      option.value = 'custom-selected';
      els.pomodoroDurationSelect.insertBefore(option, els.pomodoroDurationSelect.lastElementChild);
    }
    option.textContent = `Custom (${duration} minute${duration === 1 ? '' : 's'})`;
    els.pomodoroDurationSelect.value = 'custom-selected';
  } else {
    if (option) option.remove();
    els.pomodoroDurationSelect.value = String(duration);
  }
}

function renderPomodoroHistory() {
  const now = new Date();
  const today = formatDateInput(now);
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayFromMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - dayFromMonday);
  const weekStartKey = formatDateInput(weekStart);
  const monthKey = today.slice(0, 7);
  const history = [...state.pomodoroHistory].sort((a, b) => b.completedAt - a.completedAt);
  const completedToday = history.filter((entry) => formatDateInput(new Date(entry.completedAt)) === today);
  const completedThisWeek = history.filter((entry) => formatDateInput(new Date(entry.completedAt)) >= weekStartKey);
  const completedThisMonth = history.filter((entry) => formatDateInput(new Date(entry.completedAt)).slice(0, 7) === monthKey);

  els.pomodoroTodayCount.textContent = String(completedToday.length);
  els.pomodoroWeekCount.textContent = String(completedThisWeek.length);
  els.pomodoroMonthCount.textContent = String(completedThisMonth.length);
  const focusedMinutes = completedToday.reduce((total, entry) => total + entry.minutes, 0);
  els.pomodoroHistorySummary.textContent = focusedMinutes
    ? `${focusedMinutes} focused minute${focusedMinutes === 1 ? '' : 's'} today`
    : 'Complete a focus session to start building your history.';
  const recentSessions = history.slice(0, 5);
  els.pomodoroHistoryList.innerHTML = recentSessions.map((entry) => {
    const completedAt = new Date(entry.completedAt);
    const dateLabel = formatDateInput(completedAt) === today
      ? 'Today'
      : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(completedAt);
    const timeLabel = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(completedAt);
    return `<li>${dateLabel}, ${timeLabel} · ${entry.minutes} min</li>`;
  }).join('');
  if (!recentSessions.length) {
    els.pomodoroHistoryList.innerHTML = '';
  }
}

function renderChallengeProgress() {
  const challenge = state.activeChallenge;
  if (!challenge) {
    els.challengeProgressPanel.hidden = true;
    els.homeChallengeCard.hidden = true;
    return;
  }

  const progress = getChallengeProgress(challenge);
  els.challengeProgressPanel.hidden = false;
  els.challengeProgressTitle.textContent = challenge.label;
  els.challengeProgressStatus.textContent = progress.isComplete ? 'Complete' : `${progress.percent}% complete`;
  els.challengeProgressTrack.setAttribute('aria-valuenow', String(progress.percent));
  els.challengeProgressBar.style.width = `${progress.percent}%`;
  els.challengeProgressDay.textContent = progress.isComplete
    ? `${progress.durationDays} of ${progress.durationDays} days`
    : `Day ${progress.challengeDay} of ${progress.durationDays}`;
  els.challengeProgressDates.textContent = `Started ${formatDateLabel(progress.startDate)} · Ends ${formatDateLabel(progress.endDate)}`;

  els.homeChallengeCard.hidden = false;
  els.homeChallengeTitle.textContent = challenge.label;
  els.homeChallengeStatus.textContent = progress.isComplete ? 'Complete' : `${progress.percent}% complete`;
  els.homeChallengeTrack.setAttribute('aria-valuenow', String(progress.percent));
  els.homeChallengeBar.style.width = `${progress.percent}%`;
  els.homeChallengeDay.textContent = progress.isComplete
    ? `${progress.durationDays} of ${progress.durationDays} days`
    : `Day ${progress.challengeDay} of ${progress.durationDays}`;
  els.homeChallengeDates.textContent = `Started ${formatDateLabel(progress.startDate)} · Ends ${formatDateLabel(progress.endDate)}`;
}

function getChallengeProgress(challenge) {
  const durationDays = Math.max(1, Number(challenge.durationDays) || 1);
  const startDate = challenge.startedOn || formatDateInput(new Date());
  const today = formatDateInput(new Date());
  const elapsedDays = Math.max(
    0,
    Math.floor((parseDateInput(today) - parseDateInput(startDate)) / 86400000)
  );
  const challengeDay = Math.min(durationDays, elapsedDays + 1);
  const isComplete = elapsedDays >= durationDays;
  return {
    durationDays,
    startDate,
    endDate: formatDateInput(new Date(parseDateInput(startDate).getTime() + (durationDays - 1) * 86400000)),
    challengeDay,
    isComplete,
    percent: isComplete ? 100 : Math.round((elapsedDays / durationDays) * 100)
  };
}

function renderCategoryQuickSelect() {
  if (!els.categoryQuickSelect) return;

  if (!state.categories.includes(state.selectedCategory) && state.selectedCategory !== 'All') {
    state.selectedCategory = 'All';
  }
  const currentValue = state.selectedCategory;
  els.categoryQuickSelect.innerHTML = ['All', ...state.categories]
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join('');
  els.categoryQuickSelect.value = currentValue;
  els.deleteCategoryBtn.disabled = state.selectedCategory === 'All' || state.categories.length <= 1;
}

function renderCategories() {
  els.selectedCategoryTitle.textContent = state.selectedCategory;
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

function renderHomePage() {
  const hour = new Date().getHours();
  const timeGreeting = hour >= 5 && hour < 12
    ? 'Good morning'
    : hour >= 12 && hour < 17
      ? 'Good afternoon'
      : hour >= 17 && hour < 22
        ? 'Good evening'
        : 'Good night';
  const name = state.profile.name.trim();
  const today = formatDateInput(new Date());
  const todaysTasks = state.tasks.filter((task) => task.date === today);
  const completedToday = todaysTasks.filter((task) => task.completed).length;
  const focusedToday = state.pomodoroHistory.filter((entry) =>
    formatDateInput(new Date(entry.completedAt)) === today).length;
  els.homeGreeting.textContent = name ? `${timeGreeting}, ${name}` : timeGreeting;
  els.homeDateLabel.textContent = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  els.homeGoal.textContent = state.profile.goal.trim()
    ? `Your goal: ${state.profile.goal.trim()}`
    : 'Make today count, one focused step at a time.';
  els.homeTaskCount.textContent = String(todaysTasks.length);
  els.homeCompletedCount.textContent = String(completedToday);
  els.homeFocusCount.textContent = String(focusedToday);
}

function getReportDateRange() {
  const today = parseDateInput(formatDateInput(new Date()));
  const range = els.reportRange.value;
  if (range === 'all') return { start: '', end: formatDateInput(today) };
  const days = Number(range) || 30;
  const start = new Date(today);
  start.setDate(start.getDate() - days + 1);
  return { start: formatDateInput(start), end: formatDateInput(today) };
}

function createReportEmpty(message) {
  const empty = document.createElement('p');
  empty.className = 'report-empty';
  empty.textContent = message;
  return empty;
}

function renderReportsPage() {
  const { start, end } = getReportDateRange();
  const tasks = state.tasks.filter((task) =>
    task.date <= end && (!start || task.date >= start));
  const completed = tasks.filter((task) => task.completed).length;
  els.reportTaskCount.textContent = String(tasks.length);
  els.reportCompletedCount.textContent = String(completed);
  els.reportCompletionRate.textContent = `${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%`;

  const categoryCounts = state.categories.map((category) => ({
    category,
    count: tasks.filter((task) => task.category === category).length
  }));
  const maxCategoryCount = Math.max(1, ...categoryCounts.map((entry) => entry.count));
  els.categoryReportChart.replaceChildren();
  if (tasks.length === 0) {
    els.categoryReportChart.append(createReportEmpty('No task data for this time range yet.'));
  } else {
    categoryCounts.forEach(({ category, count }) => {
      const row = document.createElement('div');
      row.className = 'bar-chart-row';
      const label = document.createElement('span');
      label.className = 'bar-chart-label';
      label.textContent = category;
      const track = document.createElement('span');
      track.className = 'bar-chart-track';
      const fill = document.createElement('span');
      fill.className = 'bar-chart-fill';
      fill.style.width = `${(count / maxCategoryCount) * 100}%`;
      fill.style.background = `linear-gradient(90deg, ${getCategoryColor(category)}, var(--blue))`;
      track.append(fill);
      const value = document.createElement('strong');
      value.className = 'bar-chart-value';
      value.textContent = String(count);
      row.append(label, track, value);
      els.categoryReportChart.append(row);
    });
  }

  const activityBuckets = getActivityBuckets();
  const maxActivity = Math.max(1, ...activityBuckets.map((bucket) => bucket.completed));
  els.activityReportChart.replaceChildren();
  if (tasks.length === 0) {
    els.activityReportChart.append(createReportEmpty('Completed tasks will appear here.'));
  } else {
    activityBuckets.forEach((bucket) => {
      const column = document.createElement('div');
      column.className = 'activity-bar';
      const value = document.createElement('span');
      value.className = 'activity-bar-value';
      value.textContent = String(bucket.completed);
      const track = document.createElement('span');
      track.className = 'activity-bar-track';
      const fill = document.createElement('span');
      fill.className = 'activity-bar-fill';
      fill.style.height = `${bucket.completed ? Math.max(4, (bucket.completed / maxActivity) * 100) : 0}%`;
      track.append(fill);
      track.setAttribute('aria-label', `${bucket.label}: ${bucket.completed} completed`);
      const label = document.createElement('span');
      label.className = 'activity-bar-label';
      label.textContent = bucket.label;
      column.append(value, track, label);
      els.activityReportChart.append(column);
    });
  }
}

function getActivityBuckets() {
  const range = els.reportRange.value;
  const today = parseDateInput(formatDateInput(new Date()));
  if (range === 'all') {
    return Array.from({ length: 6 }, (_, index) => {
      const month = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
      const monthKey = formatDateInput(month).slice(0, 7);
      const completed = state.tasks.filter((task) =>
        task.completed && task.date.slice(0, 7) === monthKey).length;
      return {
        label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(month),
        completed
      };
    });
  }

  if (range === '7') {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(day.getDate() - 6 + index);
      const key = formatDateInput(day);
      return {
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day),
        completed: state.tasks.filter((task) => task.completed && task.date === key).length
      };
    });
  }

  return Array.from({ length: 5 }, (_, index) => {
    const firstDate = new Date(today);
    firstDate.setDate(firstDate.getDate() - 29 + index * 6);
    const lastDate = new Date(firstDate);
    lastDate.setDate(lastDate.getDate() + 5);
    if (index === 4) lastDate.setTime(today.getTime());
    const firstKey = formatDateInput(firstDate);
    const lastKey = formatDateInput(lastDate);
    return {
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(firstDate),
      completed: state.tasks.filter((task) =>
        task.completed && task.date >= firstKey && task.date <= lastKey).length
    };
  });
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

function persistProfileDraft() {
  state.profile = {
    name: els.profileName.value.trim(),
    goal: els.profileGoal.value.trim(),
    instagram: els.profileInstagram.value.trim(),
    linkedIn: els.profileLinkedIn.value.trim(),
    x: els.profileX.value.trim(),
    email: els.profileEmail.value.trim()
  };
  persistState();
  renderPersonalization();
  renderHomePage();
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
  renderCategoryQuickSelect();
  buildChallengeOptions();
  renderChallengeProgress();
  renderPomodoroDuration();
  renderPomodoroHistory();
  renderCategories();
  renderTaskList();
  renderStats();
  renderTrashList();
  renderPersonalization();
  renderHomePage();
  renderReportsPage();
}

function updateCategoryFormValue() {
  els.taskCategory.value = state.selectedCategory === 'All' ? DEFAULT_CATEGORIES[0] : state.selectedCategory;
  renderCustomFields();
}

function setMobileView(view) {
  state.mobileView = view;
  document.body.dataset.mobileView = view;
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

function navigateAppPage(page, recordHistory = true) {
  const target = els.appPages.find((item) => item.dataset.appPage === page);
  if (!target) return;
  if (page !== state.currentPage && recordHistory) {
    state.pageHistory.push(state.currentPage);
  }
  state.currentPage = page;
  document.body.dataset.appPage = page;
  els.appPages.forEach((item) => {
    item.hidden = item !== target;
  });
  setMobileView(page);
  if (page === 'profile') loadProfileForm();
  if (page === 'tasks') {
    els.taskFormPanel.hidden = true;
    setMobileView('tasks');
  }
  els.pageBackButtons.forEach((button) => {
    button.disabled = state.pageHistory.length === 0;
  });
  setMobileMenuOpen(false);
  renderAll();
}

function goBack() {
  const previousPage = state.pageHistory.pop();
  if (previousPage) {
    navigateAppPage(previousPage, false);
  } else if (state.currentPage !== 'home') {
    navigateAppPage('home', false);
  }
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
    profile: state.profile,
    customChallenges: state.customChallenges,
    activeChallenge: state.activeChallenge,
    pomodoroHistory: state.pomodoroHistory,
    pomodoroMinutes: state.pomodoro.minutes
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
      state.customChallenges = Array.isArray(parsed.customChallenges) ? parsed.customChallenges : [];
      state.activeChallenge = parsed.activeChallenge || null;
      state.pomodoroHistory = normalizePomodoroHistory(parsed.pomodoroHistory);
      state.pomodoro.minutes = Number.isInteger(parsed.pomodoroMinutes)
        ? Math.min(180, Math.max(1, parsed.pomodoroMinutes))
        : 25;
      state.pomodoro.remainingSeconds = state.pomodoro.minutes * 60;
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
  const total = state.pomodoro.minutes * 60;
  const remaining = Number.isFinite(state.pomodoro.remainingSeconds)
    ? Math.max(0, state.pomodoro.remainingSeconds)
    : total;
  els.timerDisplay.textContent = formatTimer(Math.min(total, remaining));
}

function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startPomodoro() {
  if (state.pomodoro.isRunning) {
    pausePomodoro();
    return;
  }
  const total = state.pomodoro.minutes * 60;
  if (!Number.isFinite(state.pomodoro.remainingSeconds) || state.pomodoro.remainingSeconds <= 0) {
    state.pomodoro.remainingSeconds = total;
  }
  state.pomodoro.isRunning = true;
  state.pomodoro.endTime = Date.now() + state.pomodoro.remainingSeconds * 1000;
  els.startPomodoroBtn.textContent = 'Pause';
  els.pomodoroDurationSelect.disabled = true;
  tickPomodoro();
  state.pomodoro.intervalId = setInterval(tickPomodoro, 250);
  showToast('Pomodoro started', 'success');
}

function tickPomodoro() {
  if (!state.pomodoro.isRunning || !state.pomodoro.endTime) return;
  state.pomodoro.remainingSeconds = Math.max(
    0,
    Math.ceil((state.pomodoro.endTime - Date.now()) / 1000)
  );
  els.timerDisplay.textContent = formatTimer(state.pomodoro.remainingSeconds);

  if (state.pomodoro.remainingSeconds === 0) {
    if (state.pomodoro.intervalId) clearInterval(state.pomodoro.intervalId);
    state.pomodoro.intervalId = null;
    state.pomodoro.endTime = null;
    state.pomodoro.isRunning = false;
    els.startPomodoroBtn.textContent = 'Start';
    els.pomodoroDurationSelect.disabled = false;
    state.pomodoroHistory.push({
      completedAt: Date.now(),
      minutes: state.pomodoro.minutes
    });
    persistState();
    renderPomodoroHistory();
    showToast('Pomodoro complete. Great focus session.', 'success');
    playAlarmTone();
  }
}

function pausePomodoro() {
  if (!state.pomodoro.isRunning) return;
  state.pomodoro.remainingSeconds = Math.max(
    0,
    Math.ceil((state.pomodoro.endTime - Date.now()) / 1000)
  );
  if (state.pomodoro.intervalId) clearInterval(state.pomodoro.intervalId);
  state.pomodoro.intervalId = null;
  state.pomodoro.endTime = null;
  state.pomodoro.isRunning = false;
  els.pomodoroDurationSelect.disabled = false;
  els.startPomodoroBtn.textContent = 'Resume';
  setPomodoroTimer();
}

function resetPomodoro() {
  if (state.pomodoro.intervalId) {
    clearInterval(state.pomodoro.intervalId);
    state.pomodoro.intervalId = null;
  }
  state.pomodoro.isRunning = false;
  state.pomodoro.endTime = null;
  state.pomodoro.remainingSeconds = state.pomodoro.minutes * 60;
  els.timerDisplay.textContent = formatTimer(state.pomodoro.minutes * 60);
  els.startPomodoroBtn.textContent = 'Start';
  els.pomodoroDurationSelect.disabled = false;
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
  els.categoryQuickSelect.addEventListener('focus', () => {
    state.categoryMenuWasOpen = els.sidebar.classList.contains('is-open');
  });
  els.categoryQuickSelect.addEventListener('pointerdown', (event) => event.stopPropagation());
  els.categoryQuickSelect.addEventListener('click', (event) => event.stopPropagation());
  els.categoryQuickSelect.addEventListener('change', (event) => {
    state.selectedCategory = event.target.value || 'All';
    state.taskOriginCategory = state.selectedCategory;
    navigateAppPage('tasks');
    state.categoryMenuWasOpen = false;
  });
  els.challengeSelect.addEventListener('focus', () => {
    state.challengeMenuWasOpen = els.sidebar.classList.contains('is-open');
  });
  ['pointerdown', 'click', 'touchstart'].forEach((eventName) => {
    els.challengeSelect.addEventListener(eventName, (event) => event.stopPropagation());
  });
  els.deleteCategoryBtn.addEventListener('click', () => {
    if (state.selectedCategory !== 'All') prepareCategoryDeletion(state.selectedCategory);
  });
  els.challengeSelect.addEventListener('change', (event) => {
    const value = event.target.value;
    const drawerWasOpen = els.sidebar.classList.contains('is-open');
    if (!value) {
      state.activeChallenge = null;
      persistState();
      renderChallengeProgress();
      renderHomePage();
      showToast('Challenge cleared', 'success');
      if (drawerWasOpen) setMobileMenuOpen(true);
      return;
    }

    if (value === 'custom') {
      buildChallengeOptions();
      els.customChallengeForm.reset();
      els.customChallengeDays.value = '14';
      els.customChallengeDialog.showModal();
      els.customChallengeName.focus();
      if (drawerWasOpen) setMobileMenuOpen(true);
      return;
    }

    const challenge = [...state.challengeTemplates, ...state.customChallenges].find((entry) => entry.id === value);
    if (!challenge) return;

    state.activeChallenge = {
      ...challenge,
      startedOn: formatDateInput(new Date())
    };
    persistState();
    renderChallengeProgress();
    renderHomePage();
    showToast(`${challenge.label} selected`, 'success');
    if (drawerWasOpen) setMobileMenuOpen(true);
  });
  els.customChallengeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const label = els.customChallengeName.value.trim();
    const durationDays = Number(els.customChallengeDays.value);
    if (!label || !Number.isInteger(durationDays) || durationDays < 1 || durationDays > 3650) {
      showToast('Enter a challenge name and a duration from 1 to 3650 days', 'warning');
      return;
    }

    const challenge = {
      id: `custom-${generateId()}`,
      label,
      durationDays
    };
    state.customChallenges.push(challenge);
    state.activeChallenge = {
      ...challenge,
      startedOn: formatDateInput(new Date())
    };
    persistState();
    els.customChallengeDialog.close();
    renderAll();
    showToast(`${label} started`, 'success');
    if (els.sidebar.classList.contains('is-open')) setMobileMenuOpen(true);
  });
  els.cancelCustomChallenge.addEventListener('click', () => {
    els.customChallengeDialog.close();
    buildChallengeOptions();
    if (els.sidebar.classList.contains('is-open')) setMobileMenuOpen(true);
  });
  els.customChallengeDialog.addEventListener('click', (event) => {
    if (event.target === els.customChallengeDialog) {
      els.customChallengeDialog.close();
      buildChallengeOptions();
      if (els.sidebar.classList.contains('is-open')) setMobileMenuOpen(true);
    }
  });
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
  els.reportRange.addEventListener('change', renderReportsPage);
  els.focusModeBtn.addEventListener('click', () => els.focusModeDialog.showModal());
  els.closeFocusModeBtn.addEventListener('click', () => els.focusModeDialog.close());
  els.focusModeDialog.addEventListener('click', (event) => {
    if (event.target === els.focusModeDialog) els.focusModeDialog.close();
  });

  els.addCategoryBtn.addEventListener('click', addCategory);
  els.pomodoroDurationSelect.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value === 'custom') {
      els.customPomodoroMinutes.value = String(state.pomodoro.minutes);
      els.customPomodoroDialog.showModal();
      els.customPomodoroMinutes.focus();
      return;
    }

    state.pomodoro.minutes = Number(value);
    resetPomodoro();
    persistState();
    renderPomodoroDuration();
  });
  els.customPomodoroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const minutes = Number(els.customPomodoroMinutes.value);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      showToast('Choose a session duration from 1 to 180 minutes', 'warning');
      return;
    }

    state.pomodoro.minutes = minutes;
    resetPomodoro();
    persistState();
    renderPomodoroDuration();
    els.customPomodoroDialog.close();
  });
  els.cancelCustomPomodoro.addEventListener('click', () => {
    els.customPomodoroDialog.close();
    renderPomodoroDuration();
  });
  els.customPomodoroDialog.addEventListener('click', (event) => {
    if (event.target === els.customPomodoroDialog) {
      els.customPomodoroDialog.close();
      renderPomodoroDuration();
    }
  });
  els.focusModeDialog.addEventListener('toggle', () => {
    if (els.focusModeDialog.open) {
      renderPomodoroDuration();
      renderPomodoroHistory();
      setPomodoroTimer();
    }
  });
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
  els.profileForm.addEventListener('input', persistProfileDraft);
  els.useSuggestionBtn.addEventListener('click', useSuggestion);

  els.menuToggle.addEventListener('click', () => {
    setMobileMenuOpen(!els.sidebar.classList.contains('is-open'));
  });
  els.menuScrim.addEventListener('click', () => setMobileMenuOpen(false));
  els.sidebar.addEventListener('click', (event) => {
    if (event.target.closest('#challengeSelect, #categoryQuickSelect')) {
      event.stopPropagation();
    }
  });
  els.sidebar.addEventListener('change', (event) => {
    if (event.target === els.challengeSelect && state.challengeMenuWasOpen) {
      setMobileMenuOpen(true);
      state.challengeMenuWasOpen = false;
    }
  });
  document.addEventListener('click', (event) => {
    const backButton = event.target.closest('[data-back]');
    if (backButton) {
      goBack();
      return;
    }
    const pageButton = event.target.closest('button[data-app-page]');
    if (!pageButton) return;
    navigateAppPage(pageButton.dataset.appPage);
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
  setMobileView('home');
  els.datePicker.value = state.selectedDate;
  state.selectedPriority = 'all';
  els.priorityFilter.value = 'all';
  seedForm();
  updateCategoryFormValue();
  loadProfileForm();
  renderAll();
  wireEvents();
  navigateAppPage('home', false);
  setInterval(() => {
    runReminderCheck();
    renderAll();
  }, 30000);
  setPomodoroTimer();
  showToast('Planner ready. Stay consistent and focused.', 'success');
}

init();
