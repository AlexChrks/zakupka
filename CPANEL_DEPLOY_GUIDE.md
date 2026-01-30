# 🚀 Быстрый старт: cPanel деплой

## Выбор метода деплоя

У вас есть **2 файла** для деплоя на cPanel:

### 📦 Метод 1: `.cpanel.yml` (Рекомендуется)
**Билд локально → Деплой готового проекта**

✅ Преимущества:
- Быстрый деплой (копирование готовых файлов)
- Не нагружает сервер сборкой
- Гарантированно работает даже на слабых серверах

❌ Недостатки:
- Нужно коммитить папку `.next` в Git
- Больше размер репозитория

**Шаги:**
```bash
# 1. Соберите проект локально
npm run build

# 2. Временно уберите .next из .gitignore (или используйте git add -f)
# Откройте .gitignore и закомментируйте строку: # /.next

# 3. Закоммитьте
git add .next
git commit -m "Add build for deployment"

# 4. Отредактируйте .cpanel.yml (замените username)
# 5. Пушьте на cPanel
git push cpanel master
```

### 🔨 Метод 2: `.cpanel.build.yml`
**Деплой исходников → Билд на сервере**

✅ Преимущества:
- Не нужно коммитить `.next` папку
- Чистый репозиторий

❌ Недостатки:
- Медленный деплой (сборка занимает 2-5 минут)
- Требует больше ресурсов сервера
- Может не работать на слабых shared hosting

**Шаги:**
```bash
# 1. Переименуйте файл
mv .cpanel.build.yml .cpanel.yml

# 2. Отредактируйте .cpanel.yml (замените username)
# 3. Пушьте на cPanel
git push cpanel master
```

## ⚡ Минимальная конфигурация (5 минут)

### 1. Отредактируйте `.cpanel.yml`
```yaml
# Замените 'username' на ваш cPanel username
- export DEPLOYPATH=/home/ваш_username/public_html/zakupka
```

### 2. Коммитьте и пушьте
```bash
git add .cpanel.yml
git commit -m "Add cPanel deployment config"
git push origin master
```

### 3. Настройте Git в cPanel
1. Откройте **cPanel** → **Git Version Control**
2. **Create** новый репозиторий:
   - Repository Path: `/home/username/repositories/zakupka`
   - Clone URL: `https://github.com/your-username/zakupka.git`
3. **Manage** → **Pull or Deploy** → **Update from Remote**
4. **Deploy HEAD Commit**

### 4. Настройте Node.js приложение
1. **cPanel** → **Setup Node.js App**
2. **Create Application**:
   - Node version: `18.x+`
   - App root: `/home/username/public_html/zakupka`
   - Startup file: `server.js`
   - Environment variables:
     ```
     NODE_ENV=production
     PORT=3000
     NEXT_PUBLIC_SUPABASE_URL=https://dyzhqjqulfbgmbsqqxif.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_gNKn8DrzyZpSEU3CyibJvg_TI5rzxpC
     ```
3. **Run NPM Install**
4. **Restart**

### 5. Готово! 🎉
Откройте ваш домен в браузере.

## 📝 Полная документация

Смотрите [DEPLOYMENT.md](./DEPLOYMENT.md) для подробных инструкций и troubleshooting.

## 🔄 Обновление сайта

После внесения изменений:

```bash
# Соберите (если используете Метод 1)
npm run build
git add .
git commit -m "Update site"

# Пушьте
git push origin master

# В cPanel: Manage → Pull or Deploy → Update from Remote → Deploy HEAD Commit
```

Или настройте автоматический деплой:
```bash
git remote add cpanel ssh://username@yourserver.com/home/username/repositories/zakupka
git push cpanel master  # Автоматически задеплоится
```

## ⚠️ Важные замечания

1. **Замените `username`** в `.cpanel.yml` на ваш настоящий cPanel username
2. **Не коммитьте** файлы `.env` с секретными ключами
3. **Используйте SSH ключи** для приватных репозиториев
4. **Проверьте логи** если что-то не работает: `stderr.log` и `stdout.log` в папке приложения

## 🆘 Помощь

Проблемы? Проверьте:
- Логи в cPanel → Setup Node.js App → ваше приложение → Open logs
- Логи деплоя в cPanel → Git Version Control → Manage → Deploy Log
- SSH: `tail -f /home/username/public_html/zakupka/stderr.log`
