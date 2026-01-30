# ✅ Чеклист деплоя на cPanel

## Перед деплоем

- [ ] Проект собирается без ошибок локально: `npm run build`
- [ ] Приложение работает локально: `npm start`
- [ ] Все изменения закоммичены в Git
- [ ] Переменные окружения записаны (вам понадобятся для cPanel)
- [ ] У вас есть доступ к cPanel хостингу с поддержкой Node.js

## Настройка `.cpanel.yml`

- [ ] Открыт файл `.cpanel.yml`
- [ ] Заменен `username` на ваш реальный cPanel username в строке:
  ```yaml
  - export DEPLOYPATH=/home/username/public_html/zakupka
  ```
- [ ] Путь деплоя соответствует вашей структуре директорий

## Выбор метода деплоя

### Метод 1: Деплой готового билда (Быстрый) ✅ Используется сейчас
- [ ] Проект собран: `npm run build`
- [ ] В `.gitignore` закомментирована строка `/.next` (или используйте `git add -f .next`)
- [ ] Папка `.next` добавлена в Git: `git add .next`
- [ ] Изменения закоммичены: `git commit -m "Add production build"`

### Метод 2: Билд на сервере (Альтернатива)
- [ ] Переименован `.cpanel.build.yml` в `.cpanel.yml`
- [ ] В файле заменен `username`
- [ ] Убедились что на сервере достаточно ресурсов для сборки

## Настройка Git Repository в cPanel

- [ ] Открыт cPanel → Git Version Control
- [ ] Создан новый репозиторий:
  - Repository Path: `/home/username/repositories/zakupka`
  - Clone URL: URL вашего репозитория (GitHub/GitLab/etc)
- [ ] Для приватных репозиториев: SSH ключ добавлен в GitHub/GitLab
- [ ] Тест соединения пройден успешно

## Первый деплой

- [ ] В Git Version Control → Manage → Pull or Deploy
- [ ] Нажата кнопка "Update from Remote" (подтянулись последние изменения)
- [ ] Нажата кнопка "Deploy HEAD Commit" (применился `.cpanel.yml`)
- [ ] В Deploy Log нет ошибок

## Настройка Node.js приложения

- [ ] Открыт cPanel → Setup Node.js App
- [ ] Создано новое приложение (Create Application)
- [ ] Настройки:
  - [ ] Node.js version: `18.x` или выше
  - [ ] Application mode: `Production`
  - [ ] Application root: `/home/username/public_html/zakupka`
  - [ ] Application URL: ваш домен
  - [ ] Application startup file: `server.js`
  
- [ ] Добавлены Environment Variables:
  ```
  NODE_ENV=production
  PORT=3000
  NEXT_PUBLIC_SUPABASE_URL=https://dyzhqjqulfbgmbsqqxif.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_gNKn8DrzyZpSEU3CyibJvg_TI5rzxpC
  ```

- [ ] Нажата кнопка "Run NPM Install" (если не выполнилось автоматически)
- [ ] Приложение запущено (Restart)

## Проверка работоспособности

- [ ] Сайт открывается по домену
- [ ] Главная страница загружается
- [ ] Логин работает
- [ ] Регистрация работает
- [ ] Dashboard доступен
- [ ] Нет ошибок в консоли браузера

## Проверка логов (если что-то не работает)

- [ ] Проверены логи в cPanel → Setup Node.js App → Open logs
- [ ] Проверен Deploy Log в Git Version Control
- [ ] При необходимости: подключение по SSH и проверка:
  ```bash
  cd /home/username/public_html/zakupka
  tail -f stderr.log
  tail -f stdout.log
  ```

## Настройка автоматического деплоя (опционально)

- [ ] Добавлен cPanel remote:
  ```bash
  git remote add cpanel ssh://username@yourserver.com/home/username/repositories/zakupka
  ```
- [ ] Протестирован push: `git push cpanel master`
- [ ] Изменения автоматически задеплоились

## Безопасность

- [ ] Файл `.env.local` НЕ закоммичен в Git
- [ ] Секретные ключи (SERVICE_ROLE_KEY) добавлены только через cPanel Environment Variables
- [ ] SSH доступ защищен (пароль или ключи)
- [ ] Регулярные бэкапы настроены в cPanel

## После успешного деплоя

- [ ] URL сайта сохранен
- [ ] Документация обновлена (если нужно)
- [ ] Команда уведомлена о новом деплое
- [ ] Создан тег в Git: `git tag v1.0.0 && git push --tags`

---

## 🎉 Поздравляем! Ваше приложение развернуто!

## Обновление в будущем

Для обновления сайта после изменений:

```bash
# 1. Внесите изменения в код
# 2. Соберите проект (если используете Метод 1)
npm run build

# 3. Закоммитьте
git add .
git commit -m "Update: описание изменений"

# 4. Пушьте
git push origin master

# 5. В cPanel: Update from Remote → Deploy HEAD Commit
# Или: git push cpanel master (если настроен автодеплой)
```

## Полезные ссылки

- 📚 [Полная документация](./DEPLOYMENT.md)
- 🚀 [Быстрый старт](./CPANEL_DEPLOY_GUIDE.md)
- 📖 [cPanel Git Documentation](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/)
