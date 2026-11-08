(() => {
  const KEY = 'focusflow-fitness-v1';
  const dateInput = (date) => {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  };
  const today = () => dateInput(new Date());
  const id = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const categories = [
    ['dashboard', 'Dashboard'], ['profile', 'Fitness profile'], ['nutrition', 'Diet & nutrition'],
    ['workouts', 'Workout & exercise'], ['measurements', 'Body measurements'], ['weight', 'Weight progress'],
    ['water', 'Water intake'], ['sleep', 'Sleep & recovery'], ['supplements', 'Supplements'],
    ['habits', 'Daily habits & tasks'], ['photos', 'Progress photos'], ['goals', 'Goals & milestones'],
    ['learning', 'Fitness learning'], ['analytics', 'Analytics & reports'], ['customize', 'Customisation']
  ];
  const defaultProfile = {
    age: 24, height: 173, weight: 73, targetWeight: 85, goal: 'Lean muscle gain / Aesthetic bodybuilding',
    frequency: 5, activity: 'Moderate', calories: 2800, protein: 150, carbs: 370, fat: 80,
    fibre: 30, water: 3, sleep: 8, units: 'Metric'
  };
  const defaultHabits = [
    ['Complete daily calorie target', 'Nutrition'], ['Complete protein target', 'Nutrition'],
    ['Complete carbohydrate target', 'Nutrition'], ['Complete fibre target', 'Nutrition'],
    ['Eat fruits', 'Nutrition'], ['Eat vegetables', 'Nutrition'], ['Drink sufficient water', 'Nutrition'],
    ['Complete scheduled workout', 'Fitness'], ['Follow proper exercise technique', 'Fitness'],
    ['Record workout performance', 'Fitness'], ['Complete daily steps or activity target', 'Fitness'],
    ['Sleep 7–9 hours', 'Recovery'], ['Complete recovery activities', 'Recovery'],
    ['Take rest days when scheduled', 'Recovery'], ['Maintain personal hygiene', 'Personal'],
    ['Follow daily routine', 'Personal'], ['Complete personal development activities', 'Personal']
  ].map(([title, group]) => ({ id: id(), title, group, frequency: 'daily', interval: 1, createdDate: today(), reminder: '', doneDates: [] }));
  const foods = [
    ['Rice, white', 365, 7.1, 80, 0.7, 1.3, 'raw'], ['Rice, white (cooked)', 130, 2.7, 28.2, 0.3, 0.4, 'cooked'],
    ['Chicken breast', 120, 22.5, 0, 2.6, 0, 'raw'], ['Chicken breast (cooked)', 165, 31, 0, 3.6, 0, 'cooked'],
    ['Egg, whole', 143, 13, 0.7, 9.5, 0, 'raw'], ['Oats', 389, 16.9, 66.3, 6.9, 10.6, 'raw'],
    ['Chapati', 297, 9.8, 46, 7.5, 7.6, 'cooked'], ['Dal, lentils', 352, 24.6, 63.1, 1.1, 10.7, 'raw'],
    ['Dal, lentils (cooked)', 116, 9, 20.1, 0.4, 7.9, 'cooked'], ['Paneer', 265, 18.3, 1.2, 20.8, 0, 'raw'],
    ['Curd, plain', 61, 3.5, 4.7, 3.3, 0, 'raw'], ['Banana', 89, 1.1, 22.8, 0.3, 2.6, 'raw'],
    ['Apple', 52, 0.3, 13.8, 0.2, 2.4, 'raw'], ['Spinach', 23, 2.9, 3.6, 0.4, 2.2, 'raw'],
    ['Almonds', 579, 21.2, 21.6, 49.9, 12.5, 'raw'], ['Chia seeds', 486, 16.5, 42.1, 30.7, 34.4, 'raw']
  ].map(([name, calories, protein, carbs, fat, fibre, state]) => ({ name, calories, protein, carbs, fat, fibre, state }));
  const lessons = [
    ['Calories and energy balance', 'Calories measure food energy. Long-term intake relative to expenditure influences body-weight trends.'],
    ['BMR and TDEE', 'BMR estimates energy used at rest; TDEE estimates total daily expenditure including activity. Both are approximations.'],
    ['Protein and amino acids', 'Dietary protein supplies amino acids used to build and repair tissue. Include varied protein sources.'],
    ['Carbohydrates and glycogen', 'Carbohydrates provide glucose and support glycogen stores used during training.'],
    ['Dietary fats', 'Dietary fats provide energy and support essential body functions. Avoid eliminating them without clinical advice.'],
    ['Fibre and digestion', 'Fibre from plants supports digestion. Increase gradually and drink enough fluids.'],
    ['Sugar and insulin', 'Insulin helps regulate blood glucose. A single food does not determine health; overall dietary patterns matter.'],
    ['Vitamins and minerals', 'Micronutrients support many body processes. A varied diet is a useful foundation.'],
    ['Muscle anatomy', 'Skeletal muscles attach to bones and create movement through coordinated contraction.'],
    ['Muscle hypertrophy', 'Hypertrophy is an increase in muscle size supported by training, nutrition and recovery over time.'],
    ['Progressive overload', 'Progressively adjust training demand—such as reps, load or quality—while retaining sound technique.'],
    ['Workout programming', 'A program organises exercises, volume, intensity and recovery around a person’s goals and experience.'],
    ['Recovery and sleep', 'Sleep and rest support recovery. Persistent fatigue or pain warrants professional guidance.'],
    ['Supplements', 'Supplements vary in evidence and quality. They are optional and are not a substitute for food or medical care.'],
    ['Lean bulking', 'A gradual energy surplus and consistent resistance training can support muscle gain while limiting excess weight gain.'],
    ['Cutting and fat loss', 'A sustainable energy deficit can reduce body mass; preserve training quality and seek help if unwell.'],
    ['Body composition', 'Weight alone cannot distinguish muscle, fat and fluid. Use trends and several measures over time.']
  ];
  const lessonQuizzes = [
    ['What influences long-term weight trends?', ['Only one meal', 'Energy intake relative to expenditure over time', 'Meal timing alone'], 'B'],
    ['What does TDEE estimate?', ['Total daily energy expenditure', 'Resting heart rate', 'A food’s protein content'], 'A'],
    ['What does protein provide?', ['Amino acids', 'Glycogen only', 'Dietary fibre'], 'A'],
    ['What do muscles store as a readily used carbohydrate reserve?', ['Glycogen', 'Calcium', 'Vitamin D'], 'A'],
    ['What is a useful view of dietary fat?', ['It is an essential nutrient', 'It should always be eliminated', 'It contains no energy'], 'A'],
    ['How should fibre intake usually change?', ['Gradually, with enough fluids', 'All at once', 'Only through supplements'], 'A'],
    ['What is a sensible way to understand a food’s effect?', ['Judge the whole dietary pattern', 'Assume one food determines health', 'Ignore total intake'], 'A'],
    ['Where can micronutrients come from?', ['A varied diet', 'Only one food', 'Exercise alone'], 'A'],
    ['What do skeletal muscles do?', ['Create movement by contracting', 'Store body measurements', 'Control hydration targets'], 'A'],
    ['What is hypertrophy?', ['An increase in muscle size', 'A type of meal', 'A sleep stage'], 'A'],
    ['What is progressive overload?', ['Gradually adjusting training demand', 'Adding load regardless of form', 'Avoiding recovery'], 'A'],
    ['What does a training program organise?', ['Exercise, training demand and recovery', 'Only supplement timing', 'Only body weight'], 'A'],
    ['What supports recovery?', ['Sleep and planned rest', 'Skipping all rest', 'Ignoring persistent pain'], 'A'],
    ['What is the role of supplements?', ['Optional; not a substitute for food or care', 'Required for everyone', 'A reason to exceed label directions'], 'A'],
    ['What can a gradual surplus support?', ['Muscle gain with resistance training', 'Instant muscle gain', 'Guaranteed fat-free gain'], 'A'],
    ['What does a sustainable energy deficit generally do?', ['Can reduce body mass over time', 'Guarantees a specific rate', 'Replaces resistance training'], 'A'],
    ['What can weight alone distinguish?', ['It cannot distinguish muscle, fat and fluid', 'It identifies muscle exactly', 'It measures hydration perfectly'], 'A']
  ];
  const exerciseLibrary = [
    ['Barbell bench press', 'Chest'], ['Incline dumbbell press', 'Chest'], ['Lat pulldown', 'Back'],
    ['Barbell row', 'Back'], ['Overhead press', 'Shoulders'], ['Lateral raise', 'Shoulders'],
    ['Dumbbell curl', 'Biceps'], ['Hammer curl', 'Biceps'], ['Cable pushdown', 'Triceps'],
    ['Overhead triceps extension', 'Triceps'], ['Wrist curl', 'Forearms'], ['Reverse wrist curl', 'Forearms'],
    ['Back squat', 'Quadriceps'], ['Leg extension', 'Quadriceps'], ['Romanian deadlift', 'Hamstrings'],
    ['Leg curl', 'Hamstrings'], ['Hip thrust', 'Glutes'], ['Glute bridge', 'Glutes'],
    ['Standing calf raise', 'Calves'], ['Seated calf raise', 'Calves'], ['Plank', 'Abs'], ['Cable crunch', 'Abs']
  ];
  const defaults = {
    profile: { ...defaultProfile }, meals: [], workouts: [], measurements: [], waterEntries: [],
    sleepEntries: [], supplements: [], supplementLogs: [], habits: defaultHabits, goals: [],
    photos: [], lessonProgress: {}, categories: categories.map(([key, label]) => ({ key, label, enabled: true })),
    customMeasurementFields: [], dashboardOrder: ['nutrition', 'water', 'workouts', 'sleep', 'habits'],
    routines: [], mealTemplates: [], recipes: [], customLogs: [], deletedCategories: [], deletedEntries: [], theme: 'dark'
  };
  let data;
  let current = 'dashboard';
  const nav = document.getElementById('fitnessNav');
  const screen = document.getElementById('fitnessScreen');
  const toast = (message, kind = 'success') => {
    const container = document.getElementById('toastContainer');
    if (container && typeof window.showToast === 'function') window.showToast(message, kind);
    else {
      const item = document.createElement('div');
      item.className = `toast ${kind}`;
      item.textContent = message;
      container?.append(item);
      setTimeout(() => item.remove(), 3500);
    }
  };
  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('focusflow:fitness-updated'));
    }
    catch (error) {
      console.error('Fitness data could not be saved', error);
      toast('Could not save this entry. Check available browser storage.', 'warning');
    }
  }
  function applyTheme() {
    document.body.dataset.theme = data.theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = document.body.dataset.theme;
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      data = { ...defaults, ...saved, profile: { ...defaultProfile, ...(saved.profile || {}) } };
      for (const key of ['meals', 'workouts', 'measurements', 'waterEntries', 'sleepEntries', 'supplements',
        'supplementLogs', 'habits', 'goals', 'photos', 'routines', 'mealTemplates', 'recipes', 'customLogs',
        'customMeasurementFields', 'categories', 'deletedCategories', 'deletedEntries']) {
        if (!Array.isArray(data[key])) data[key] = defaults[key].map((item) => ({ ...item }));
      }
      if (!data.categories.some((item) => item.key === 'dashboard')) data.categories = defaults.categories;
    } catch (error) {
      console.error('Fitness data could not be loaded', error);
      data = JSON.parse(JSON.stringify(defaults));
      toast('Fitness data was unreadable; a fresh fitness profile was started.', 'warning');
    }
  }
  const byDate = (items, date = today()) => items.filter((item) => item.date === date);
  const sum = (items, key) => items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
  const percent = (value, target) => target ? Math.min(100, Math.round(value / target * 100)) : 0;
  const dayNumber = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
  };
  const isHabitDue = (habit, date) => {
    const elapsed = dayNumber(date) - dayNumber(habit.createdDate || date);
    if (elapsed < 0) return false;
    if (habit.frequency === 'weekly') return elapsed % 7 === 0;
    if (habit.frequency === 'monthly') {
      const [year, month] = date.split('-').map(Number);
      const [startYear, startMonth, startDay] = (habit.createdDate || date).split('-').map(Number);
      const targetDay = Math.min(startDay, new Date(year, month, 0).getDate());
      return dayNumber(date) >= dayNumber(habit.createdDate || date) &&
        Number(date.slice(-2)) === targetDay &&
        (year > startYear || (year === startYear && month >= startMonth));
    }
    if (habit.frequency === 'custom') return elapsed % Math.max(1, Number(habit.interval) || 1) === 0;
    return true;
  };
  const datesWithin = (days) => Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - days + 1 + index);
    return dateInput(date);
  });
  const isImperial = () => data.profile.units === 'Imperial';
  const weightUnit = () => isImperial() ? 'lb' : 'kg';
  const lengthUnit = () => isImperial() ? 'in' : 'cm';
  const showWeight = (kg) => isImperial() ? Number(kg || 0) * 2.20462 : Number(kg || 0);
  const storeWeight = (value) => isImperial() ? Number(value || 0) / 2.20462 : Number(value || 0);
  const showLength = (cm) => isImperial() ? Number(cm || 0) / 2.54 : Number(cm || 0);
  const storeLength = (value) => isImperial() ? Number(value || 0) * 2.54 : Number(value || 0);
  const progress = (title, value, target, unit = '') => `<div class="fitness-progress">
    <div><span>${esc(title)}</span><strong>${Number(value || 0).toFixed(1)} / ${esc(target)} ${esc(unit)}</strong></div>
    <div class="fitness-track"><span style="width:${percent(value, target)}%"></span></div></div>`;
  const card = (title, content, cls = '') => `<article class="fitness-card ${cls}"><h3>${title}</h3>${content}</article>`;
  const sectionHead = (eyebrow, title, action = '') => `<div class="fitness-heading"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>${action}</div>`;
  const field = (label, name, type = 'number', value = '', opts = '') => `<label><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${opts}></label>`;
  const select = (label, name, options, value = '') => `<label><span>${label}</span><select name="${name}">${options.map(([key, title]) => `<option value="${esc(key)}" ${key === value ? 'selected' : ''}>${esc(title)}</option>`).join('')}</select></label>`;
  const form = (kind, fields, submit = 'Save entry', idValue = '') => `<form class="fitness-form" data-fitness-form="${kind}" ${idValue ? `data-edit-id="${esc(idValue)}"` : ''}>
    ${fields}<div class="fitness-form-actions"><button class="primary-btn" type="submit">${submit}</button>${idValue ? '<button class="secondary-btn" type="button" data-cancel-edit>Cancel edit</button>' : ''}</div></form>`;
  function entriesList(type, items, render) {
    if (!items.length) return '<p class="fitness-empty">No entries yet. Add your first record above.</p>';
    return `<div class="fitness-entry-list">${items.slice().reverse().map((item) => `<article class="fitness-entry">
      <div>${render(item)}</div><div class="fitness-entry-actions"><button type="button" class="secondary-btn" data-edit="${type}" data-id="${esc(item.id)}">Edit</button><button type="button" class="secondary-btn danger" data-delete="${type}" data-id="${esc(item.id)}">Delete</button></div></article>`).join('')}</div>`;
  }
  function saveEntry(key, entry) {
    const index = data[key].findIndex((item) => item.id === entry.id);
    if (index >= 0) data[key][index] = { ...data[key][index], ...entry };
    else data[key].push({ id: id(), ...entry });
    persist();
    render();
  }
  function updateNav() {
    const all = data.categories.filter((item) => item.enabled);
    nav.innerHTML = all.map((item) => `<button type="button" class="fitness-nav-link ${current === item.key ? 'active' : ''}" data-fitness-view="${esc(item.key)}">${esc(item.label)}</button>`).join('');
  }
  function renderDashboard() {
    const p = data.profile;
    const view = document.getElementById('fitnessPeriod')?.value || 'day';
    const periodDays = view === 'week' ? 7 : view === 'month' ? 30 : 1;
    const start = new Date();
    start.setDate(start.getDate() - periodDays + 1);
    const from = dateInput(start);
    const inPeriod = (entry) => entry.date >= from && entry.date <= today();
    const meals = data.meals.filter(inPeriod);
    const waterEntries = data.waterEntries.filter(inPeriod);
    const workouts = data.workouts.filter(inPeriod);
    const sleeps = data.sleepEntries.filter(inPeriod);
    const activeDays = Math.max(1, new Set(meals.map((entry) => entry.date)).size);
    const dayCalories = sum(meals, 'calories') / activeDays;
    const protein = sum(meals, 'protein') / activeDays;
    const carbs = sum(meals, 'carbs') / activeDays;
    const fat = sum(meals, 'fat') / activeDays;
    const fibre = sum(meals, 'fibre') / activeDays;
    const waterDays = Math.max(1, new Set(waterEntries.map((entry) => entry.date)).size);
    const water = sum(waterEntries, 'ml') / 1000 / waterDays;
    const sleepDays = Math.max(1, new Set(sleeps.map((entry) => entry.date)).size);
    const sleepHours = sum(sleeps, 'hours') / sleepDays;
    const periodDates = datesWithin(periodDays);
    const scheduledHabitDays = data.habits.reduce((total, habit) => total + periodDates.filter((date) => isHabitDue(habit, date)).length, 0);
    const done = data.habits.reduce((total, habit) => total + (habit.doneDates || []).filter((date) => periodDates.includes(date) && isHabitDue(habit, date)).length, 0);
    const taskRate = scheduledHabitDays ? Math.round(done / scheduledHabitDays * 100) : 0;
    const latest = data.measurements.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
    const weight = latest?.weight || p.weight;
    const order = data.dashboardOrder.filter((key) => ['nutrition', 'water', 'workouts', 'sleep', 'habits'].includes(key));
    const weightChange = p.targetWeight >= p.weight ? weight - p.weight : p.weight - weight;
    const weightGoalRange = Math.abs(p.targetWeight - p.weight);
    const widgetData = {
      nutrition: card('Nutrition today', `${progress('Calories', dayCalories, p.calories, 'kcal')}${progress('Protein', protein, p.protein, 'g')}${progress('Carbohydrates', carbs, p.carbs, 'g')}${progress('Fat', fat, p.fat, 'g')}${progress('Fibre', fibre, p.fibre, 'g')}`),
      water: card(`Average water · ${periodDays === 1 ? 'today' : `last ${periodDays} days`}`, `${progress('Hydration', water, p.water, 'L')}<p>${Math.max(0, p.water - water).toFixed(1)} L remaining on an average logged day</p>`),
      workouts: card(`Training · ${periodDays === 1 ? 'today' : `last ${periodDays} days`}`, `<strong>${workouts.length ? 'Workout logged' : 'No workout logged yet'}</strong><p>${new Set(workouts.map((entry) => entry.date)).size} training day(s) · ${workouts.length} exercise record(s)</p>`),
      sleep: card(`Sleep average · ${periodDays === 1 ? 'today' : `last ${periodDays} days`}`, `<strong>${sleepHours.toFixed(1)} hrs</strong><p>Target: ${p.sleep} hours · based on logged days</p>`),
      habits: card(`Daily tasks · ${periodDays === 1 ? 'today' : `last ${periodDays} days`}`, `<strong>${taskRate}% complete</strong><p>${done} completed out of ${scheduledHabitDays} scheduled task-days</p><div class="fitness-track"><span style="width:${taskRate}%"></span></div>`)
    };
    const views = { day: 'Today', week: 'This week', month: 'This month' };
    const workoutDays = new Set(workouts.map((entry) => entry.date)).size;
    screen.innerHTML = `${sectionHead('Your overview', 'Fitness dashboard', `<label class="fitness-period">View <select id="fitnessPeriod">${Object.entries(views).map(([v, name]) => `<option value="${v}" ${v === view ? 'selected' : ''}>${name}</option>`).join('')}</select></label>`)}
      <p class="fitness-date">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())}</p>
      <section class="fitness-stats">
        <article class="fitness-stat"><span>Current weight</span><strong>${showWeight(weight).toFixed(1)} ${weightUnit()}</strong><small>Target ${showWeight(p.targetWeight).toFixed(1)} ${weightUnit()}</small></article>
        <article class="fitness-stat"><span>Weight progress</span><strong>${Math.max(0, percent(weightChange, weightGoalRange))}%</strong><small>${showWeight(p.targetWeight - weight).toFixed(1)} ${weightUnit()} to target</small></article>
        <article class="fitness-stat"><span>Workout consistency</span><strong>${workoutDays} day${workoutDays === 1 ? '' : 's'}</strong><small>${views[view].toLowerCase()}</small></article>
        <article class="fitness-stat"><span>Daily tasks</span><strong>${taskRate}%</strong><small>${done}/${scheduledHabitDays} complete</small></article>
      </section>
      <section class="fitness-widget-grid">${order.map((key) => widgetData[key]).join('')}</section>
      <p class="fitness-disclaimer">Targets are starting estimates, not medical advice. Use multi-week trends and adjust to your actual progress.</p>
      <div class="fitness-actions"><button class="secondary-btn" type="button" data-open-view="nutrition">Log food</button><button class="secondary-btn" type="button" data-open-view="workouts">Log workout</button><button class="secondary-btn" type="button" data-open-view="habits">Open daily tasks</button></div>`;
  }
  function renderProfile() {
    const p = data.profile;
    const suggested = estimateTargets(p);
    const goals = ['Muscle gain', 'Lean bulking', 'Fat loss', 'Body recomposition', 'Strength building', 'General fitness', 'Lean muscle gain / Aesthetic bodybuilding'];
    screen.innerHTML = `${sectionHead('Personal fitness profile', 'Your profile & targets')}
      ${form('profile', `<div class="fitness-form-grid">
        ${field('Age (years)', 'age', 'number', p.age, 'min="13" max="120" required')}
        ${field(`Height (${lengthUnit()})`, 'height', 'number', showLength(p.height).toFixed(1), 'min="40" max="250" step="0.1" required')}
        ${field(`Current weight (${weightUnit()})`, 'weight', 'number', showWeight(p.weight).toFixed(1), 'min="25" max="900" step="0.1" required')}
        ${field(`Target weight (${weightUnit()})`, 'targetWeight', 'number', showWeight(p.targetWeight).toFixed(1), 'min="25" max="900" step="0.1" required')}
        ${select('Fitness goal', 'goal', goals.map((value) => [value, value]), p.goal)}
        ${field('Workout days per week', 'frequency', 'number', p.frequency, 'min="0" max="14" required')}
        ${select('Activity level', 'activity', [['Sedentary', 'Sedentary'], ['Light', 'Light'], ['Moderate', 'Moderate'], ['High', 'High'], ['Very high', 'Very high']], p.activity)}
        ${select('Measurement units', 'units', [['Metric', 'Metric (kg, cm)'], ['Imperial', 'Imperial (lb, in)']], p.units)}
          ${field('Daily calorie target (kcal)', 'calories', 'number', p.calories, 'min="500" max="10000" required')}
        ${field('Protein target (g)', 'protein', 'number', p.protein, 'min="0" max="1000" required')}
        ${field('Carbohydrate target (g)', 'carbs', 'number', p.carbs, 'min="0" max="1500" required')}
        ${field('Fat target (g)', 'fat', 'number', p.fat, 'min="0" max="500" required')}
        ${field('Fibre target (g)', 'fibre', 'number', p.fibre, 'min="0" max="200" required')}
        ${field('Water target (litres)', 'water', 'number', p.water, 'min="0.1" max="20" step="0.1" required')}
        ${field('Sleep target (hours)', 'sleep', 'number', p.sleep, 'min="1" max="24" step="0.5" required')}
      </div><p class="fitness-disclaimer">Calorie and macro targets are estimates. Profile changes recalculate suggested targets; you can edit any target afterward. Adjust based on actual progress and consult a qualified professional for individual advice.</p>`, 'Save profile')}
      <p class="fitness-note">Current profile estimate: about ${suggested.calories} kcal · ${suggested.protein} g protein · ${suggested.carbs} g carbohydrates · ${suggested.fat} g fat per day. Saving changes to age, height, weight, goal or activity updates suggested targets automatically.</p>`;
  }
  function renderNutrition() {
    const dayMeals = byDate(data.meals);
    const mealTypes = ['Early morning', 'Breakfast', 'Mid-morning snack', 'Lunch', 'Evening snack', 'Pre-workout', 'Post-workout', 'Dinner'];
    const options = [...foods.map((food) => food.name), ...data.recipes.map((recipe) => recipe.name)].map((name) => `<option value="${esc(name)}">`).join('');
    screen.innerHTML = `${sectionHead('Food & meals', 'Diet & nutrition')}
      <section class="fitness-stats">
        ${[['Calories', 'calories', data.profile.calories, 'kcal'], ['Protein', 'protein', data.profile.protein, 'g'], ['Carbohydrates', 'carbs', data.profile.carbs, 'g'], ['Fat', 'fat', data.profile.fat, 'g'], ['Fibre', 'fibre', data.profile.fibre, 'g']].map(([label, key, target, unit]) => card(label, progress(label, sum(dayMeals, key), target, unit))).join('')}
      </section>
      ${card('Add food', form('meal', `<div class="fitness-form-grid">
        ${select('Meal', 'mealType', mealTypes.map((value) => [value, value]), 'Breakfast')}
        <label><span>Food item</span><input name="name" list="foodDatabase" maxlength="80" required placeholder="Search common Indian foods" /><datalist id="foodDatabase">${options}</datalist></label>
        ${field('Quantity', 'amount', 'number', 100, 'min="0.1" max="5000" step="0.1" required')}
        ${select('Quantity unit', 'unit', [['g', 'Grams'], ['serving', 'Servings']], 'g')}
        ${select('Food state', 'foodState', [['raw', 'Raw'], ['cooked', 'Cooked'], ['prepared', 'Prepared / custom']], 'raw')}
        ${field('Calories (kcal)', 'calories', 'number', '', 'min="0" max="10000" step="0.1" required')}
        ${field('Protein (g)', 'protein', 'number', '', 'min="0" max="1000" step="0.1" required')}
        ${field('Carbohydrates (g)', 'carbs', 'number', '', 'min="0" max="1500" step="0.1" required')}
        ${field('Fat (g)', 'fat', 'number', '', 'min="0" max="500" step="0.1" required')}
        ${field('Fibre (g)', 'fibre', 'number', '', 'min="0" max="200" step="0.1" required')}
        ${field('Date', 'date', 'date', today(), 'required')}
      </div>      <p class="fitness-hint">Database values are approximate per 100 g; raw and cooked items are shown separately. One database serving is treated as 100 g. Confirm labels and preparation method, and adjust values for custom foods.</p>`, 'Add food'))}
      ${card('Today’s meals', entriesList('meals', dayMeals, (entry) => `<strong>${esc(entry.name)}</strong><span>${esc(entry.mealType)} · ${entry.amount} ${esc(entry.unit)} · ${entry.calories} kcal</span><small>P ${entry.protein} g · C ${entry.carbs} g · F ${entry.fat} g · Fibre ${entry.fibre} g · ${esc(entry.foodState)}</small><button type="button" class="fitness-inline-btn" data-duplicate-meal="${esc(entry.id)}">Duplicate</button><button type="button" class="fitness-inline-btn" data-template-meal="${esc(entry.id)}">Save meal template</button>`))}
      ${data.mealTemplates.length ? card('Saved meals', data.mealTemplates.map((entry) => `<button type="button" class="fitness-inline-btn" data-use-template="${esc(entry.id)}">${esc(entry.name)} · ${entry.calories} kcal</button>`).join(' ')) : ''}
      ${card('Create a custom recipe', form('recipe', `<div class="fitness-form-grid">${field('Recipe name', 'name', 'text', '', 'maxlength="80" required')}${field('Serving size (g)', 'serving', 'number', 100, 'min="1" max="5000" required')}${field('Calories per serving', 'calories', 'number', 0, 'min="0" required')}${field('Protein per serving (g)', 'protein', 'number', 0, 'min="0" required')}${field('Carbohydrates per serving (g)', 'carbs', 'number', 0, 'min="0" required')}${field('Fat per serving (g)', 'fat', 'number', 0, 'min="0" required')}${field('Fibre per serving (g)', 'fibre', 'number', 0, 'min="0" required')}</div><p class="fitness-hint">Enter nutrition totals for one prepared serving; amounts are stored per recipe serving.</p>`, 'Save recipe'))}
      ${data.recipes.length ? card('My recipes', data.recipes.map((recipe) => `<div class="fitness-record"><strong>${esc(recipe.name)} · ${recipe.calories} kcal/serving</strong><span>${recipe.serving} g</span><button type="button" class="fitness-inline-btn" data-log-recipe="${esc(recipe.id)}">Log serving</button><button type="button" class="fitness-inline-btn" data-edit="recipes" data-id="${esc(recipe.id)}">Edit</button><button type="button" class="fitness-inline-btn danger-text" data-delete="recipes" data-id="${esc(recipe.id)}">Delete</button></div>`).join('')) : ''}`;
  }
  function renderWorkouts() {
    const muscles = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Abs'];
    const day = byDate(data.workouts);
    const routines = data.routines.length ? `<div class="fitness-template-row">${data.routines.map((routine) => `<span>${esc(routine.name)} <button type="button" data-start-routine="${esc(routine.id)}">Start</button><button type="button" data-edit="routines" data-id="${esc(routine.id)}">Edit</button><button type="button" data-delete="routines" data-id="${esc(routine.id)}" aria-label="Delete routine">×</button></span>`).join('')}</div>` : '';
    screen.innerHTML = `${sectionHead('Training log', 'Workout & exercise')}
      ${card('Add exercise', form('workout', `<div class="fitness-form-grid">
        ${field('Exercise name', 'name', 'text', '', 'maxlength="80" required')}
        ${select('Muscle group', 'muscle', muscles.map((value) => [value, value]))}
        ${field(`Weight lifted (${weightUnit()})`, 'weight', 'number', 0, 'min="0" max="2000" step="0.5" required')}
        ${field('Sets', 'sets', 'number', 3, 'min="1" max="100" required')}
        ${field('Repetitions per set', 'reps', 'number', 8, 'min="1" max="500" required')}
        ${field('Rest (seconds)', 'rest', 'number', 90, 'min="0" max="3600" required')}
        ${field('Workout duration (minutes)', 'duration', 'number', 60, 'min="1" max="1440" required')}
        ${field('Date', 'date', 'date', today(), 'required')}
        <label class="fitness-span"><span>Exercise notes</span><textarea name="notes" rows="2" maxlength="500"></textarea></label>
      </div>`, 'Save exercise'))}
      ${card('Exercise library', `<div class="exercise-library">${exerciseLibrary.map(([name, muscle]) => `<button type="button" class="fitness-inline-btn" data-library-exercise="${esc(name)}" data-library-muscle="${esc(muscle)}">${esc(name)} <small>${esc(muscle)}</small></button>`).join('')}</div>`)}
      ${card('Workout history · today', entriesList('workouts', day, (entry) => `<strong>${esc(entry.name)}</strong><span>${esc(entry.muscle)} · ${showWeight(entry.weight).toFixed(1)} ${weightUnit()} · ${entry.sets} × ${entry.reps} · rest ${entry.rest}s · ${entry.duration} min</span><small>${esc(entry.notes || '')}</small>`))}
      ${card('Progressive overload & records', `<p>Compare your best logged load for each exercise. Records use your saved logs.</p><strong>7-day training volume: ${showWeight(data.workouts.filter((entry) => entry.date >= dateInput(new Date(Date.now() - 6 * 86400000))).reduce((volume, entry) => volume + entry.weight * entry.sets * entry.reps, 0)).toFixed(0)} ${weightUnit()}·reps</strong>${renderPersonalRecords()}`)}
      ${card('Muscle group frequency · 7 days', renderMuscleFrequency())}
      ${card('Workout calendar', renderTrainingCalendar())}
      ${card('Save a routine template', form('routine', `<div class="fitness-form-grid">${field('Routine name', 'name', 'text', '', 'maxlength="80" required')}${select('Main muscle group', 'group', muscles.map((value) => [value, value]))}${field('Exercises (comma separated)', 'exercises', 'text', '', 'maxlength="500" placeholder="Bench press, incline press" required')}</div>`, 'Save routine'))}${routines}`;
  }
  function renderPersonalRecords() {
    const best = new Map();
    data.workouts.forEach((entry) => {
      if (!best.has(entry.name) || best.get(entry.name).weight < entry.weight) best.set(entry.name, entry);
    });
    return best.size ? [...best.values()].map((entry) => `<div class="fitness-record"><strong>${esc(entry.name)}</strong><span>${showWeight(entry.weight).toFixed(1)} ${weightUnit()} · ${entry.sets} × ${entry.reps}</span></div>`).join('') : '<p class="fitness-empty">Log exercises to build your personal-record list.</p>';
  }
  function renderMuscleFrequency() {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const recent = data.workouts.filter((entry) => entry.date >= dateInput(start) && entry.date <= today());
    const counts = new Map();
    recent.forEach((entry) => {
      if (!counts.has(entry.muscle)) counts.set(entry.muscle, new Set());
      counts.get(entry.muscle).add(entry.date);
    });
    return counts.size ? [...counts.entries()].map(([muscle, dates]) => `<div class="fitness-record"><strong>${esc(muscle)}</strong><span>${dates.size} training day(s)</span></div>`).join('') : '<p class="fitness-empty">Log workouts to track muscle-group frequency.</p>';
  }
  function renderTrainingCalendar() {
    const days = new Map();
    data.workouts.forEach((entry) => days.set(entry.date, (days.get(entry.date) || 0) + 1));
    return `<div class="fitness-calendar">${Array.from({ length: 28 }, (_, index) => {
      const date = new Date(); date.setDate(date.getDate() - 27 + index);
      const key = dateInput(date);
      return `<span title="${key}: ${days.get(key) || 0} exercises" class="${days.has(key) ? 'trained' : ''}">${date.getDate()}</span>`;
    }).join('')}</div>`;
  }
  function renderMeasurements() {
    const fields = ['weight', 'chest', 'waist', 'shoulders', 'leftArm', 'rightArm', 'leftForearm', 'rightForearm', 'leftThigh', 'rightThigh', 'calves', 'neck'];
    const names = [`Body weight (${weightUnit()})`, `Chest (${lengthUnit()})`, `Waist (${lengthUnit()})`, `Shoulders (${lengthUnit()})`, `Left arm (${lengthUnit()})`, `Right arm (${lengthUnit()})`, `Left forearm (${lengthUnit()})`, `Right forearm (${lengthUnit()})`, `Left thigh (${lengthUnit()})`, `Right thigh (${lengthUnit()})`, `Calves (${lengthUnit()})`, `Neck (${lengthUnit()})`];
    const latest = data.measurements.slice().sort((a, b) => b.date.localeCompare(a.date))[0] || {};
    const values = { ...latest, weight: latest.weight ? showWeight(latest.weight).toFixed(1) : '' };
    ['chest', 'waist', 'shoulders', 'leftArm', 'rightArm', 'leftForearm', 'rightForearm', 'leftThigh', 'rightThigh', 'calves', 'neck'].forEach((key) => { values[key] = latest[key] ? showLength(latest[key]).toFixed(1) : ''; });
    screen.innerHTML = `${sectionHead('Body composition', 'Body measurements')}
      ${card('Record measurements', form('measurement', `<div class="fitness-form-grid">${field('Date', 'date', 'date', today(), 'required')}${fields.map((key, index) => field(names[index], key, 'number', values[key] || '', 'min="0" max="500" step="0.1"')).join('')}${data.customMeasurementFields.map((key) => field(`${esc(key)} (${lengthUnit()})`, `custom_${esc(key)}`, 'number', '', 'min="0" step="0.1"')).join('')}</div>`, 'Save measurements'))}
      ${card('Weekly & monthly trends', renderMeasurementTrend())}
      ${card('Measurement history', entriesList('measurements', data.measurements, (entry) => `<strong>${esc(entry.date)}</strong><span>Weight ${entry.weight ? `${showWeight(entry.weight).toFixed(1)} ${weightUnit()}` : '—'} · Chest ${entry.chest ? `${showLength(entry.chest).toFixed(1)} ${lengthUnit()}` : '—'} · Waist ${entry.waist ? `${showLength(entry.waist).toFixed(1)} ${lengthUnit()}` : '—'} · Arms ${entry.leftArm ? showLength(entry.leftArm).toFixed(1) : '—'} / ${entry.rightArm ? showLength(entry.rightArm).toFixed(1) : '—'} ${lengthUnit()}</span><small>${Object.entries(entry.custom || {}).map(([key, value]) => `${esc(key)}: ${showLength(value).toFixed(1)} ${lengthUnit()}`).join(' · ')}</small>`))}
      ${card('Custom measurement fields', `<form class="fitness-form compact-form" data-fitness-form="measurement-field">${field('New field name', 'name', 'text', '', 'maxlength="40" required')}<button class="secondary-btn" type="submit">Add custom field</button></form><p>${data.customMeasurementFields.map((key) => `${esc(key)} <button type="button" data-remove-measurement-field="${esc(key)}">Remove</button>`).join(' · ') || 'No custom fields yet.'}</p>`)}`;
  }
  function renderMeasurementTrend() {
    const sorted = data.measurements.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(-8);
    const compare = (days) => {
      const start = new Date();
      start.setDate(start.getDate() - days + 1);
      const cutoff = dateInput(start);
      const current = data.measurements.filter((entry) => entry.date >= cutoff).sort((a, b) => a.date.localeCompare(b.date));
      const previous = data.measurements.filter((entry) => entry.date < cutoff).sort((a, b) => b.date.localeCompare(a.date))[0];
      if (!current.length || !previous) return `<p class="fitness-empty">Add records across ${days} days to compare.</p>`;
      return `<div class="fitness-trend">${['weight', 'chest', 'waist', 'leftArm', 'rightArm'].map((key) => {
        const latest = [...current].reverse().find((entry) => Number.isFinite(Number(entry[key])));
        if (!latest || !Number.isFinite(Number(previous[key]))) return '';
        const change = Number(latest[key]) - Number(previous[key]);
        const displayedChange = key === 'weight' ? showWeight(change) : showLength(change);
        const unit = key === 'weight' ? weightUnit() : lengthUnit();
        return `<div><span>${esc(key)}</span><strong>${displayedChange > 0 ? '+' : ''}${displayedChange.toFixed(1)} ${unit}</strong><small class="${displayedChange > 0 ? 'trend-up' : displayedChange < 0 ? 'trend-down' : ''}">vs prior log</small></div>`;
      }).join('')}</div>`;
    };
    const chart = buildTrendChart(sorted.map((entry) => ({ ...entry, weight: showWeight(entry.weight) })), 'weight', weightUnit());
    return `<h4>Weekly comparison</h4>${compare(7)}<h4>Monthly comparison</h4>${compare(30)}${chart}<p class="fitness-hint">Changes compare logged values only. Short-term weight changes can reflect water, food and normal daily variation; they do not prove muscle or fat gain.</p>`;
  }
  function buildTrendChart(entries, key, unit) {
    const values = entries.map((entry) => Number(entry[key])).filter(Number.isFinite);
    if (values.length < 2) return '<p class="fitness-empty">Add at least two measurements to see a trend chart.</p>';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = values.map((value, index) => `${values.length === 1 ? 50 : 8 + index * 84 / (values.length - 1)},${92 - (value - min) / range * 78}`).join(' ');
    return `<div class="fitness-chart" role="img" aria-label="${esc(key)} trend from ${min} to ${max} ${unit}"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${points}"></polyline></svg><div><span>${min} ${unit}</span><span>${max} ${unit}</span></div></div>`;
  }
  function renderWeight() {
    const values = data.measurements.filter((entry) => Number(entry.weight)).sort((a, b) => a.date.localeCompare(b.date));
    const latest = values.length ? Number(values[values.length - 1].weight) : Number(data.profile.weight);
    const average = (days) => {
      const start = new Date(); start.setDate(start.getDate() - days + 1);
      const recent = values.filter((entry) => entry.date >= dateInput(start));
      return recent.length ? showWeight(sum(recent, 'weight') / recent.length).toFixed(1) : '—';
    };
    screen.innerHTML = `${sectionHead('Long-term trend', 'Weight progress')}
      <section class="fitness-stats"><article class="fitness-stat"><span>Latest weight</span><strong>${showWeight(latest).toFixed(1)} ${weightUnit()}</strong></article><article class="fitness-stat"><span>7-day average</span><strong>${average(7)} ${weightUnit()}</strong></article><article class="fitness-stat"><span>30-day average</span><strong>${average(30)} ${weightUnit()}</strong></article><article class="fitness-stat"><span>To target</span><strong>${showWeight(data.profile.targetWeight - latest).toFixed(1)} ${weightUnit()}</strong></article></section>
      ${card('Daily weigh-in', form('weight', `<div class="fitness-form-grid">${field('Date', 'date', 'date', today(), 'required')}${field(`Weight (${weightUnit()})`, 'weight', 'number', showWeight(latest).toFixed(1), 'min="25" max="900" step="0.1" required')}</div><p class="fitness-hint">A daily reading is only one data point. Weekly averages help reduce the effect of normal fluctuations.</p>`, 'Save weight'))}
      ${card('Weight trend', renderMeasurementTrend())}
      ${card('Weight history', entriesList('measurements', data.measurements.filter((entry) => Number(entry.weight)), (entry) => `<strong>${esc(entry.date)}</strong><span>${showWeight(entry.weight).toFixed(1)} ${weightUnit()}</span>`))}`;
  }
  function renderWater() {
    const entries = byDate(data.waterEntries);
    const total = sum(entries, 'ml');
    screen.innerHTML = `${sectionHead('Hydration', 'Water intake')}
      ${card('Today’s water', `<div class="water-total"><strong>${(total / 1000).toFixed(2)}</strong><span>of ${data.profile.water} L</span></div>${progress('Daily target', total / 1000, data.profile.water, 'L')}<p>${Math.max(0, data.profile.water * 1000 - total).toFixed(0)} ml remaining</p><div class="fitness-actions"><button type="button" class="primary-btn" data-add-water="250">+250 ml</button><button type="button" class="secondary-btn" data-add-water="500">+500 ml</button></div>
        <form class="fitness-form compact-form" data-fitness-form="water">${field('Custom amount (ml)', 'ml', 'number', 250, 'min="1" max="10000" required')}<button class="secondary-btn" type="submit">Add water</button></form>
        <form class="fitness-form compact-form" data-fitness-form="water-target">${field('Daily target (litres)', 'water', 'number', data.profile.water, 'min="0.1" max="20" step="0.1" required')}<button class="secondary-btn" type="submit">Update target</button></form>`)}
      ${card('Today’s entries', entriesList('waterEntries', entries, (entry) => `<strong>${entry.ml} ml</strong><span>${esc(entry.time)}</span>`))}`;
  }
  function renderSleep() {
    const entries = byDate(data.sleepEntries);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    const recent = data.sleepEntries.filter((entry) => entry.date >= dateInput(weekStart)).sort((a, b) => b.date.localeCompare(a.date));
    const avg = recent.length ? (sum(recent, 'hours') / recent.length).toFixed(1) : '—';
    screen.innerHTML = `${sectionHead('Recovery', 'Sleep & recovery')}
      <section class="fitness-stats"><article class="fitness-stat"><span>Sleep today</span><strong>${sum(entries, 'hours').toFixed(1)} hrs</strong></article><article class="fitness-stat"><span>7-entry average</span><strong>${avg} hrs</strong></article><article class="fitness-stat"><span>Sleep target</span><strong>${data.profile.sleep} hrs</strong></article></section>
      ${card('Log sleep & recovery', form('sleep', `<div class="fitness-form-grid">${field('Date (wake-up day)', 'date', 'date', today(), 'required')}${field('Bedtime', 'bedtime', 'time', '', 'required')}${field('Wake-up time', 'wake', 'time', '', 'required')}${select('Sleep quality', 'quality', [['1', '1 · Poor'], ['2', '2 · Fair'], ['3', '3 · Good'], ['4', '4 · Very good'], ['5', '5 · Excellent']], '3')}${select('Day type', 'dayType', [['training', 'Training day'], ['rest', 'Rest day']], 'training')}${field('Muscle soreness (1–10)', 'soreness', 'number', 1, 'min="1" max="10" required')}<label class="fitness-span"><span>Recovery notes</span><textarea name="notes" rows="2" maxlength="500"></textarea></label></div>`, 'Save recovery log'))}
      ${card('This week’s sleep', `<div class="fitness-trend">${recent.map((entry) => `<div><span>${esc(entry.date.slice(5))}</span><strong>${entry.hours} h</strong><small>Quality ${entry.quality}/5</small></div>`).join('') || '<p class="fitness-empty">No sleep logs yet.</p>'}</div>`)}
      ${card('Sleep history', entriesList('sleepEntries', data.sleepEntries, (entry) => `<strong>${esc(entry.date)} · ${entry.hours} hrs</strong><span>${esc(entry.bedtime)} → ${esc(entry.wake)} · Quality ${entry.quality}/5 · soreness ${entry.soreness}/10 · ${esc(entry.dayType)} day</span><small>${esc(entry.notes || '')}</small>`))}`;
  }
  function renderSupplements() {
    const list = ['Whey protein', 'Creatine monohydrate', 'Fish oil', 'Multivitamins', 'Vitamin D', 'Calcium', 'Magnesium'];
    const logs = byDate(data.supplementLogs);
    screen.innerHTML = `${sectionHead('Personal schedule', 'Supplements')}
      <p class="fitness-disclaimer">This is a user-managed log only; it does not prescribe or recommend supplements or doses. Follow product labeling and consult a qualified professional when appropriate.</p>
      ${card('Add to your supplement list', form('supplement', `<div class="fitness-form-grid">
        <label><span>Supplement</span><input name="name" list="supplementNames" maxlength="80" required /><datalist id="supplementNames">${list.map((name) => `<option value="${name}">`).join('')}</datalist></label>
        ${field('Daily dosage (as personally configured)', 'dosage', 'text', '', 'maxlength="80" placeholder="e.g. label dose" required')}
        ${field('Preferred timing', 'timing', 'text', '', 'maxlength="80" placeholder="e.g. with breakfast"')}
        ${field('Brand', 'brand', 'text', '', 'maxlength="80"')}
        ${field('Reminder time', 'reminder', 'time')}
        <label class="fitness-span"><span>Notes</span><textarea name="notes" rows="2" maxlength="500"></textarea></label>
      </div>`, 'Save supplement'))}
      ${card('My schedule', entriesList('supplements', data.supplements, (entry) => `<strong>${esc(entry.name)} · ${esc(entry.dosage)}</strong><span>${esc(entry.timing || 'No timing set')} · ${esc(entry.brand || 'Brand not set')}${entry.reminder ? ` · reminder ${esc(entry.reminder)}` : ''}</span><small>${esc(entry.notes || '')}<button type="button" class="fitness-inline-btn" data-log-supplement="${esc(entry.id)}">Log today</button></small>`))}
      ${card('Today’s consumption', entriesList('supplementLogs', logs, (entry) => `<strong>${esc(entry.name)}</strong><span>${esc(entry.time)}</span>`))}`;
  }
  function renderHabits() {
    const tasks = data.habits;
    const dueToday = tasks.filter((entry) => isHabitDue(entry, today()));
    const complete = dueToday.filter((entry) => (entry.doneDates || []).includes(today())).length;
    const sections = ['Nutrition', 'Fitness', 'Recovery', 'Personal'];
    screen.innerHTML = `${sectionHead('Consistency', 'Daily habits & tasks')}
      ${card('Today’s completion', `<strong>${dueToday.length ? Math.round(complete / dueToday.length * 100) : 0}%</strong><p>${complete} of ${dueToday.length} tasks scheduled today completed</p><div class="fitness-track"><span style="width:${dueToday.length ? complete / dueToday.length * 100 : 0}%"></span></div>`)}
      ${card('Add your own task', form('habit', `<div class="fitness-form-grid">${field('Task', 'title', 'text', '', 'maxlength="100" required')}${select('Category', 'group', sections.map((value) => [value, value]))}${select('Frequency', 'frequency', [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['custom', 'Custom interval']])}${field('Repeat every (days, for custom)', 'interval', 'number', 1, 'min="1" max="365" required')}${field('Reminder time (optional)', 'reminder', 'time')}</div><p class="fitness-hint">Weekly and monthly tasks repeat from their creation date; custom tasks repeat at the selected day interval.</p>`, 'Add task'))}
      ${sections.map((group) => card(group, `<div class="habit-list">${tasks.filter((task) => task.group === group).map((task) => `<div class="habit-item"><input id="habit-${esc(task.id)}" type="checkbox" data-toggle-habit="${esc(task.id)}" ${isHabitDue(task, today()) ? '' : 'disabled'} ${(task.doneDates || []).includes(today()) ? 'checked' : ''}><label for="habit-${esc(task.id)}"><span>${esc(task.title)}<small>${isHabitDue(task, today()) ? 'Due today' : 'Not due today'} · ${esc(task.frequency)}${task.frequency === 'custom' ? ` · every ${task.interval || 1} days` : ''}${task.reminder ? ` · ${esc(task.reminder)}` : ''}</small></span></label><button type="button" class="fitness-inline-btn" data-edit="habits" data-id="${esc(task.id)}">Edit</button><button type="button" class="fitness-inline-btn danger-text" data-delete="habits" data-id="${esc(task.id)}">Delete</button></div>`).join('') || '<p class="fitness-empty">No tasks in this group.</p>'}</div>`)).join('')}
      ${card('History', `<p>Completed today: ${complete}/${tasks.length}. Each task keeps its completion dates for history.</p><div class="fitness-history">${tasks.map((task) => `<p><strong>${esc(task.title)}</strong> · ${(task.doneDates || []).length} completed day(s)</p>`).join('')}</div>`)}`;
  }
  function renderPhotos() {
    screen.innerHTML = `${sectionHead('Private progress journal', 'Progress photos')}
      <p class="fitness-disclaimer">Photos are stored only in this browser on this device and included in fitness backups. Do not use shared devices. Large images are rejected to protect browser storage.</p>
      ${card('Add a photo', `<form class="fitness-form" data-fitness-form="photo"><div class="fitness-form-grid">${field('Date', 'date', 'date', today(), 'required')}${select('View', 'view', [['Front', 'Front'], ['Side', 'Side'], ['Back', 'Back']])}<label><span>Image (max 500 KB)</span><input name="image" type="file" accept="image/*" required></label></div><button class="primary-btn" type="submit">Save private photo</button></form>`)}
      ${card('Comparisons', `<div class="photo-grid">${['Front', 'Side', 'Back'].map((view) => `<section><h4>${view}</h4><div class="photo-pair">${data.photos.filter((photo) => photo.view === view).sort((a, b) => a.date.localeCompare(b.date)).slice(-2).map((photo) => `<figure><img src="${esc(photo.image)}" alt="${view} progress photo dated ${esc(photo.date)}"><figcaption>${esc(photo.date)} <button type="button" data-delete="photos" data-id="${esc(photo.id)}" aria-label="Delete photo">×</button></figcaption></figure>`).join('') || '<p class="fitness-empty">No photos</p>'}</div></section>`).join('')}</div>`)}
      ${card('Photo history', entriesList('photos', data.photos, (photo) => `<strong>${esc(photo.date)} · ${esc(photo.view)}</strong><span>Private on this device</span>`))}`;
  }
  function renderGoals() {
    const goals = data.goals;
    screen.innerHTML = `${sectionHead('Stay focused', 'Goals & milestones')}
      ${card('Create a goal', form('goal', `<div class="fitness-form-grid">${field('Goal', 'title', 'text', '', 'maxlength="120" required')}${select('Type', 'type', [['weight', 'Weight (kg)'], ['strength', 'Strength'], ['measurement', 'Measurement (cm)'], ['workouts', 'Workout sessions'], ['nutrition', 'Nutrition consistency'], ['custom', 'Custom']])}${field('Target value (if measurable)', 'target', 'number', '', 'min="0" step="0.1"')}${field('Current progress', 'current', 'number', 0, 'min="0" step="0.1"')}${field('Target completion date', 'date', 'date')}</div>`, 'Save goal'))}
      ${goals.length ? goals.map((goal) => card(esc(goal.title), `<div class="fitness-track"><span style="width:${percent(goal.current, goal.target)}%"></span></div><p>${goal.current || 0}${goal.target ? ` / ${goal.target}` : ''}${goal.date ? ` · target date ${esc(goal.date)}` : ''} · ${goal.target ? percent(goal.current, goal.target) : 0}%${goal.completedAt ? ` · completed ${esc(goal.completedAt)}` : ''}</p><form class="fitness-form compact-form" data-fitness-form="goal-progress" data-edit-id="${esc(goal.id)}">${field('Update progress', 'current', 'number', goal.current || 0, 'min="0" step="0.1" required')}<button class="secondary-btn" type="submit">Update</button></form><button type="button" class="secondary-btn" data-edit="goals" data-id="${esc(goal.id)}">Edit goal</button><button type="button" class="secondary-btn danger" data-delete="goals" data-id="${esc(goal.id)}">Delete goal</button>`)).join('') : '<p class="fitness-empty">Add your first milestone above.</p>'}`;
  }
  function renderLearning() {
    const completed = lessons.filter((_, index) => data.lessonProgress[index]?.completed).length;
    screen.innerHTML = `${sectionHead('Learn at your pace', 'Fitness learning centre')}
      ${card('Learning progress', `<strong>${completed} / ${lessons.length} lessons</strong><div class="fitness-track"><span style="width:${Math.round(completed / lessons.length * 100)}%"></span></div>`)}
      <div class="lesson-list">${lessons.map(([title, description], index) => {
        const progressState = data.lessonProgress[index] || {};
        return card(`<span>${index + 1}. ${esc(title)}</span>`, `<p>${esc(description)}</p><label class="habit-item"><input type="checkbox" data-lesson-complete="${index}" ${progressState.completed ? 'checked' : ''}><span>Mark completed</span></label><button type="button" class="fitness-inline-btn" data-favorite-lesson="${index}">${progressState.favorite ? '★ Saved' : '☆ Save favourite'}</button><form class="fitness-form compact-form" data-fitness-form="lesson-note" data-lesson="${index}"><label><span>Your notes</span><textarea name="notes" rows="2" maxlength="1000">${esc(progressState.notes || '')}</textarea></label><button type="submit" class="secondary-btn">Save notes</button></form><button type="button" class="secondary-btn" data-quiz="${index}">Quick quiz</button>`, 'lesson-card');
      }).join('')}</div>`;
  }
  function renderAnalytics() {
    const selectedPeriod = document.getElementById('fitnessAnalyticsPeriod')?.value || 'month';
    const period = selectedPeriod === 'day' ? 1 : selectedPeriod === 'week' ? 7 : 30;
    const start = new Date(); start.setDate(start.getDate() - period + 1);
    const from = dateInput(start);
    const meals = data.meals.filter((entry) => entry.date >= from && entry.date <= today());
    const workouts = data.workouts.filter((entry) => entry.date >= from && entry.date <= today());
    const waterEntries = data.waterEntries.filter((entry) => entry.date >= from && entry.date <= today());
    const waterDays = new Set(waterEntries.map((entry) => entry.date)).size;
    const sleep = data.sleepEntries.filter((entry) => entry.date >= from && entry.date <= today());
    const weights = data.measurements.filter((entry) => entry.date >= from && entry.date <= today() && Number(entry.weight)).sort((a, b) => a.date.localeCompare(b.date));
    const reportDates = datesWithin(period);
    const scheduledHabits = data.habits.reduce((total, habit) => total + reportDates.filter((date) => isHabitDue(habit, date)).length, 0);
    const habitDone = data.habits.reduce((total, habit) => total + (habit.doneDates || []).filter((date) => date >= from && date <= today() && isHabitDue(habit, date)).length, 0);
    const habitRate = scheduledHabits ? Math.round(habitDone / scheduledHabits * 100) : 0;
    const avg = (arr, key) => arr.length ? (sum(arr, key) / arr.length).toFixed(1) : '—';
    const dailyNutrition = groupByDate(meals);
    const consistentNutritionDays = dailyNutrition.filter((entry) => entry.calories >= data.profile.calories * 0.9 && entry.protein >= data.profile.protein * 0.9).length;
    const nutritionConsistency = dailyNutrition.length ? Math.round(consistentNutritionDays / dailyNutrition.length * 100) : 0;
    const workoutDays = new Set(workouts.map((entry) => entry.date)).size;
    const scheduledWorkoutDays = Math.max(1, Math.round(data.profile.frequency * period / 7));
    const workoutConsistency = Math.min(100, Math.round(workoutDays / scheduledWorkoutDays * 100));
    const overall = Math.round((habitRate + nutritionConsistency + workoutConsistency) / 3);
    const averageWeight = weights.length ? showWeight(sum(weights, 'weight') / weights.length).toFixed(1) : '—';
    const averageWater = waterDays ? (sum(waterEntries, 'ml') / waterDays / 1000).toFixed(1) : '—';
    const topExercise = new Map();
    workouts.forEach((entry) => {
      if (!topExercise.has(entry.name)) topExercise.set(entry.name, []);
      topExercise.get(entry.name).push(entry);
    });
    const strengthSeries = ([...topExercise.values()].sort((a, b) => b.length - a.length)[0] || [])
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => ({ ...entry, weight: showWeight(entry.weight) }));
    screen.innerHTML = `${sectionHead('Evidence over time', 'Analytics & reports', `<label class="fitness-period">View <select id="fitnessAnalyticsPeriod">${[['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']].map(([value, label]) => `<option value="${value}" ${selectedPeriod === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`)}
      <div class="fitness-actions"><button class="secondary-btn" type="button" data-export-csv>Export CSV report</button><span>${period === 1 ? 'Today' : `Last ${period} days`} · daily logs are preserved</span></div>
      <section class="fitness-stats"><article class="fitness-stat"><span>Average daily calories</span><strong>${avg(dailyNutrition, 'calories')}</strong></article><article class="fitness-stat"><span>Average protein / logged day</span><strong>${avg(dailyNutrition, 'protein')} g</strong></article><article class="fitness-stat"><span>Average water / logged day</span><strong>${averageWater} L</strong></article><article class="fitness-stat"><span>Average logged weight</span><strong>${averageWeight} ${weightUnit()}</strong></article><article class="fitness-stat"><span>Workout days</span><strong>${workoutDays}</strong></article><article class="fitness-stat"><span>Average logged sleep</span><strong>${avg(sleep, 'hours')} hrs</strong></article><article class="fitness-stat"><span>Nutrition consistency</span><strong>${nutritionConsistency}%</strong></article><article class="fitness-stat"><span>Habit completion</span><strong>${habitRate}%</strong></article><article class="fitness-stat"><span>Overall consistency</span><strong>${overall}%</strong></article></section>
      ${card('Weight & strength trends', `<div class="fitness-trend">${weights.slice(-10).map((entry) => `<div><span>${esc(entry.date.slice(5))}</span><strong>${showWeight(entry.weight).toFixed(1)} ${weightUnit()}</strong></div>`).join('') || '<p class="fitness-empty">Log weight to see your trend.</p>'}</div>${strengthSeries.length > 1 ? buildTrendChart(strengthSeries, 'weight', weightUnit()) : '<p class="fitness-empty">Log the same exercise more than once to see strength progression.</p>'}<div>${renderPersonalRecords()}</div>`)}
      ${card('Measurement changes', renderMeasurementTrend())}
      <p class="fitness-disclaimer">Averages are based on recorded days, not missing days. Consistency scores compare logged data against your targets. Weight and strength changes are not a diagnosis or a measure of body composition by themselves.</p>`;
  }
  function groupByDate(entries) {
    const map = new Map();
    entries.forEach((entry) => {
      if (!map.has(entry.date)) map.set(entry.date, { date: entry.date, calories: 0, protein: 0 });
      map.get(entry.date).calories += Number(entry.calories) || 0;
      map.get(entry.date).protein += Number(entry.protein) || 0;
    });
    return [...map.values()];
  }
  function renderCustomize() {
    screen.innerHTML = `${sectionHead('Make it yours', 'Customisation')}
      ${card('Fitness categories', `<div class="category-settings">${data.categories.map((item) => `<div class="habit-item"><input id="category-${esc(item.key)}" type="checkbox" data-toggle-category="${esc(item.key)}" ${item.enabled ? 'checked' : ''}><label for="category-${esc(item.key)}">${esc(item.label)}</label>${!categories.some(([key]) => key === item.key) ? `<button type="button" class="fitness-inline-btn danger-text" data-remove-category="${esc(item.key)}">Remove</button>` : ''}</div>`).join('')}</div>
        <form class="fitness-form compact-form" data-fitness-form="category">${field('New category name', 'name', 'text', '', 'maxlength="40" required')}<button class="secondary-btn" type="submit">Add category</button></form>`)}
      ${card('Dashboard widgets', `<p>Move dashboard summaries to arrange them.</p><div class="widget-settings">${data.dashboardOrder.map((key, index) => `<div><span>${esc(key[0].toUpperCase() + key.slice(1))}</span><button type="button" data-move-widget="${index}" data-direction="-1" ${index === 0 ? 'disabled' : ''}>Move up</button><button type="button" data-move-widget="${index}" data-direction="1" ${index === data.dashboardOrder.length - 1 ? 'disabled' : ''}>Move down</button></div>`).join('')}</div>`)}
      ${card('Appearance', `<p>Choose a light or dark theme. The setting applies to the whole planner.</p><button class="secondary-btn" type="button" data-toggle-theme>Switch to ${data.theme === 'light' ? 'dark' : 'light'} mode</button>`)}
      ${card('Templates & routines', `<p>Saved meals: ${data.mealTemplates.length} · Workout routines: ${data.routines.length}</p><p>Categories and widget preferences are saved locally and included in fitness backups.</p>`)}
      ${card('Custom tracking fields', `<p>Add extra body measurement fields in Body measurements. Custom tasks, routines, foods and goals can be added in their respective screens.</p>`)}`;
  }
  function renderCustomCategory(key) {
    const category = data.categories.find((entry) => entry.key === key);
    if (!category) { current = 'dashboard'; return renderDashboard(); }
    const logs = data.customLogs.filter((entry) => entry.category === key);
    screen.innerHTML = `${sectionHead('Personal tracking', esc(category.label))}
      ${card(`Add ${esc(category.label)} entry`, form('custom-log', `<div class="fitness-form-grid">${field('Entry title', 'title', 'text', '', 'maxlength="100" required')}${field('Date', 'date', 'date', today(), 'required')}<label class="fitness-span"><span>Details / value</span><textarea name="details" rows="3" maxlength="500"></textarea></label></div><input type="hidden" name="category" value="${esc(key)}">`, 'Save entry'))}
      ${card('History', entriesList('customLogs', logs, (entry) => `<strong>${esc(entry.title)} · ${esc(entry.date)}</strong><span>${esc(entry.details)}</span>`))}`;
  }
  function render() {
    if (!screen || !nav) return;
    updateNav();
    const view = {
      dashboard: renderDashboard, profile: renderProfile, nutrition: renderNutrition, workouts: renderWorkouts,
      measurements: renderMeasurements, weight: renderWeight, water: renderWater, sleep: renderSleep,
      supplements: renderSupplements, habits: renderHabits, photos: renderPhotos, goals: renderGoals,
      learning: renderLearning, analytics: renderAnalytics, customize: renderCustomize
    }[current];
    if (view) view();
    else renderCustomCategory(current);
  }
  function estimateTargets(profile) {
    const multiplier = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, High: 1.725, 'Very high': 1.9 }[profile.activity] || 1.55;
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    const tdee = bmr * multiplier;
    const goalDelta = /fat loss/i.test(profile.goal) ? -350 : /recomposition/i.test(profile.goal) ? -100 : /muscle gain|bulk/i.test(profile.goal) ? 250 : 0;
    const calories = Math.max(1200, Math.round((tdee + goalDelta) / 50) * 50);
    const protein = Math.round(profile.weight * 2);
    const fat = Math.round(calories * 0.27 / 9);
    return { calories, protein, fat, carbs: Math.round(Math.max(0, calories - protein * 4 - fat * 9) / 4), fibre: 30 };
  }
  function readForm(formElement) {
    return Object.fromEntries(new FormData(formElement).entries());
  }
  function onSubmit(event) {
    const formElement = event.target.closest('[data-fitness-form]');
    if (!formElement) return;
    event.preventDefault();
    if (!formElement.reportValidity()) return;
    const values = readForm(formElement);
    const editId = formElement.dataset.editId;
    const number = (key) => Number(values[key] || 0);
    const date = values.date || today();
    switch (formElement.dataset.fitnessForm) {
      case 'profile': {
        const previous = data.profile;
        const next = { ...previous, age: number('age'), height: storeLength(number('height')), weight: storeWeight(number('weight')), targetWeight: storeWeight(number('targetWeight')), goal: values.goal, frequency: number('frequency'), activity: values.activity, units: values.units, calories: number('calories'), protein: number('protein'), carbs: number('carbs'), fat: number('fat'), fibre: number('fibre'), water: number('water'), sleep: number('sleep') };
        const changed = ['age', 'height', 'weight', 'goal', 'activity'].some((key) => String(previous[key]) !== String(next[key]));
        if (changed) {
          Object.assign(next, estimateTargets(next));
        }
        data.profile = next;
        break;
      }
      case 'meal':
      case 'meals': {
        const entry = { ...values, id: editId || id(), date, amount: number('amount'), calories: number('calories'), protein: number('protein'), carbs: number('carbs'), fat: number('fat'), fibre: number('fibre') };
        saveEntry('meals', entry); toast('Food entry saved'); return;
      }
      case 'workout':
      case 'workouts':
        saveEntry('workouts', { ...values, id: editId || id(), date, weight: storeWeight(number('weight')), sets: number('sets'), reps: number('reps'), rest: number('rest'), duration: number('duration') }); toast('Exercise saved'); return;
      case 'routine':
      case 'routines':
        saveEntry('routines', { ...values, id: editId || id() }); break;
      case 'recipe':
      case 'recipes':
        saveEntry('recipes', { ...values, id: editId || id(), serving: number('serving'), calories: number('calories'), protein: number('protein'), carbs: number('carbs'), fat: number('fat'), fibre: number('fibre') }); break;
      case 'measurement':
      case 'measurements': {
        const entry = { id: editId || id(), date, custom: {} };
        if (values.weight !== '') entry.weight = storeWeight(number('weight'));
        ['chest', 'waist', 'shoulders', 'leftArm', 'rightArm', 'leftForearm', 'rightForearm', 'leftThigh', 'rightThigh', 'calves', 'neck'].forEach((key) => { if (values[key] !== '') entry[key] = storeLength(number(key)); });
        data.customMeasurementFields.forEach((key) => { if (values[`custom_${key}`] !== undefined && values[`custom_${key}`] !== '') entry.custom[key] = storeLength(number(`custom_${key}`)); });
        saveEntry('measurements', entry); toast('Measurements saved'); return;
      }
      case 'measurement-field':
        if (data.customMeasurementFields.includes(values.name.trim())) return toast('That field already exists', 'warning');
        data.customMeasurementFields.push(values.name.trim()); break;
      case 'weight':
        saveEntry('measurements', { id: editId || id(), date, weight: storeWeight(number('weight')), custom: {} }); toast('Weight saved'); return;
      case 'water':
      case 'waterEntries':
        saveEntry('waterEntries', { id: editId || id(), date, ml: number('ml'), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }); toast('Water intake added'); return;
      case 'water-target':
        data.profile.water = number('water'); break;
      case 'sleep':
      case 'sleepEntries': {
        const [bedH, bedM] = values.bedtime.split(':').map(Number);
        const [wakeH, wakeM] = values.wake.split(':').map(Number);
        let duration = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
        if (duration <= 0) duration += 1440;
        saveEntry('sleepEntries', { ...values, id: editId || id(), date, hours: Math.round(duration / 60 * 10) / 10, soreness: number('soreness') }); toast('Recovery log saved'); return;
      }
      case 'supplement':
      case 'supplements':
        saveEntry('supplements', { ...values, id: editId || id() }); toast('Supplement schedule saved'); return;
      case 'habit':
        saveEntry('habits', { id: editId || id(), title: values.title.trim(), group: values.group, frequency: values.frequency, interval: number('interval'), createdDate: editId ? data.habits.find((item) => item.id === editId)?.createdDate || today() : today(), reminder: values.reminder }); toast('Task saved'); return;
      case 'goal':
      case 'goals':
        saveEntry('goals', { id: editId || id(), ...values, target: number('target'), current: number('current'), completedAt: number('target') > 0 && number('current') >= number('target') ? today() : '' }); break;
      case 'goal-progress': {
        const target = data.goals.find((goal) => goal.id === editId);
        if (target) {
          target.current = number('current');
          target.completedAt = target.target > 0 && target.current >= target.target ? target.completedAt || today() : '';
        }
        break;
      }
      case 'lesson-note': {
        const lesson = data.lessonProgress[formElement.dataset.lesson] || {};
        lesson.notes = values.notes;
        data.lessonProgress[formElement.dataset.lesson] = lesson;
        break;
      }
      case 'category': {
        const name = values.name.trim();
        if (data.categories.some((item) => item.label.toLowerCase() === name.toLowerCase())) return toast('That category already exists', 'warning');
        const key = `custom-${id()}`;
        data.categories.push({ key, label: name, enabled: true });
        current = key;
        break;
      }
      case 'custom-log':
      case 'customLogs':
        saveEntry('customLogs', { id: editId || id(), ...values }); break;
      case 'photo': {
        const file = formElement.querySelector('[name="image"]').files[0];
        if (!file || !file.type.startsWith('image/')) return toast('Choose a valid image', 'warning');
        if (file.size > 500 * 1024) return toast('Choose an image smaller than 500 KB', 'warning');
        const reader = new FileReader();
        reader.onerror = () => toast('Could not read this photo', 'warning');
        reader.onload = () => {
          data.photos.push({ id: id(), date, view: values.view, image: reader.result });
          persist(); render(); toast('Private photo saved on this device');
        };
        reader.readAsDataURL(file);
        return;
      }
      default: return;
    }
    persist();
    render();
    toast('Saved');
  }
  const collectionKeys = { meals: 'meals', workouts: 'workouts', measurements: 'measurements', waterEntries: 'waterEntries', sleepEntries: 'sleepEntries', supplements: 'supplements', supplementLogs: 'supplementLogs', habits: 'habits', goals: 'goals', photos: 'photos', routines: 'routines', recipes: 'recipes', customLogs: 'customLogs' };
  function onClick(event) {
    const navButton = event.target.closest('[data-fitness-view]');
    if (navButton) { current = navButton.dataset.fitnessView; render(); return; }
    const openButton = event.target.closest('[data-open-view]');
    if (openButton) { current = openButton.dataset.openView; render(); return; }
    const edit = event.target.closest('[data-edit]');
    if (edit) { editEntry(edit.dataset.edit, edit.dataset.id); return; }
    const remove = event.target.closest('[data-delete]');
    if (remove) {
      const key = collectionKeys[remove.dataset.delete];
      if (!key) return;
      if (key === 'habits') {
        const entry = data[key].find((item) => item.id === remove.dataset.id);
        if (entry) {
          data.deletedEntries.push({ id: id(), type: 'habit', entry, deletedAt: Date.now() });
        }
      }
      data[key] = data[key].filter((entry) => entry.id !== remove.dataset.id);
      persist(); render(); toast('Entry deleted'); return;
    }
    const waterBtn = event.target.closest('[data-add-water]');
    if (waterBtn) { data.waterEntries.push({ id: id(), ml: Number(waterBtn.dataset.addWater), date: today(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }); persist(); render(); return; }
    const toggle = event.target.closest('[data-toggle-habit]');
    if (toggle) {
      const habit = data.habits.find((item) => item.id === toggle.dataset.toggleHabit);
      if (habit) {
        habit.doneDates = habit.doneDates || [];
        habit.doneDates = toggle.checked ? [...new Set([...habit.doneDates, today()])] : habit.doneDates.filter((date) => date !== today());
        persist(); render();
      }
      return;
    }
    const completeLesson = event.target.closest('[data-lesson-complete]');
    if (completeLesson) {
      const item = data.lessonProgress[completeLesson.dataset.lesson] || {};
      item.completed = completeLesson.checked;
      item.completedAt = completeLesson.checked ? today() : '';
      data.lessonProgress[completeLesson.dataset.lesson] = item; persist(); render(); return;
    }
    const favorite = event.target.closest('[data-favorite-lesson]');
    if (favorite) { const item = data.lessonProgress[favorite.dataset.favoriteLesson] || {}; item.favorite = !item.favorite; data.lessonProgress[favorite.dataset.favoriteLesson] = item; persist(); render(); return; }
    const quiz = event.target.closest('[data-quiz]');
    if (quiz) {
      const index = Number(quiz.dataset.quiz);
      const [question, options, correct] = lessonQuizzes[index];
      const answer = window.prompt(`${question}\nA) ${options[0]}\nB) ${options[1]}\nC) ${options[2]}\n\nEnter A, B or C.`);
      if (answer === null) return;
      const correctAnswer = answer.trim().toUpperCase() === correct;
      const item = data.lessonProgress[index] || {};
      item.quizAttempts = (item.quizAttempts || 0) + 1;
      item.quizCorrect = (item.quizCorrect || 0) + (correctAnswer ? 1 : 0);
      data.lessonProgress[index] = item;
      persist();
      toast(correctAnswer ? 'Correct — nice work!' : `Not quite. The correct answer was ${correct}.`, correctAnswer ? 'success' : 'warning');
      render();
      return;
    }
    const addToLog = event.target.closest('[data-log-supplement]');
    if (addToLog) { const item = data.supplements.find((entry) => entry.id === addToLog.dataset.logSupplement); if (item) { data.supplementLogs.push({ id: id(), name: item.name, date: today(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }); persist(); render(); } return; }
    const duplicate = event.target.closest('[data-duplicate-meal]');
    if (duplicate) { const meal = data.meals.find((item) => item.id === duplicate.dataset.duplicateMeal); if (meal) { data.meals.push({ ...meal, id: id(), date: today() }); persist(); render(); toast('Meal duplicated'); } return; }
    const saveTemplate = event.target.closest('[data-template-meal]');
    if (saveTemplate) { const meal = data.meals.find((item) => item.id === saveTemplate.dataset.templateMeal); if (meal) { data.mealTemplates.push({ ...meal, id: id() }); persist(); render(); toast('Meal template saved'); } return; }
    const useTemplate = event.target.closest('[data-use-template]');
    if (useTemplate) { const item = data.mealTemplates.find((entry) => entry.id === useTemplate.dataset.useTemplate); if (item) { data.meals.push({ ...item, id: id(), date: today() }); persist(); render(); } return; }
    const logRecipe = event.target.closest('[data-log-recipe]');
    if (logRecipe) {
      const recipe = data.recipes.find((item) => item.id === logRecipe.dataset.logRecipe);
      if (recipe) {
        data.meals.push({ id: id(), date: today(), mealType: 'Breakfast', name: recipe.name, amount: recipe.serving, unit: 'g', foodState: 'prepared', calories: recipe.calories, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat, fibre: recipe.fibre });
        persist(); render(); toast('Recipe serving logged');
      }
      return;
    }
    const startRoutine = event.target.closest('[data-start-routine]');
    if (startRoutine) {
      const routine = data.routines.find((entry) => entry.id === startRoutine.dataset.startRoutine);
      if (routine) {
        routine.exercises.split(',').map((name) => name.trim()).filter(Boolean).forEach((name) => {
          data.workouts.push({ id: id(), name, muscle: routine.group, weight: 0, sets: 3, reps: 8, rest: 90, duration: 45, notes: `Added from ${routine.name}`, date: today() });
        });
        persist(); render(); toast(`${routine.name} added to today’s workout`);
      }
      return;
    }
    const libraryExercise = event.target.closest('[data-library-exercise]');
    if (libraryExercise) {
      const exerciseForm = screen.querySelector('form[data-fitness-form="workout"]');
      if (exerciseForm) {
        exerciseForm.elements.name.value = libraryExercise.dataset.libraryExercise;
        exerciseForm.elements.muscle.value = libraryExercise.dataset.libraryMuscle;
        exerciseForm.elements.name.focus();
        window.scrollTo({ top: exerciseForm.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
      }
      return;
    }
    const toggleCategory = event.target.closest('[data-toggle-category]');
    if (toggleCategory) { const item = data.categories.find((entry) => entry.key === toggleCategory.dataset.toggleCategory); if (item) { item.enabled = toggleCategory.checked; if (!item.enabled && current === item.key) current = 'dashboard'; persist(); render(); } return; }
    const removeCategory = event.target.closest('[data-remove-category]');
    if (removeCategory) {
      const category = data.categories.find((item) => item.key === removeCategory.dataset.removeCategory);
      if (category) {
        const deletedAt = Date.now();
        const logs = data.customLogs.filter((entry) => entry.category === category.key);
        data.deletedCategories.push({ id: id(), category, logs, deletedAt });
        data.categories = data.categories.filter((item) => item.key !== category.key);
        data.customLogs = data.customLogs.filter((entry) => entry.category !== category.key);
        current = 'customize';
        persist();
        window.dispatchEvent(new CustomEvent('focusflow:fitness-trash-updated'));
        render();
      }
      return;
    }
    const move = event.target.closest('[data-move-widget]');
    if (move) { const index = Number(move.dataset.moveWidget); const target = index + Number(move.dataset.direction); if (target >= 0 && target < data.dashboardOrder.length) { [data.dashboardOrder[index], data.dashboardOrder[target]] = [data.dashboardOrder[target], data.dashboardOrder[index]]; persist(); render(); } return; }
    const removeField = event.target.closest('[data-remove-measurement-field]');
    if (removeField) { data.customMeasurementFields = data.customMeasurementFields.filter((item) => item !== removeField.dataset.removeMeasurementField); persist(); render(); return; }
    if (event.target.closest('[data-toggle-theme]')) {
      data.theme = data.theme === 'light' ? 'dark' : 'light';
      persist(); applyTheme(); render(); return;
    }
    if (event.target.closest('[data-cancel-edit]')) render();
    if (event.target.closest('[data-export-csv]')) exportCsv();
    if (event.target.closest('#fitnessExportBtn')) exportCsv();
  }
  function editEntry(type, entryId) {
    const key = collectionKeys[type];
    if (type === 'habits') {
      const item = data.habits.find((entry) => entry.id === entryId);
      if (!item) return;
      const groups = ['Nutrition', 'Fitness', 'Recovery', 'Personal'];
      const habitForm = form('habit', `<div class="fitness-form-grid">${field('Task', 'title', 'text', item.title, 'maxlength="100" required')}${select('Category', 'group', groups.map((value) => [value, value]), item.group)}${select('Frequency', 'frequency', [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['custom', 'Custom interval']], item.frequency)}${field('Repeat every (days, for custom)', 'interval', 'number', item.interval || 1, 'min="1" max="365" required')}${field('Reminder time (optional)', 'reminder', 'time', item.reminder || '')}</div>`, 'Save changes', entryId);
      screen.insertAdjacentHTML('afterbegin', `<div class="fitness-edit-overlay"><h3>Edit task</h3>${habitForm}</div>`);
      window.scrollTo({ top: screen.offsetTop, behavior: 'smooth' });
      return;
    }
    const item = data[key]?.find((entry) => entry.id === entryId);
    if (!item) return;
    if (type === 'photos') {
      const date = window.prompt('Photo date (YYYY-MM-DD)', item.date);
      if (date === null) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toast('Enter a valid date in YYYY-MM-DD format', 'warning');
      const view = window.prompt('Photo view: Front, Side or Back', item.view);
      if (view === null) return;
      if (!['Front', 'Side', 'Back'].includes(view)) return toast('Choose Front, Side or Back', 'warning');
      item.date = date;
      item.view = view;
      persist(); render(); return;
    }
    if (type === 'supplementLogs') return toast('Consumption logs can be deleted; edit the supplement schedule to change its details.', 'warning');
    const fields = {
      meals: ['mealType', 'name', 'amount', 'unit', 'foodState', 'calories', 'protein', 'carbs', 'fat', 'fibre', 'date'],
      workouts: ['name', 'muscle', 'weight', 'sets', 'reps', 'rest', 'duration', 'date', 'notes'],
      measurements: ['date', 'weight', 'chest', 'waist', 'shoulders', 'leftArm', 'rightArm', 'leftForearm', 'rightForearm', 'leftThigh', 'rightThigh', 'calves', 'neck'],
      waterEntries: ['date', 'ml'], sleepEntries: ['date', 'bedtime', 'wake', 'quality', 'soreness', 'dayType', 'notes'],
      supplements: ['name', 'dosage', 'timing', 'brand', 'reminder', 'notes'], goals: ['title', 'target', 'current', 'date', 'type'],
      photos: [], routines: ['name', 'group', 'exercises'], recipes: ['name', 'serving', 'calories', 'protein', 'carbs', 'fat', 'fibre'], customLogs: ['title', 'date', 'details']
    }[type] || [];
    if (!fields.length) return;
    const labels = Object.fromEntries(fields.map((fieldName) => [fieldName, fieldName.replace(/[A-Z]/g, (char) => ` ${char.toLowerCase()}`).replace(/^./, (char) => char.toUpperCase())]));
    const editFields = fields.map((name) => {
      const lengthFields = ['chest', 'waist', 'shoulders', 'leftArm', 'rightArm', 'leftForearm', 'rightForearm', 'leftThigh', 'rightThigh', 'calves', 'neck'];
      const label = name === 'weight' ? `Weight (${weightUnit()})` : lengthFields.includes(name) ? `${labels[name]} (${lengthUnit()})` : labels[name];
      const value = item[name] === undefined || item[name] === null || item[name] === ''
        ? ''
        : name === 'weight' ? showWeight(item[name]).toFixed(1) : lengthFields.includes(name) ? showLength(item[name]).toFixed(1) : item[name];
      return name === 'notes' || name === 'details'
        ? `<label class="fitness-span"><span>${labels[name]}</span><textarea name="${name}">${esc(item[name] || '')}</textarea></label>`
        : field(label, name, ['date'].includes(name) ? 'date' : ['name', 'title', 'mealType', 'unit', 'foodState', 'muscle', 'dayType', 'type', 'timing', 'brand', 'dosage', 'reminder', 'group'].includes(name) ? 'text' : 'number', value, 'step="any"');
    });
    screen.insertAdjacentHTML('afterbegin', `<div class="fitness-edit-overlay"><h3>Edit entry</h3>${form(type, `<div class="fitness-form-grid">${editFields.join('')}</div>`, 'Save changes', entryId)}</div>`);
    window.scrollTo({ top: screen.offsetTop, behavior: 'smooth' });
  }
  function exportCsv() {
    const rows = [['date', 'type', 'name', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'fibre_g', 'value']];
    data.meals.forEach((entry) => rows.push([entry.date, 'food', entry.name, entry.calories, entry.protein, entry.carbs, entry.fat, entry.fibre, `${entry.amount} ${entry.unit}`]));
    data.workouts.forEach((entry) => rows.push([entry.date, 'exercise', entry.name, '', '', '', '', '', `${entry.weight} kg, ${entry.sets} sets × ${entry.reps}`]));
    data.measurements.forEach((entry) => rows.push([entry.date, 'weight', 'Body weight', '', '', '', '', '', `${entry.weight || ''} kg`]));
    data.waterEntries.forEach((entry) => rows.push([entry.date, 'water', 'Water', '', '', '', '', '', `${entry.ml} ml`]));
    data.sleepEntries.forEach((entry) => rows.push([entry.date, 'sleep', 'Sleep', '', '', '', '', '', `${entry.hours} hours; quality ${entry.quality}/5`]));
    data.habits.forEach((entry) => (entry.doneDates || []).forEach((date) => rows.push([date, 'habit', entry.title, '', '', '', '', '', 'completed'])));
    data.supplementLogs.forEach((entry) => rows.push([entry.date, 'supplement', entry.name, '', '', '', '', '', entry.time]));
    const content = rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    link.download = `fitness-report-${today()}.csv`; link.click(); URL.revokeObjectURL(link.href);
  }
  function checkFitnessReminders() {
    const clock = new Date();
    const currentTime = `${String(clock.getHours()).padStart(2, '0')}:${String(clock.getMinutes()).padStart(2, '0')}`;
    const reminders = [
      ...data.habits.filter((entry) => entry.reminder && isHabitDue(entry, today()) && !entry.doneDates?.includes(today())).map((entry) => ({ entry, kind: 'task' })),
      ...data.supplements.filter((entry) => entry.reminder).map((entry) => ({ entry, kind: 'supplement' }))
    ];
    let changed = false;
    reminders.forEach(({ entry, kind }) => {
      if (entry.reminder > currentTime || entry.remindedDate === today()) return;
      entry.remindedDate = today();
      changed = true;
      const message = kind === 'task' ? `Task reminder: ${entry.title}` : `Supplement reminder: ${entry.name}`;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Planner', { body: message });
      } else {
        toast(message, 'warning');
      }
    });
    if (changed) persist();
  }
  function onInput(event) {
    const formElement = event.target.closest('[data-fitness-form="meal"]');
    if (!formElement || !['name', 'amount', 'foodState'].includes(event.target.name)) return;
    let food = foods.find((item) => item.name.toLowerCase() === formElement.elements.name.value.trim().toLowerCase() &&
      (formElement.elements.foodState.value === 'prepared' || item.state === formElement.elements.foodState.value));
    const recipe = data.recipes.find((item) => item.name.toLowerCase() === formElement.elements.name.value.trim().toLowerCase());
    if (!food && recipe) food = { ...recipe, calories: recipe.calories * 100 / recipe.serving, protein: recipe.protein * 100 / recipe.serving, carbs: recipe.carbs * 100 / recipe.serving, fat: recipe.fat * 100 / recipe.serving, fibre: recipe.fibre * 100 / recipe.serving, state: 'prepared' };
    if (!food) return;
    const factor = Number(formElement.elements.amount.value || 0) *
      (formElement.elements.unit.value === 'serving' ? (recipe ? recipe.serving / 100 : 1) : 0.01);
    ['calories', 'protein', 'carbs', 'fat', 'fibre'].forEach((key) => {
      formElement.elements[key].value = (food[key] * factor).toFixed(1);
    });
  }
  nav.addEventListener('click', onClick);
  screen.addEventListener('click', onClick);
  screen.addEventListener('submit', onSubmit);
  screen.addEventListener('input', onInput);
  screen.addEventListener('change', (event) => {
    if (event.target.id === 'fitnessPeriod' || event.target.id === 'fitnessAnalyticsPeriod') render();
    if (event.target.name === 'units' && event.target.form?.dataset.fitnessForm === 'profile') {
      const newUnits = event.target.value;
      const toImperial = newUnits === 'Imperial';
      if (data.profile.units !== newUnits) {
        const convertWeight = (value) => Number(value) * (toImperial ? 2.20462 : 1 / 2.20462);
        const convertLength = (value) => Number(value) * (toImperial ? 1 / 2.54 : 2.54);
        ['weight', 'targetWeight'].forEach((name) => {
          const input = event.target.form.elements[name];
          input.value = convertWeight(input.value).toFixed(1);
          input.closest('label').querySelector('span').textContent = `${name === 'weight' ? 'Current' : 'Target'} weight (${toImperial ? 'lb' : 'kg'})`;
        });
        const height = event.target.form.elements.height;
        height.value = convertLength(height.value).toFixed(1);
        height.closest('label').querySelector('span').textContent = `Height (${toImperial ? 'in' : 'cm'})`;
        data.profile.units = newUnits;
        persist();
      }
    }
  });
  document.getElementById('fitnessExportBtn')?.addEventListener('click', exportCsv);
  load();
  if (!localStorage.getItem(KEY)) persist();
  applyTheme();
  render();
  window.addEventListener('focusflow:fitness-import', (event) => {
    if (!event.detail || typeof event.detail !== 'object') return;
    data = { ...defaults, ...event.detail, profile: { ...defaultProfile, ...(event.detail.profile || {}) } };
    applyTheme(); persist(); render();
  });
  window.addEventListener('focusflow:fitness-export', (event) => {
    if (event.detail) event.detail.fitness = data;
  });
  window.addEventListener('focusflow:fitness-trash-action', (event) => {
    const { action, id: deletedId } = event.detail || {};
    const taskIndex = (data.deletedEntries || []).findIndex((entry) => entry.id === deletedId);
    if (taskIndex >= 0) {
      const [entry] = data.deletedEntries.splice(taskIndex, 1);
      if (action === 'restore-task' && !data.habits.some((habit) => habit.id === entry.entry.id)) {
        data.habits.push(entry.entry);
      }
      persist();
      window.dispatchEvent(new CustomEvent('focusflow:fitness-trash-updated'));
      render();
      return;
    }
    const index = (data.deletedCategories || []).findIndex((entry) => entry.id === deletedId);
    if (index < 0) return;
    const [entry] = data.deletedCategories.splice(index, 1);
    if (action === 'restore-category') {
      if (!data.categories.some((category) => category.key === entry.category.key)) data.categories.push(entry.category);
      data.customLogs.push(...(entry.logs || []));
    }
    persist();
    window.dispatchEvent(new CustomEvent('focusflow:fitness-trash-updated'));
    render();
  });
  checkFitnessReminders();
  window.setInterval(checkFitnessReminders, 30000);
})();
