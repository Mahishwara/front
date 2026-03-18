# Руководство по стилям проекта

## 📋 Содержание
- [Переменные CSS](#переменные-css)
- [Компоненты](#компоненты)
- [Классы утилит](#классы-утилит)
- [Адаптивный дизайн](#адаптивный-дизайн)
- [Примеры использования](#примеры-использования)

---

## 🎨 Переменные CSS

### Цвета
```css
--primary-color: #1890ff      /* Основной цвет */
--primary-hover: #0050b3      /* Цвет при наведении */
--success-color: #52c41a      /* Успех */
--warning-color: #faad14      /* Предупреждение */
--error-color: #f5222d        /* Ошибка */
--info-color: #1890ff         /* Информация */
```

### Фон
```css
--bg-primary: #ffffff         /* Основной фон (белый) */
--bg-secondary: #f5f5f5       /* Вторичный фон */
--bg-tertiary: #fafafa        /* Третичный фон */
```

### Текст
```css
--text-primary: #000000d9     /* Основной текст */
--text-secondary: #00000073   /* Вторичный текст */
```

### Другое
```css
--border-color: #d9d9d9       /* Цвет границ */
--shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12)  /* Тень */
```

### Отступы (Spacing)
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
--spacing-xxl: 32px
```

### Скругления (Border Radius)
```css
--radius-sm: 2px
--radius-md: 4px
--radius-lg: 6px
```

---

## 🧩 Компоненты

### Карточки (Cards)
```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Заголовок</h2>
  </div>
  <div class="card-body">Содержимое</div>
  <div class="card-footer">
    <button>Действие</button>
  </div>
</div>
```

### Формы
```html
<div class="form-group">
  <label class="form-label">Поле ввода</label>
  <input class="form-control" type="text" />
</div>
```

### Кнопки
```html
<button class="button buttonPrimary">Основная</button>
<button class="button buttonSecondary">Вторичная</button>
<button class="button buttonDanger">Опасно</button>
```

### Список
```html
<ul class="list">
  <li class="list-item">Элемент 1</li>
  <li class="list-item">Элемент 2</li>
</ul>
```

---

## 🔧 Классы утилит

### Отступы (Padding)
```css
.p-xs, .p-sm, .p-md, .p-lg, .p-xl
```

### Расстояния (Margin)
```css
.m-xs, .m-sm, .m-md, .m-lg, .m-xl
.mt-sm, .mt-md, .mt-lg    /* margin-top */
.mb-sm, .mb-md, .mb-lg    /* margin-bottom */
```

### Гэп (Gap)
```css
.gap-sm, .gap-md, .gap-lg
```

### Flexbox
```css
.flex-center       /* центрирование */
.flex-between      /* space-between */
```

### Состояния
```css
.loading           /* opacity: 0.6 */
.disabled          /* opacity: 0.6, cursor: not-allowed */
.success           /* зелёный текст */
.error             /* красный текст */
.warning           /* оранжевый текст */
```

---

## 📱 Адаптивный дизайн

### Точки разрыва
```css
@media (max-width: 1024px) { /* Планшеты */
@media (max-width: 768px)  { /* Маленькие планшеты */
@media (max-width: 480px)  { /* Мобильные */
```

### Сетка (Grid)
```html
<div class="grid">Автоматическая сетка</div>
<div class="grid-2">Два столбца</div>
<div class="grid-3">Три столбца</div>
```

На мобильных устройствах все сетки переходят в один столбец.

---

## 💡 Примеры использования

### Пример 1: Вакансия
```html
<div class="vacancyCard">
  <div class="vacancyHeader">
    <h3 class="vacancyTitle">Frontend разработчик</h3>
    <span class="vacancyStatus statusActive">Активна</span>
  </div>
  <div class="vacancyMeta">
    <span class="vacancyMetaItem">
      <span class="vacancyMetaIcon">📍</span>
      Москва
    </span>
    <span class="vacancyMetaItem">
      <span class="vacancyMetaIcon">💰</span>
      100 000 - 150 000 ₽
    </span>
  </div>
  <p class="vacancyDescription">Описание вакансии...</p>
  <div class="vacancyFooter">
    <div class="vacancySalary">150 000 ₽</div>
    <div class="vacancyActions">
      <button class="vacancyAction primaryAction">Откликнуться</button>
    </div>
  </div>
</div>
```

### Пример 2: Форма
```html
<div class="dataContainer">
  <div class="dataHeader">
    <h1 class="dataTitle">Профиль студента</h1>
  </div>
  <form>
    <div class="formSection">
      <h2 class="sectionTitle">Личные данные</h2>
      <div class="formRow">
        <div class="formGroup">
          <label class="formLabel required">Имя</label>
          <input class="formInput" type="text" required />
        </div>
        <div class="formGroup">
          <label class="formLabel required">Фамилия</label>
          <input class="formInput" type="text" required />
        </div>
      </div>
    </div>
    <div class="formActions">
      <button type="button" class="button buttonSecondary">Отмена</button>
      <button type="submit" class="button buttonPrimary">Сохранить</button>
    </div>
  </form>
</div>
```

### Пример 3: Заявка на вакансию
```html
<div class="applicationCard">
  <div class="applicationHeader">
    <h3 class="applicationTitle">Заявка на должность</h3>
    <span class="applicationBadge badgePending">На рассмотрении</span>
  </div>
  <div class="applicationInfo">
    <div class="infoItem">
      <span class="infoLabel">Вакансия</span>
      <span class="infoValue">Frontend разработчик</span>
    </div>
    <div class="infoItem">
      <span class="infoLabel">Дата подачи</span>
      <span class="infoValue">15 марта 2026</span>
    </div>
  </div>
  <div class="applicationMessage">
    <div class="messageLabel">Ваше сопроводительное письмо</div>
    <p class="messageText">Мой текст...</p>
  </div>
</div>
```

---

## 📐 Модульные CSS файлы

| Файл | Назначение |
|------|-----------|
| `index.css` | Глобальные стили и переменные |
| `App.css` | Основные компоненты приложения |
| `Header.module.css` | Стили шапки |
| `Layout.module.css` | Стили макета |
| `Vacancy.module.css` | Стили вакансий |
| `Auth.module.css` | Стили аутентификации и профиля |
| `Application.module.css` | Стили заявок |
| `DataForms.module.css` | Стили форм данных |

---

## 🎯 Лучшие практики

1. **Используйте переменные CSS** вместо хардкода цветов
2. **Применяйте классы утилит** для стандартных отступов
3. **Проверяйте адаптивность** на мобильных устройствах
4. **Сохраняйте консистентность** в всплывающих окнах и сообщениях
5. **Используйте семантичный HTML** для better SEO и доступности

---

## 🔮 Анимации

Доступные анимации:
- `fadeIn` - плавное появление
- `slideInUp` - появление снизу
- `spin` - вращение (для загрузки)

Применение:
```html
<div class="fade-in">Содержимое</div>
<div class="slide-in-up">Содержимое</div>
```

---

## 📚 Дополнительные ресурсы

- **Иконки**: используется `react-icons` пакет
- **UI компоненты**: Ant Design
- **Фреймворк**: React с TypeScript
