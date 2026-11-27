# SvitloFix на Cloudflare Pages

## Розгортання сайту

У сайті є Cloudflare Pages Function для надсилання заявок у Telegram. Оберіть один зі способів розгортання.

### Підключення через Git

1. Завантажте файли проєкту до репозиторію GitHub або GitLab і підключіть його в **панелі Cloudflare → Workers & Pages → Create → Pages → Connect to Git**.
2. Вкажіть параметри збирання:
   - Шаблон платформи: **None** (без шаблону)
   - Команда збирання: залиште порожньою
   - Каталог із файлами сайту: `public`
   - Коренева папка: `/`
3. Запустіть розгортання. Cloudflare знайде обробник форми у файлі `functions/api/lead.js`.

### Пряме завантаження через Wrangler

Перетягування файлів у панель Cloudflare не збирає папку `functions/`, тому форма заявки не працюватиме. Для прямого завантаження використовуйте Wrangler із кореневої папки цього проєкту:

```sh
npx wrangler login
npx wrangler pages project create svitlofix
npx wrangler pages deploy public --project-name=svitlofix
```

Не переміщуйте папку `functions/`: вона має бути поруч із `public/`, щоб Wrangler додав обробник форми. Після створення проєкту Cloudflare не дозволяє змінити спосіб розгортання з Git на пряме завантаження або навпаки, тож визначтеся зі способом заздалегідь.

## Налаштування Telegram

У **Workers & Pages → svitlofix → Settings → Variables and Secrets** (Налаштування → Змінні та секрети) додайте:

- `TELEGRAM_BOT_TOKEN` як **Secret** (секрет) і вставте токен бота як його значення.
- `TELEGRAM_CHAT_ID` як звичайну текстову змінну зі значенням `6917165684`.

Після додавання змінних повторно розгорніть сайт. Токен бота навмисно не зберігається у файлах проєкту.

## Підключення домену

У **Workers & Pages → svitlofix → Custom domains** (Власні домени) додайте `svitlofix.com`. Якщо потрібно, щоб працював і `www.svitlofix.com`, додайте його також, а потім створіть правило переспрямування з `www.svitlofix.com/*` на `https://svitlofix.com/$1`. Так основною адресою залишиться домен без `www`.

У canonical URL, sitemap, robots.txt та метаданих для попереднього перегляду вже вказано `https://svitlofix.com/`.
