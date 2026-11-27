const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

const clean = (value, max) =>
  (typeof value === 'string' ? value.trim().slice(0, max) : '');

const escapeHtml = (value) =>
  String(value).replace(/[&<>\"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })[char]);

async function telegram(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    throw new Error(`Telegram ${method} failed: ${response.status}`);
  }
  return data;
}

async function sendPhotos(token, chatId, photos) {
  if (photos.length === 1) {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', photos[0], photos[0].name || 'photo.jpg');
    return telegram(token, 'sendPhoto', form);
  }

  const form = new FormData();
  form.append('chat_id', chatId);
  const media = photos.map((file, index) => {
    form.append(`photo${index}`, file, file.name || `photo${index}.jpg`);
    return { type: 'photo', media: `attach://photo${index}` };
  });
  form.append('media', JSON.stringify(media));
  return telegram(token, 'sendMediaGroup', form);
}

async function sendAsDocuments(token, chatId, photos) {
  for (const file of photos) {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('document', file, file.name || 'photo.jpg');
    await telegram(token, 'sendDocument', form);
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const token = env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not configured');
    return json(500, {
      ok: false,
      error: 'Сервіс тимчасово недоступний. Зателефонуйте нам, будь ласка.',
    });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: 'Некоректні дані форми.' });
  }

  if (clean(form.get('company'), 200)) return json(200, { ok: true });

  const name = clean(form.get('name'), 80);
  const phone = clean(form.get('phone'), 32);
  const message = clean(form.get('message'), 3000) || 'Запит на консультацію / попередній прорахунок';
  const city = clean(form.get('city'), 80);
  const service = clean(form.get('service'), 100);

  const errors = {};
  if (name.length < 2) errors.name = 'Вкажіть ім’я';
  if (phone.replace(/\D/g, '').length < 9) errors.phone = 'Вкажіть коректний номер телефону';
  if (Object.keys(errors).length) return json(422, { ok: false, errors });

  const photos = form
    .getAll('photos')
    .filter((file) => file && typeof file === 'object' && file.size > 0)
    .filter((file) => file.size <= MAX_PHOTO_BYTES && (ALLOWED_TYPES.has(file.type) || file.type === ''))
    .slice(0, MAX_PHOTOS);

  const chatId = env.TELEGRAM_CHAT_ID || '6917165684';
  const when = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
  const text = [
    '<b>⚡ Нова заявка — SvitloFix</b>',
    '',
    `<b>Ім’я:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Послуга:</b> ${escapeHtml(service || 'Не вказано')}`,
    city ? `<b>Населений пункт:</b> ${escapeHtml(city)}` : null,
    '',
    '<b>Задача:</b>',
    escapeHtml(message),
    '',
    `<i>Фото: ${photos.length} · ${escapeHtml(when)}</i>`,
  ].filter((line) => line !== null).join('\n');

  try {
    const messageForm = new FormData();
    messageForm.append('chat_id', chatId);
    messageForm.append('text', text);
    messageForm.append('parse_mode', 'HTML');
    await telegram(token, 'sendMessage', messageForm);
  } catch (error) {
    console.error(error);
    return json(502, {
      ok: false,
      error: 'Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.',
    });
  }

  let photosDelivered = true;
  if (photos.length) {
    try {
      await sendPhotos(token, chatId, photos);
    } catch (error) {
      console.error(error);
      try {
        await sendAsDocuments(token, chatId, photos);
      } catch (fallbackError) {
        console.error(fallbackError);
        photosDelivered = false;
      }
    }
  }

  return json(200, { ok: true, photosDelivered });
}
