# 🔧 Решение проблемы деплоя в cPanel

## Ошибка: "The system cannot deploy"

```
Перед развертыванием убедитесь, что ваш репозиторий отвечает следующим требованиям:
- A valid .cpanel.yml file exists
- В извлеченной ветке непереданных изменений нет (clean working tree)
```

## ✅ Решение

### Метод 1: Через cPanel интерфейс (Рекомендуется)

1. Откройте **cPanel** → **Git Version Control**
2. Найдите ваш репозиторий `zakupka` и нажмите **Manage**
3. Перейдите на вкладку **Pull or Deploy**
4. Нажмите кнопку **"Update from Remote"**
   - Это подтянет последние изменения из GitHub/GitLab
   - Включая ваш `.cpanel.yml` файл
5. Подождите завершения операции
6. Проверьте что статус репозитория показывает "Clean working tree"
7. Теперь нажмите **"Deploy HEAD Commit"**

### Метод 2: Через SSH (если Метод 1 не помог)

Если в cPanel репозитории есть локальные изменения, которые мешают деплою:

```bash
# Подключитесь по SSH к вашему серверу
ssh username@yourserver.com

# Перейдите в директорию репозитория
cd /home/username/repositories/zakupka

# Проверьте статус
git status

# Если есть uncommitted changes, сбросьте их:
git reset --hard HEAD

# Подтяните последние изменения
git pull origin master

# Проверьте что .cpanel.yml существует
ls -la .cpanel.yml

# Убедитесь что working tree чистый
git status
# Должно быть: "nothing to commit, working tree clean"
```

Теперь вернитесь в cPanel → Git Version Control → Manage и нажмите **Deploy HEAD Commit**.

### Метод 3: Пересоздайте репозиторий в cPanel (крайний случай)

Если ничего не помогает:

1. В cPanel → Git Version Control
2. Удалите существующий репозиторий
3. Создайте новый:
   - Repository Path: `/home/username/repositories/zakupka`
   - Repository Name: `zakupka`
   - Clone URL: ваш GitHub/GitLab URL
4. Настройте SSH ключ (если репозиторий приватный)
5. После создания: Update from Remote → Deploy HEAD Commit

## 🔍 Проверка что всё готово к деплою

### Проверьте локальный репозиторий:

```bash
# В вашей локальной папке zakupka:
git status
# Должно быть: "nothing to commit, working tree clean"

git log --oneline -1
# Должен быть коммит с .cpanel.yml

git ls-files | grep .cpanel.yml
# Должно показать: .cpanel.yml

# Проверьте что файл правильный
cat .cpanel.yml
```

### Убедитесь что изменения запушены:

```bash
# Проверьте что все изменения отправлены на GitHub/GitLab
git status
# Должно быть: "Your branch is up to date with 'origin/master'"

# Если нет, запуште:
git push origin master
```

## ⚠️ Частые причины проблемы

1. **Файл .cpanel.yml не закоммичен**
   ```bash
   git add .cpanel.yml
   git commit -m "Add cPanel deployment config"
   git push origin master
   ```

2. **Изменения не запушены в GitHub/GitLab**
   ```bash
   git push origin master
   ```

3. **cPanel не обновлен из remote**
   - Решение: Update from Remote в cPanel

4. **В cPanel репозитории есть локальные изменения**
   - Решение: `git reset --hard HEAD` через SSH

5. **Папка .next не закоммичена** (для быстрого деплоя)
   ```bash
   # Проверьте
   git ls-files .next | head
   
   # Если пусто, добавьте:
   git add -f .next
   git commit -m "Add .next build for deployment"
   git push origin master
   ```

6. **Неправильный синтаксис YAML**
   - Проверьте что в .cpanel.yml нет табов (только пробелы)
   - Проверьте что отступы правильные (2 пробела)

## ✨ После успешного деплоя

В Deploy Log вы должны увидеть:

```
Deployment successful
Running deployment tasks...
[task output]
Deployment completed
```

## 🆘 Если проблема остается

1. **Проверьте Deploy Log** в cPanel → Git Version Control → Manage → Deploy Log
2. **Проверьте Repository Log** там же
3. **Свяжитесь с поддержкой хостинга** - возможно проблема на их стороне

## 📝 Полезные команды для отладки

```bash
# Через SSH на сервере cPanel:

# Проверка репозитория
cd /home/username/repositories/zakupka
git status
git log -1
git remote -v

# Проверка .cpanel.yml
cat .cpanel.yml

# Проверка прав доступа
ls -la .cpanel.yml

# Принудительная синхронизация
git fetch origin
git reset --hard origin/master
```

## 📖 Ссылки

- [CPANEL_DEPLOY_GUIDE.md](./CPANEL_DEPLOY_GUIDE.md) - Основная инструкция
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Полная документация
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) - Чеклист деплоя
