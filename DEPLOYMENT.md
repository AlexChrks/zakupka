# 🚀 Инструкция по деплою на cPanel

## Предварительные требования

1. **Node.js хостинг на cPanel** - убедитесь, что ваш хостинг поддерживает Node.js приложения
2. **Git доступ** - настроен Git Version Control в cPanel
3. **SSH доступ** (опционально, но рекомендуется)

## Шаг 1: Настройка `.cpanel.yml`

Откройте файл `.cpanel.yml` и замените `username` на ваше фактическое имя пользователя cPanel:

```yaml
- export DEPLOYPATH=/home/ваш_username/public_html/zakupka
```

### Варианты путей деплоя:

- **Основной домен**: `/home/username/public_html`
- **Поддомен**: `/home/username/public_html/subdomain`
- **Addon домен**: `/home/username/addon_domain.com`

## Шаг 2: Подготовка проекта

### Локальная сборка (рекомендуется):

```bash
# Установите зависимости
npm install

# Соберите проект
npm run build

# Закоммитьте изменения
git add .next package-lock.json
git commit -m "Build for production"
```

### Важно:
Убедитесь, что `.next` папка закоммичена в Git (временно уберите из `.gitignore` если нужно)

## Шаг 3: Настройка Git Repository в cPanel

1. Войдите в **cPanel** → **Git Version Control**
2. Нажмите **Create** для создания нового репозитория или **Manage** для существующего
3. Укажите:
   - **Repository Path**: `/home/username/repositories/zakupka`
   - **Repository Name**: `zakupka`
   - **Clone URL**: URL вашего Git репозитория (GitHub, GitLab и т.д.)

## Шаг 4: Настройка SSH ключей (для приватных репозиториев)

Если ваш репозиторий приватный:

1. В cPanel → **Git Version Control** → **Manage**
2. Скопируйте публичный SSH ключ
3. Добавьте его в GitHub/GitLab:
   - GitHub: Settings → SSH and GPG keys
   - GitLab: Settings → SSH Keys

## Шаг 5: Деплой

### Автоматический деплой (Push Deployment):

```bash
# Настройте remote для cPanel (один раз)
git remote add cpanel ssh://username@yourserver.com/home/username/repositories/zakupka

# Пушьте изменения
git push cpanel master
```

При каждом `git push` изменения автоматически применятся благодаря `.cpanel.yml`.

### Ручной деплой (Pull Deployment):

1. В cPanel → **Git Version Control** → **Manage** → вкладка **Pull or Deploy**
2. Нажмите **Update from Remote** (загрузит изменения из GitHub/GitLab)
3. Нажмите **Deploy HEAD Commit** (применит `.cpanel.yml`)

## Шаг 6: Настройка Node.js приложения в cPanel

1. Перейдите в **cPanel** → **Setup Node.js App**
2. Нажмите **Create Application**
3. Укажите:
   - **Node.js version**: 18.x или новее
   - **Application mode**: Production
   - **Application root**: `/home/username/public_html/zakupka`
   - **Application URL**: Ваш домен
   - **Application startup file**: `server.js`
   - **Environment variables**: 
     ```
     NODE_ENV=production
     PORT=3000
     NEXT_PUBLIC_SUPABASE_URL=https://dyzhqjqulfbgmbsqqxif.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_gNKn8DrzyZpSEU3CyibJvg_TI5rzxpC
     ```

4. Нажмите **Create**
5. После создания нажмите **Run NPM Install** (если не выполнилось в `.cpanel.yml`)
6. Нажмите **Restart** для запуска приложения

## Шаг 7: Проверка

Откройте ваш сайт в браузере. Приложение должно работать!

## Устранение проблем

### Приложение не запускается:

```bash
# Подключитесь по SSH и проверьте логи
cd /home/username/public_html/zakupka
tail -f stderr.log
tail -f stdout.log
```

### Права доступа:

```bash
# Исправьте права если нужно
chmod -R 755 /home/username/public_html/zakupka
```

### Node modules отсутствуют:

```bash
cd /home/username/public_html/zakupka
npm ci --production
```

## Альтернативный вариант: Статический экспорт

Если ваш хостинг не поддерживает Node.js, можно использовать статический экспорт:

1. Обновите `next.config.ts`:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
   };
   ```

2. Соберите статическую версию:
   ```bash
   npm run build
   ```

3. Обновите `.cpanel.yml` для копирования только `out/` папки:
   ```yaml
   - export DEPLOYPATH=/home/username/public_html
   - /bin/cp -R out/* $DEPLOYPATH
   ```

⚠️ **Внимание**: Статический экспорт не поддерживает серверные функции Next.js (API routes, SSR).

## Безопасность

1. **Никогда не коммитьте** `.env` файлы с секретными ключами
2. Используйте **Environment Variables** в cPanel для чувствительных данных
3. Обновите `SUPABASE_SERVICE_ROLE_KEY` через cPanel, не указывайте в `.cpanel.yml`

## Полезные ссылки

- [cPanel Git Deployment Documentation](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/environment-variables)
