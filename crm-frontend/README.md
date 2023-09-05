# Проект "Система управления контактными данными клиентов"

Данная страница предоставляет следующие возможности:
* Просмотр списка людей в виде таблицы
* Добавление нового клиента
* Изменение информации о существующем клиенте

## Структура проекта

Все заголовки колонок, кроме контактов и действий, кликабельны с целью сортировки по соответствующему полю. Первое нажатие устанавливает сортировку по возрастанию, повторное - по убыванию. По умолчанию сортировка происходит по возрастанию по ID.

Для контактов VK, Facebook, телефона и email отображаются соответствующие иконки в колонке с контактами. Все остальные виды контактов отображаются
с одинаковыми иконками с человечком. При наведении указателя на контакт показывается всплывающая подсказка со значением этого контакта.

При нажатии на кнопку "Изменить" появляется модальное окно с формой изменения данных клиента. При редактировании данных клиента в блоке контактов возможно добавление до 10 контактов включительно. Каждый контакт можно удалить из списка по нажатию на крестик справа от него.
При нажатии на кнопку "Удалить" отображается модальное окно с подтверждением действия. Если пользователь подтверждает удаление, то данные клиента удаляются из таблицы.

Форма создания клиента открывается в виде модального окна по нажатию на кнопку "Добавить клиента", находящуюся под таблицей. 

## Дополнительные возможности

* Анимация открытия модального окна.
* Ссылка на карточку клиента: реализуется при помощи добавления hash-части в пути страницы при открытии модального окна редактирования данных клиента, а также возможно изначальное открытие нужного модального окна при первичной загрузке страницы с указанной hash-частью.
* Валидация формы перед отправкой на сервер:
• Имя и фамилия обязательны для заполнения;
• Заполнение имени и фамилии при помощи чисел не происходит;
• Валидируется минимально 2 символа;
• Каждый добавленный контакт должен быть полностью заполнен.
• Валидируется минимально 4 символа для контактов, не имеющих определенной формы(к примеру, ссыслка на facebook);
* Индикация загрузки.
* Поиск с автозаполнением.
