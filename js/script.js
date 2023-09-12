(async function () {
    const main = document.getElementById('main');
    const idCell = document.getElementById('id');
    const nameCell = document.getElementById('name');
    const creatingCell = document.getElementById('creation-date');
    const changesCell = document.getElementById('changes');
    const cellActive = 'main-table__cell_active';
    const tableAllWrapper = document.querySelector('.main-table__all-wrapper')
    const tableBody = document.getElementById('table-body');
    const addClientBtn = createAddClientBtn();
    const modalBackground = document.getElementById('modal-background')
    const load = createLoad();
    const INTERACTIVE_SELECTORS = ['a', 'button', 'input', 'textarea', 'tabindex', '.main-table__header_interactive']

    // tabindex

    class modalWindow {
        constructor(doc, modal) {
            this.doc = doc;
            this.modal = modal;
            this.interactiveElementsList = [];
            this.blockElementsList = [];
        }
        createTabIndex() {
            let elements = this.doc.querySelectorAll(INTERACTIVE_SELECTORS.toString());
            let element;
            for (let i = 0; i < elements.length; i++) {
                element = elements[i];
                if (!this.modal.contains(element)) {
                    if (element.getAttribute('tabindex') !== '-1') {
                        element.setAttribute('tabindex', '-1');
                        this.interactiveElementsList.push(element);
                    }
                }
            }
            let children = this.doc.body.children;
            for (let i = 0; i < children.length; i++) {
                element = children[i];
                if (!this.modal.contains(element)) {
                    if (element.getAttribute('aria-hidden') !== 'true') {
                        element.setAttribute('aria-hidden', 'true');
                        this.blockElementsList.push(element);
                    }
                }
            }
        }

        removeTabIndex() {
            let element;
            while (this.interactiveElementsList.length !== 0) {
                element = this.interactiveElementsList.pop();
                element.setAttribute('tabindex', '0')
            }
            while (this.blockElementsList.length !== 0) {
                element = this.interactiveElementsList.pop();
                element.setAttribute('aria-label', 'false')
            }
        }
    }
    let contactIdStart = 0;

    tableAllWrapper.append(load);
    tableAllWrapper.append(addClientBtn);
    let clientsData = await loadClientsData();

    async function loadClientsData() {
        const response = await fetch(`https://clients-d-ch-a05d87fdc1be.herokuapp.com/api/clients`);
        const data = await response.json();

        const array = [];
        data.forEach(client => {
            const clientName = `${client.name} ${client.surname}`;
            array.push(clientName);
        })
        return { data, array }
    }

    function createProtectiveShield() {
        const shield = document.createElement('div');
        shield.classList.add('shield-on');
        return shield;
    }
    const protectiveShield = createProtectiveShield();

    function createLoad() {
        const loadBgWrapper = document.createElement('div');
        const loadBackground = document.createElement('div');
        const loadWrapper = document.createElement('div');
        const loadElement = document.createElement('div');

        loadBgWrapper.classList.add('main-table__load-bg-wrapper');
        loadBackground.classList.add('main-table__load-background');
        loadWrapper.classList.add('main-table__load-wrapper');
        loadElement.classList.add('main-table__load');

        loadWrapper.append(loadElement);
        loadBackground.append(loadWrapper);
        loadBgWrapper.append(loadBackground);

        return loadBgWrapper
    }

    //  site search
    const requestError = document.createElement('div');
    requestError.classList.add('request-error');
    requestError.textContent = 'По данному запросу ничего не найдено';
    main.prepend(requestError);

    // const filter = document.getElementById('filter');
    // filter.addEventListener('submit', function (e) {
    //     e.preventDefault();
    //     const responseInput = document.getElementById('headerInput').value.toLowerCase();

    //     let filteredClients = [];
    //     for (const client of clientsArray) {
    //         if (responseInput.length > 0 && !`${client.surname} ${client.name} ${client.lastName}`.toLowerCase().includes(responseInput)) {
    //             continue;
    //         };
    //         filteredClients.push(client);
    //     }
    //     createTableBody(filteredClients);
    // });

    function autocomplete(inp, arr) {
        /* функция автозаполнения принимает два аргумента,
        элемент текстового поля и массив возможных значений автозаполнения: */
        let currentFocus;
        let timeout;
        /* выполнение функции, когда кто-то пишет в текстовом поле: */
        inp.addEventListener('input', function (e) {
            let list, item, i, val = this.value;
            /* закрыть все уже открытые списки значений автозаполнения */
            closeAllLists();
            if (!val) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    requestError.classList.remove('is-block');
                }, 500);
                return false
            };
            currentFocus = -1;
            /* создайте элемент DIV, который будет содержать элементы (значения): */
            list = document.createElement('div');
            list.setAttribute('id', this.id + '-autocomplete-list');
            list.setAttribute('class', 'autocomplete-items');
            /* добавьте элемент DIV в качестве дочернего элемента контейнера автозаполнения: */
            this.parentNode.appendChild(list);
            /* для каждого элемента в массиве... */
            for (i = 0; i < arr.length; i++) {
                /* проверьте, начинается ли элемент с тех же букв, что и значение текстового поля: */
                // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                    requestError.classList.remove('is-block');
                    /* создайте элемент DIV для каждого соответствующего элемента: */
                    item = document.createElement('div');
                    /* сделайте соответствующие буквы жирным шрифтом: */
                    // item.innerHTML = '<strong>' + arr[i] + '</strong>';
                    item.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
                    item.innerHTML += arr[i].substr(val.length);
                    /* вставьте поле ввода, которое будет содержать значение текущего элемента массива: */
                    item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /* выполнение функции, когда кто-то нажимает на значение элемента (элемент DIV): */
                    item.addEventListener('click', function (e) {
                        /* вставьте значение для текстового поля автозаполнения: */
                        inp.value = this.getElementsByTagName('input')[0].value;
                        const inpSurname = this.getElementsByTagName('input')[0].value.split(' ')[1];
                        const inpName = this.getElementsByTagName('input')[0].value.split(' ')[0];
                        /* закройте список значений автозаполнения,
                        (или любые другие открытые списки значений автозаполнения : */
                        closeAllLists();
                        for (let ind = 0; ind < clientsData.data.length; ind++) {
                            let currentClient;
                            if (inpName === clientsData.data[ind].name && inpSurname === clientsData.data[ind].surname) {
                                currentClient = clientsData.data[ind];
                                const clientString = document.getElementById(`${clientsData.data[ind].id}`)
                                clientString.classList.add('main-table__string_active');
                                clientString.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
                                setTimeout(() => clientString.classList.remove('main-table__string_active'), 1000);
                                inp.value = '';
                            }
                        }
                    });
                    list.appendChild(item);
                };
            }
            if (list.childElementCount === 0) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    requestError.classList.add('is-block');
                }, 500);
            }
        });
        /* выполнение функции нажимает клавишу на клавиатуре: */
        inp.addEventListener('keydown', function (e) {
            let autocompleteList = document.getElementById(this.id + '-autocomplete-list');
            if (autocompleteList) autocompleteList = autocompleteList.getElementsByTagName('div');
            if (e.keyCode == 40) {
                /* Если нажата клавиша со стрелкой вниз,
                увеличение текущей переменной фокуса: */
                currentFocus++;
                /* и сделать текущий элемент более видимым: */
                addActive(autocompleteList);
            } else if (e.keyCode == 38) { //вверх
                /* Если нажата клавиша со стрелкой вверх,
                уменьшите текущую переменную фокуса: */
                currentFocus--;
                /* и сделать текущий элемент более видимым: */
                addActive(autocompleteList);
            } else if (e.keyCode == 13) {
                /* Если нажата клавиша ENTER, предотвратите отправку формы, */
                e.preventDefault();
                if (currentFocus > -1) {
                    /* и имитировать щелчок по элементу 'active': */
                    if (autocompleteList) autocompleteList[currentFocus].click();
                }
            }
        });
        function addActive(autocompleteList) {
            /* функция для классификации элемента как 'active': */
            if (!autocompleteList) return false;
            /* начните с удаления 'активного' класса для всех элементов: */
            removeActive(autocompleteList);
            if (currentFocus >= autocompleteList.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (autocompleteList.length - 1);
            /*добавить класса 'autocomplete-active': */
            autocompleteList[currentFocus].classList.add('autocomplete-active');
        }
        function removeActive(autocompleteList) {
            /* функция для удаления 'активного' класса из всех элементов автозаполнения: */
            for (let i = 0; i < autocompleteList.length; i++) {
                autocompleteList[i].classList.remove('autocomplete-active');
            }
        }
        function closeAllLists(elmnt) {
            /* закройте все списки автозаполнения в документе,
            кроме того, который был передан в качестве аргумента: */
            let autocompleteList = document.getElementsByClassName('autocomplete-items');
            for (let i = 0; i < autocompleteList.length; i++) {
                if (elmnt != autocompleteList[i] && elmnt != inp) {
                    autocompleteList[i].parentNode.removeChild(autocompleteList[i]);
                }
            }
        }
        /* выполнение функции, когда кто-то щелкает в документе: */
        document.addEventListener('click', function (e) {
            closeAllLists(e.target);
        });
    }

    autocomplete(document.getElementById('headerInput'), clientsData.array);

    // create body of table

    function createBtnGroup(clientId) {
        const btnGroup = document.createElement('td');
        const btnsWrapper = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const btnWrapper = document.createElement('div');
        const editImg = document.createElement('img');
        const editWord = document.createElement('p');
        const deleteImg = document.createElement('img');
        const deleteWord = document.createElement('p');
        const loadElement = document.createElement('div');

        btnGroup.classList.add('main-table__cell');
        btnsWrapper.classList.add('cell__actions', 'flex');
        editBtn.classList.add('cell__btn-edit', 'flex', 'btn-reset');
        editBtn.setAttribute('clientId', clientId);
        btnWrapper.classList.add('cell__btn-wrapper');
        deleteBtn.classList.add('cell__btn-cancel', 'flex', 'btn-reset');
        deleteBtn.setAttribute('clientId', clientId);
        editWord.classList.add('cell__edit-text');
        deleteWord.classList.add('cell__cancel-text');
        editImg.src = 'img/edit.svg';
        editWord.textContent = 'Изменить';
        deleteImg.src = 'img/cancel_red.svg';
        deleteWord.textContent = 'Удалить';
        loadElement.classList.add('cell__load');
        loadElement.style.marginRight = '3px';

        editBtn.append(editImg);
        editBtn.append(editWord);
        btnWrapper.append(editBtn);
        deleteBtn.append(deleteImg);
        deleteBtn.append(deleteWord);
        btnsWrapper.append(btnWrapper);
        btnsWrapper.append(deleteBtn);
        btnGroup.append(btnsWrapper);
        editBtn.addEventListener('mousedown', event => {
            location.hash = event.target.parentNode.getAttribute('clientId');
        })
        editBtn.addEventListener('touchstart', event => {
            location.hash = event.parentNode.getAttribute('clientId');
        })
        editBtn.addEventListener('keypress', event => {
            location.hash = event.target.getAttribute('clientId');
        })
        deleteBtn.addEventListener('mousedown', event => {
            const removeModalElement = createRemoveModal(event.target.parentNode.getAttribute('clientId'))
            if (removeModalElement) main.append(removeModalElement);
        });
        deleteBtn.addEventListener('keypress', event => {
            const removeModalElement = createRemoveModal(event.target.getAttribute('clientId'))
            if (removeModalElement) main.append(removeModalElement);
        })
        return btnGroup
    }

    function createTableBody(clients) {
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        clients.forEach(client => {
            const clientString = document.createElement('tr');
            const clientId = document.createElement('td');
            const clientName = document.createElement('td');
            const clientCreating = document.createElement('td');
            const clientCreatingDate = document.createElement('span');
            const clientCreatingTime = document.createElement('span');
            const clientChanges = document.createElement('td');
            const clientChangesDate = document.createElement('span');
            const clientChangesTime = document.createElement('span');
            const clientContacts = document.createElement('td');
            const clientContactsList = document.createElement('ul');
            const clientContactItem = document.createElement('button');
            const btnGroup = createBtnGroup(client.id);

            clientString.classList.add('main-table__string');
            clientString.setAttribute('id', `${client.id}`);
            clientId.classList.add('main-table__cell', 'cell__id');
            clientName.classList.add('main-table__cell', 'cell__name');
            clientCreating.classList.add('main-table__cell', 'cell__creating');
            clientCreatingDate.classList.add('cell__creating-date');
            clientCreatingTime.classList.add('cell__creating-time');
            clientChanges.classList.add('main-table__cell', 'cell__changes');
            clientChangesDate.classList.add('cell__changes-date');
            clientChangesTime.classList.add('cell__changes-time');
            clientContacts.classList.add('main-table__cell', 'cell__contacts')
            clientContactsList.classList.add('cell__contacts-list', 'flex', 'list-reset');
            clientContactItem.classList.add('contact__item', 'contact__item_more', 'btn-reset')

            const createdAtDate = client.createdAt.split('T')[0];
            const createdAtYear = createdAtDate.split('-')[0];
            const createdAtMonth = createdAtDate.split('-')[1];
            const createdAtDay = createdAtDate.split('-')[2];
            const creatingTime = client.createdAt.split('T')[1];
            const createdAtHour = creatingTime.split(':')[0];
            const createdAtMinute = creatingTime.split(':')[1];
            const updatedAtDate = client.updatedAt.split('T')[0];
            const updatedAtYear = updatedAtDate.split('-')[0];
            const updatedAtMonth = updatedAtDate.split('-')[1];
            const updatedAtDay = updatedAtDate.split('-')[2];
            const updatingTime = client.updatedAt.split('T')[1];
            const updatedAtHour = updatingTime.split(':')[0];
            const updatedAtMinute = updatingTime.split(':')[1];

            clientId.innerHTML = client.id;
            clientName.innerHTML = client.surname + ' ' + client.name + ' ' + client.lastName;
            clientCreatingDate.innerHTML = createdAtDay + '.' + createdAtMonth + '.' + createdAtYear;
            clientCreatingTime.innerHTML = createdAtHour + ':' + createdAtMinute;
            clientChangesDate.innerHTML = updatedAtDay + '.' + updatedAtMonth + '.' + updatedAtYear;
            clientChangesTime.innerHTML = updatedAtHour + ':' + updatedAtMinute;

            clientCreating.append(clientCreatingDate);
            clientCreating.append(clientCreatingTime);
            clientChanges.append(clientChangesDate);
            clientChanges.append(clientChangesTime);
            clientString.append(clientId);
            clientString.append(clientName);
            clientString.append(clientCreating);
            clientString.append(clientChanges);

            function renderIcons(i) {
                const telIcon = createTelIcon();
                const emailIcon = createEmailIcon();
                const fbIcon = createFbIcon();
                const vkIcon = createVkIcon();
                const manIcon = createManIcon();
                switch (client.contacts[i].type) {
                    case 'Телефон': showIcon(telIcon);
                        break;
                    case 'Доп. телефон': showIcon(telIcon);
                        break;
                    case 'Email': showIcon(emailIcon);
                        break;
                    case 'Facebook': showIcon(fbIcon);
                        break;
                    case 'Vk': showIcon(vkIcon);
                        break;
                    default: showIcon(manIcon);
                        break;
                }

                function createTippy(icon) {
                    tippy(icon, {
                        content: `${client.contacts[i].value}`,
                        allowHTML: true,
                        interactive: true,
                        offset: [2, 7],
                        role: 'tooltip',
                        // trigger: 'click',
                    });
                }
                function showIcon(icon) {
                    clientContactsList.append(icon);
                    createTippy(icon);
                }
            }

            for (let i = 0; i < client.contacts.length; i++) {
                if (i < 5) {
                    renderIcons(i);
                };
                if (i > 4) {
                    clientContactItem.innerHTML = '+' + (client.contacts.length - 4);
                    clientContactsList.lastChild.remove();
                    clientContactsList.append(clientContactItem);
                }
            }
            clientContactItem.addEventListener('click', () => {
                clientContactsList.lastChild.remove();
                for (let i = 4; i < client.contacts.length; i++) {
                    renderIcons(i);
                }
            })

            clientContacts.append(clientContactsList);
            clientString.append(clientContacts);
            clientString.append(btnGroup);
            tableBody.append(clientString);

        });
        load.style.display = 'none';
        main.append(addClientBtn);
    }
    createTableBody(clientsData.data);

    function createAddClientBtn() {
        const button = document.createElement('button');
        const p = document.createElement('p');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 23;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const path = document.createElementNS(xmlns, "path");
        path.setAttributeNS(null, 'd', 'M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z');
        path.setAttributeNS(null, 'fill', '#9873FF');

        button.classList.add('main__btn', 'main-btn', 'flex', 'btn-reset');
        svg.classList.add('main-btn__svg');
        p.classList.add('main-btn__text');

        p.textContent = 'Добавить клиента';

        svg.append(path);
        button.append(svg);
        button.append(p);

        button.addEventListener('click', () => {
            const newModal = createNewModal()
            if (newModal) main.append(newModal);
            modalBackground.classList.add('modal-background_is-open');
        })

        return button
    }

    function createTelIcon() {
        const contactItem = document.createElement('li');
        contactItem.classList.add('contact__item');
        const contactItemBtn = document.createElement('button');
        contactItemBtn.classList.add('contact__btn', 'btn-reset');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 16;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute('aria-label', 'Телефон');
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const g = document.createElementNS(xmlns, "g");
        g.setAttributeNS(null, 'opacity', '.7');

        const circle = document.createElementNS(xmlns, 'circle');
        circle.setAttributeNS(null, 'cx', boxWidth / 2);
        circle.setAttributeNS(null, 'cy', boxHeight / 2);
        circle.setAttributeNS(null, 'r', boxHeight / 2);
        circle.setAttributeNS(null, 'fill', 'var(--active-light-color)');

        const path = document.createElementNS(xmlns, "path");
        path.setAttributeNS(null, 'd', 'M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z');
        path.setAttributeNS(null, 'fill', 'white');

        g.append(circle);
        g.append(path);
        svg.append(g);
        contactItemBtn.append(svg);
        contactItem.append(contactItemBtn);

        return contactItem
    }

    function createEmailIcon() {
        const contactItem = document.createElement('li');
        contactItem.classList.add('contact__item');
        const contactItemBtn = document.createElement('button');
        contactItemBtn.classList.add('contact__btn', 'btn-reset');

        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 16;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute('aria-label', 'Email');
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const path = document.createElementNS(xmlns, "path");
        path.setAttributeNS(null, 'opacity', '.7');
        path.setAttributeNS(null, 'fill-rule', 'evenodd');
        path.setAttributeNS(null, 'clip-rule', 'evenodd');

        path.setAttributeNS(null, 'd', 'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z');
        path.setAttributeNS(null, 'fill', 'var(--active-light-color)');

        svg.append(path);
        contactItemBtn.append(svg);
        contactItem.append(contactItemBtn);

        return contactItem
    }

    function createManIcon() {
        const contactItem = document.createElement('li');
        contactItem.classList.add('contact__item');
        const contactItemBtn = document.createElement('button');
        contactItemBtn.classList.add('contact__btn', 'btn-reset');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 16;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute('aria-label', 'Контакт');
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const g = document.createElementNS(xmlns, "g");
        g.setAttributeNS(null, 'opacity', '.7');

        const path = document.createElementNS(xmlns, "path");

        path.setAttributeNS(null, 'fill-rule', 'evenodd');
        path.setAttributeNS(null, 'clip-rule', 'evenodd');
        path.setAttributeNS(null, 'd', 'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z');
        path.setAttributeNS(null, 'fill', 'var(--active-light-color)');

        g.append(path)
        svg.append(g);
        contactItemBtn.append(svg);
        contactItem.append(contactItemBtn);

        return contactItem
    }

    function createVkIcon() {
        const contactItem = document.createElement('li');
        contactItem.classList.add('contact__item');
        const contactItemBtn = document.createElement('button');
        contactItemBtn.classList.add('contact__btn', 'btn-reset');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 16;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute('aria-label', 'Vkontakte');
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const g = document.createElementNS(xmlns, "g");
        g.setAttributeNS(null, 'opacity', '.7');

        const path = document.createElementNS(xmlns, "path");

        path.setAttributeNS(null, 'd', 'M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z');
        path.setAttributeNS(null, 'fill', 'var(--active-light-color)');

        g.append(path)
        svg.append(g);
        contactItemBtn.append(svg);
        contactItem.append(contactItemBtn);

        return contactItem
    }

    function createFbIcon() {
        const contactItem = document.createElement('li');
        contactItem.classList.add('contact__item');
        const contactItemBtn = document.createElement('button');
        contactItemBtn.classList.add('contact__btn', 'btn-reset');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 16;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute('aria-label', 'Facebook');
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const g = document.createElementNS(xmlns, "g");
        g.setAttributeNS(null, 'opacity', '.7');

        const path = document.createElementNS(xmlns, "path");

        path.setAttributeNS(null, 'd', 'M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z');
        path.setAttributeNS(null, 'fill', 'var(--active-light-color)');

        g.append(path)
        svg.append(g);
        contactItemBtn.append(svg);
        contactItem.append(contactItemBtn);

        return contactItem
    }

    // sorting

    function sortingClients(sortBtn, sortBy) {
        const cellsActive = document.querySelectorAll('th.main-table__cell_active');
        cellsActive.forEach(cell => {
            cell.classList.remove(cellActive);
            cell.classList.remove('arrow-color_name');
        });
        const arrowsActive = document.querySelectorAll('svg.arrow-color');
        arrowsActive.forEach(arrow => {
            arrow.classList.remove('arrow-color');
        });
        sortBtn.classList.add(cellActive);
        let sortedClients = [];
        let isSortByName = sortBy === 'name';
        let arrow = sortBtn.querySelector('.main-table__header-arrow');

        if (!arrow.classList.contains('arrow-up')) {
            let sortFunction = isSortByName
                ? ((a, b) => `${a.surname}${a.name}${a.lastName}` > `${b.surname}${b.name}${b.lastName}` ? 1 : -1)
                : (a, b) => a[sortBy] > b[sortBy] ? 1 : -1;

            arrow.classList.add('arrow-up', 'arrow-color');
            if (isSortByName) {
                sortBtn.classList.add('arrow-color_name')
                sortBtn.classList.remove('arrow-down_name');
                sortBtn.classList.add('arrow-up_name');
            }
            sortedClients = [].concat(clientsData.data);
            sortedClients.sort(sortFunction);
        } else {
            let sortFunction = isSortByName
                ? ((a, b) => `${a.surname}${a.name}${a.lastName}` < `${b.surname}${b.name}${b.lastName}` ? 1 : -1)
                : (a, b) => a[sortBy] < b[sortBy] ? 1 : -1;

            arrow.classList.add('arrow-color');
            arrow.classList.remove('arrow-up');
            if (isSortByName) {
                sortBtn.classList.add('arrow-color_name')
                sortBtn.classList.remove('arrow-up_name');
                sortBtn.classList.add('arrow-down_name');
            }
            sortedClients = [].concat(clientsData.data);
            sortedClients.sort(sortFunction);
        }
        createTableBody(sortedClients);
    }

    idCell.addEventListener('click', () => {
        sortingClients(idCell, 'id');
    });

    nameCell.addEventListener('click', () => {
        sortingClients(nameCell, 'name');
    });

    changesCell.addEventListener('click', () => {
        sortingClients(changesCell, 'updatedAt');
    });

    creatingCell.addEventListener('click', () => {
        sortingClients(creatingCell, 'createdAt');
    });
    idCell.addEventListener('keypress', () => {
        sortingClients(idCell, 'id');
    });

    nameCell.addEventListener('keypress', () => {
        sortingClients(nameCell, 'name');
    });

    changesCell.addEventListener('keypress', () => {
        sortingClients(changesCell, 'updatedAt');
    });

    creatingCell.addEventListener('keypress', () => {
        sortingClients(creatingCell, 'createdAt');
    });
    sortingClients(idCell, 'id');

    // create modal

    function openChangeModal() {
        const changeModalElement = document.createElement('div');
        const changeModalElementTab = new modalWindow(document, changeModalElement);
        changeModalElementTab.createTabIndex();
        main.append(createChangeModalWithForm(changeModalElement, changeModalElementTab
            // clientHash
        ));

        const clientHash = window.location.hash.split('#')[1];
        loadClient(changeModalElement, changeModalElementTab, clientHash);
    }

    if (window.location.hash) openChangeModal();
    window.addEventListener('hashchange', () => openChangeModal());

    function createCloseBtn() {
        const btnWrapper = document.createElement('div');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 29;
        const boxHeight = 29;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const path = document.createElementNS(xmlns, "path");
        path.setAttributeNS(null, 'fill-rule', 'evenodd');
        path.setAttributeNS(null, 'clip-rule', 'evenodd');
        path.setAttributeNS(null, 'd', 'M22.2332 7.73333L21.2665 6.76666L14.4998 13.5334L7.73318 6.7667L6.76652 7.73336L13.5332 14.5L6.76654 21.2667L7.73321 22.2333L14.4998 15.4667L21.2665 22.2334L22.2332 21.2667L15.4665 14.5L22.2332 7.73333Z');
        path.setAttributeNS(null, 'fill', '#B0B0B0');

        btnWrapper.classList.add('modal__close-wrapper');

        svg.append(path);
        btnWrapper.append(svg);

        return btnWrapper
    }

    function createNewModalInput(inputContent) {
        const inputWrapper = document.createElement('div');
        const inputPlaceholder = document.createElement('div');
        const input = document.createElement('input');

        inputWrapper.classList.add('modal__input-wrapper', 'new-client__input-wrapper')
        inputPlaceholder.classList.add('modal__placeholder', 'new-client__placeholder')
        input.classList.add('modal__input', 'new-client__input');
        input.type = 'text';
        input.name = inputContent;

        validateNumberEnter(input);
        input.addEventListener('input', () => {
            if (input.value) {
                inputPlaceholder.style.display = 'none';
            } else inputPlaceholder.style.display = 'block';
            removeErrorMessage(`div[data-attr=${inputContent}]`);
        })

        inputWrapper.append(input);
        inputWrapper.append(inputPlaceholder);
        return { inputWrapper, inputPlaceholder, input }
    }

    function createContactClearBtn() {
        const btnWrapper = document.createElement('div');
        const xmlns = "http://www.w3.org/2000/svg";
        const boxWidth = 16;
        const boxHeight = 16;

        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svg.setAttributeNS(null, "width", boxWidth);
        svg.setAttributeNS(null, "height", boxHeight);
        svg.setAttributeNS(null, 'fill', 'none');

        const g = document.createElementNS(xmlns, "g");
        g.setAttributeNS(null, 'clip-path', 'url(#clip0_224_6681)');

        const path = document.createElementNS(xmlns, "path");
        path.setAttributeNS(null, 'd', 'M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z');
        path.setAttributeNS(null, 'fill', '#B0B0B0');

        const defs = document.createElementNS(xmlns, 'defs');
        const clipPath = document.createElementNS(xmlns, 'clipPath');

        clipPath.setAttributeNS(null, 'id', 'clip0_224_6681');

        const rect = document.createElementNS(xmlns, 'rect');
        rect.setAttributeNS(null, 'width', boxWidth);
        rect.setAttributeNS(null, "height", boxHeight);
        rect.setAttributeNS(null, 'fill', 'white');

        btnWrapper.classList.add('modal__clear-wrapper');

        g.append(path);
        svg.append(g);
        clipPath.append(rect);
        defs.append(clipPath);
        svg.append(defs);
        btnWrapper.append(svg);

        return btnWrapper
    }

    function createContactField(type = 'Телефон') {
        contactIdStart++;
        // select
        const contactWrapper = document.createElement('div');
        const contactsType = document.createElement('select');
        const contactTypeTel = document.createElement('option');
        const contactTypeSecondTel = document.createElement('option');
        const contactTypeMail = document.createElement('option');
        const contactTypeVk = document.createElement('option');
        const contactTypeFb = document.createElement('option');
        const contactTypeAnother = document.createElement('option');

        contactWrapper.classList.add('modal__contact-wrapper', 'flex');
        contactsType.classList.add('modal__select');
        contactTypeTel.classList.add('modal__select-item');
        contactTypeSecondTel.classList.add('modal__select-item');
        contactTypeMail.classList.add('modal__select-item');
        contactTypeVk.classList.add('modal__select-item');
        contactTypeFb.classList.add('modal__select-item');
        contactTypeAnother.classList.add('modal__select-item');

        contactTypeTel.textContent = 'Телефон';
        contactTypeSecondTel.textContent = 'Доп. телефон';
        contactTypeMail.textContent = 'Email';
        contactTypeVk.textContent = 'Vk';
        contactTypeFb.textContent = 'Facebook';
        contactTypeAnother.textContent = 'Другое';

        contactsType.append(contactTypeTel);
        contactsType.append(contactTypeSecondTel);
        contactsType.append(contactTypeMail);
        contactsType.append(contactTypeVk);
        contactsType.append(contactTypeFb);
        contactsType.append(contactTypeAnother);
        contactWrapper.append(contactsType);
        choices = new Choices(contactsType, {
            searchEnabled: false,
            itemSelectText: '',
        })
        choices.setChoiceByValue(type);

        // input

        const input = document.createElement('input');
        const clearBtn = document.createElement('button');
        const clearBtnSvg = createContactClearBtn();

        input.classList.add('modal__contact-input');
        input.setAttribute('contact-id', `${contactIdStart}`);
        clearBtn.classList.add('modal__clear-btn', 'btn-reset');

        input.placeholder = 'Введите данные контакта';
        clearBtn.type = 'button';

        contactWrapper.append(input);
        clearBtn.append(clearBtnSvg);

        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                contactWrapper.append(clearBtn);
            } else clearBtn.remove();

            const id = input.getAttribute('contact-id');
            removeErrorMessage(`div.error-message__content[contact-id='${id}']`);
        })

        //inputMask

        let inputmode;

        function setInputMask() {
            const contactType = contactWrapper.querySelector(`option`);
            switch (contactType.getAttribute('value')) {
                case 'Телефон': Inputmask(`+7 (999)-999-99-99`).mask(input);
                    inputmode = 'tel';
                    break;
                case 'Доп. телефон': Inputmask(`+7 (999)-999-99-99`).mask(input);
                    inputmode = 'tel';
                    break;
                case 'Email': Inputmask(`*{1,50}[.*{1,50}][.*{1,50}]@*{1,50}.*{1,20}[.*{1,20}][.*{1,20}]`).mask(input);
                    inputmode = 'email';
                    break;
                case 'Facebook': Inputmask(`f\\acebook.com/id99999999`).mask(input);
                    inputmode = 'fb';
                    break;
                case 'Vk': Inputmask(`vk.com/id99999999`).mask(input);
                    inputmode = 'vk';
                    break;
                case 'Другое': if (input.inputmask)
                    input.inputmask.remove();
                    inputmode = 'another';
                    break;
            }
            input.setAttribute('inputmode', inputmode);
        }
        setInputMask();

        contactsType.addEventListener('change', () => {
            setInputMask()
        })

        clearBtn.addEventListener('click', () => {
            const contactBtnField = document.querySelector('.modal__contacts-field_open');
            const addContactBtn = document.querySelector('.modal__add-contact_open');
            if (contactBtnField.childElementCount === 2) {
                contactBtnField.classList.remove('modal__contacts-field_open');
                addContactBtn.classList.remove('modal__add-contact_open');
            }
            if (contactBtnField.childElementCount < 12 & contactBtnField.lastChild.nodeName != 'BUTTON') {
                const newAddContactBtn = createAddContactBtn();
                newAddContactBtn.classList.add('modal__add-contact_open');
                contactBtnField.append(newAddContactBtn);
            }
            contactWrapper.remove();

            const id = input.getAttribute('contact-id');
            removeErrorMessage(`div.error-message__content[contact-id='${id}']`);
        })

        return { contactWrapper, input, clearBtn };
    }

    function createContactsData() {
        const contactsData = [];
        const contactsItem = document.querySelectorAll('.modal__contact-wrapper');
        contactsItem.forEach((contactItem) => {
            const option = contactItem.querySelector('option');
            const type = option.getAttribute('value');
            const input = contactItem.querySelector('input');
            contactsData.push({ type: type, value: input.value.trim() });
        });
        return contactsData
    }

    function createAddContactBtn() {
        const addContactBtn = document.createElement('button');
        const addContactBtnImg = document.createElement('img');
        const addContactBtnWord = document.createElement('p');

        addContactBtn.classList.add('modal__add-contact', 'new-client__add-contact', 'flex', 'btn-reset');
        addContactBtn.type = 'button';
        addContactBtnImg.classList.add('modal__add-contact-svg', 'new-client__add-contact-svg');
        addContactBtnImg.src = 'img/add_circle.svg';
        addContactBtnWord.classList.add('modal__add-contact-text', 'new-client__add-contact-text');

        addContactBtnWord.textContent = 'Добавить контакт';

        addContactBtn.append(addContactBtnImg);
        addContactBtn.append(addContactBtnWord);

        setTimeout(() => {
            const contactBtnField = document.querySelector('.modal__contacts-field');
            addContactBtn.addEventListener('click', () => {
                contactBtnField.classList.add('modal__contacts-field_open');
                addContactBtn.classList.add('modal__add-contact_open');

                const contactField = createContactField();
                addContactBtn.before(contactField.contactWrapper);
                // contactField.choices.focus({ focusVisible: true });
                if (contactBtnField.childElementCount === 11) addContactBtn.remove()
            })
        }, 100)
        return addContactBtn
    }

    // validation

    let isValid;

    function validateForm(contactBtnField, saveBtn, form) {
        function createErrorMessage(errorContent, attr) {
            isValid = false;
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message__content');
            errorMessage.textContent = `Ошибка: ${errorContent}`;
            contactBtnField.style.marginBottom = '0';
            errorMessage.setAttribute('data-attr', attr);
            saveBtn.before(errorMessage);
            return errorMessage
        }

        function validateNameInput(input, errorMessage1, errorMessage2, attr) {
            if (!input.value.trim()) {
                createErrorMessage(errorMessage1, attr);
                input.focus({ focusVisible: true });
            } else if (input.value.trim().length == 1 || input.value.trim().length == 2) {
                createErrorMessage(errorMessage2, attr);
                input.focus({ focusVisible: true });
            };
        }

        function validateMaskContactInput(selectorsArray, errorMessage, attr) {
            for (let i = 0; i < selectorsArray.length; i++) {
                const contactContent = selectorsArray[i].inputmask.unmaskedvalue();
                const contactId = selectorsArray[i].getAttribute('contact-id');
                if (contactContent.length < 4) {
                    const errorMessageItem = createErrorMessage(errorMessage, attr);
                    errorMessageItem.setAttribute('contact-id', contactId);
                    selectorsArray[i].focus({ focusVisible: true });
                }
            }
        }

        function validateUnmaskContactInput(selectorsArray, errorMessage, attr) {
            for (let i = 0; i < selectorsArray.length; i++) {
                const contactContent = selectorsArray[i].value.trim();
                const contactId = selectorsArray[i].getAttribute('contact-id');
                if (contactContent.length < 4) {
                    const errorMessageItem = createErrorMessage(errorMessage, attr);
                    errorMessageItem.setAttribute('contact-id', contactId);
                    selectorsArray[i].focus({ focusVisible: true });
                }
            }
        }

        isValid = true;
        const errorMessages = document.querySelectorAll('.error-message__content');
        errorMessages.forEach(message => {
            message.remove();
        })

        validateNameInput(form.surname, 'Поле "Фамилия" должно быть заполнено', 'Фамилия слишком короткая', 'surname')
        validateNameInput(form.name, 'Поле "Имя" должно быть заполнено', 'Имя слишком короткое', 'name')

        let telSelectorsArray = document.querySelectorAll("input[inputmode='tel']");
        for (let i = 0; i < telSelectorsArray.length; i++) {
            const phone = telSelectorsArray[i].inputmask.unmaskedvalue();
            const contactId = telSelectorsArray[i].getAttribute('contact-id');
            if (phone.length !== 10) {
                const errorMessageItem = createErrorMessage('Заполните телефон полностью', 'tel');
                errorMessageItem.setAttribute('contact-id', contactId);
                telSelectorsArray[i].focus({ focusVisible: true });
            }
        }

        validateMaskContactInput(document.querySelectorAll("input[inputmode='vk']"), 'Заполните контакт "Vk" полностью', 'vk');
        validateMaskContactInput(document.querySelectorAll("input[inputmode='email']"), 'Заполните контакт "Email" полностью', 'email');
        validateMaskContactInput(document.querySelectorAll("input[inputmode='fb']"), 'Заполните контакт "Facebook" полностью', 'fb');
        validateUnmaskContactInput(document.querySelectorAll("input[inputmode='another']"), 'Заполните контакт "Другое" полностью', 'another');
    }

    function removeAllOfModal(modalElement, modalElementTab) {
        setTimeout(() => { modalElement.classList.remove('modal_is-open'), 400 });
        setTimeout(() => modalElement.remove(), 500)
        modalBackground.classList.remove('modal-background_is-open');
        modalElementTab.removeTabIndex();
    }

    function createNewModal() {
        if (!document.querySelector('.new-client')) {
            const newClientModal = document.createElement('div');
            const newClientModalTab = new modalWindow(document, newClientModal);
            const title = document.createElement('h3');
            const closeBtn = document.createElement('button');
            const closeBtnWrapper = createCloseBtn();
            const form = document.createElement('form');
            const surnameField = createNewModalInput('surname');
            const nameField = createNewModalInput('name');
            const lastNameField = createNewModalInput('lastName');
            const contactBtnField = document.createElement('div');
            const addContactBtn = createAddContactBtn();
            const saveBtn = document.createElement('button');
            const cancelBtn = document.createElement('button');

            newClientModal.classList.add('modal', 'new-client');
            setTimeout(() => { newClientModal.classList.add('modal_is-open') });
            newClientModalTab.createTabIndex();
            title.classList.add('modal__title', 'new-client__title');
            closeBtn.classList.add('modal__close', 'new-client__close', 'btn-reset');
            form.classList.add('modal__form', 'new-client__form', 'flex');
            form.action = '#';
            form.method = 'post';
            surnameField.input.id = 'new-surname';
            nameField.input.id = 'new-name';
            lastNameField.input.style.marginBottom = '25px';
            contactBtnField.classList.add('modal__contacts-field', 'new-client__contacts-field');
            saveBtn.classList.add('primary-btn', 'new-client__save-btn', 'flex', 'btn-reset');
            saveBtn.type = 'submit';
            cancelBtn.classList.add('secondary-btn', 'new-client__cancel-btn', 'flex', 'btn-reset');
            cancelBtn.type = 'button';

            title.textContent = 'Новый клиент';
            surnameField.inputPlaceholder.textContent = 'Фамилия';
            nameField.inputPlaceholder.textContent = 'Имя';
            lastNameField.inputPlaceholder.textContent = 'Отчество';
            saveBtn.textContent = 'Сохранить';
            cancelBtn.textContent = 'Отмена';

            newClientModal.append(title);
            closeBtn.append(closeBtnWrapper);
            newClientModal.append(closeBtn);
            form.append(surnameField.inputWrapper);
            form.append(nameField.inputWrapper);
            form.append(lastNameField.inputWrapper);
            contactBtnField.append(addContactBtn);
            form.append(contactBtnField);
            form.append(saveBtn);
            form.append(cancelBtn);
            newClientModal.append(form);

            window.addEventListener('click', function (event) {
                if (event.target == modalBackground || event.target == cancelBtn) {
                    removeAllOfModal(newClientModal, newClientModalTab);
                }
            })

            document.onkeydown = function (event) {
                event = event || window.event;
                if (event.key === 'Escape') removeAllOfModal(newClientModal, newClientModalTab);
            }

            closeBtn.addEventListener('click', () => {
                removeAllOfModal(newClientModal, newClientModalTab);
            })

            async function postClientData() {
                const response = await fetch('http://localhost:3000/api/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: form.name.value.trim(),
                        surname: form.surname.value.trim(),
                        lastName: form.lastName.value.trim(),
                        contacts: createContactsData(),
                    })
                })
                return response
            }

            form.addEventListener('submit', async e => {
                e.preventDefault();

                validateForm(contactBtnField, saveBtn, form);

                if (isValid) {
                    main.append(protectiveShield);
                    const newClientResponse = await postClientData();
                    await submitForm(newClientResponse, newClientModal, newClientModalTab, contactBtnField, saveBtn);
                } else return
            });

            return newClientModal
        }
    }

    function validateNumberEnter(input) {
        input.addEventListener('keydown', function (e) {
            if (e.key) { if (e.key.match(/[0-9]/)) return e.preventDefault(); }
        }); // Будет перехватывать все числа при ручном вводе. 
        // Также нужна, чтобы replace не сбрасывал каретку, срабатывая каждый раз.

        input.addEventListener('input', function (e) {
            // На случай, если умудрились ввести через копипаст или авто-дополнение.
            input.value = input.value.replace(/[0-9]/g, "");
        });
    }

    function removeErrorMessage(selector) {
        const contactsField = document.querySelector('.modal__contacts-field');
        const errorMessage = document.querySelector(selector);
        const errorMessages = document.querySelectorAll('.error-message__content');
        if (errorMessage) {
            errorMessage.remove();
            if (errorMessages.length === 1) contactsField.style.marginBottom = '25px';
        }
    }

    function createChangeModalInput(inputContent) {
        const label = document.createElement('label');
        const span = document.createElement('span');
        const input = document.createElement('input');

        label.classList.add('change-client__label');
        span.classList.add('change-client__subscr');
        input.classList.add('modal__input', 'change-client__input');
        input.type = 'text';
        input.name = inputContent;

        validateNumberEnter(input);
        input.addEventListener('input', () => {
            removeErrorMessage(`div[data-attr=${inputContent}]`);
        })
        label.append(span);
        label.append(input);
        return { label, span, input }
    }

    async function submitForm(response, modalElement, modalElementTab, contactBtnField, saveBtn) {
        const errorMessages = document.querySelectorAll('.error-message__content');
        errorMessages.forEach(message => message.remove());

        const responseData = await response.json();
        protectiveShield.remove();
        if (response.status === 200 || response.status === 201) {
            removeAllOfModal(modalElement, modalElementTab);
            clientsData = await loadClientsData();
            createTableBody(clientsData.data);
            autocomplete(document.getElementById('headerInput'), clientsData.array);
        } else if (response.status === 404 || response.status === 422 || response.status >= 500) {
            responseData.errors.forEach(error => {
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message__content');
                errorMessage.textContent = `Ошибка: ${error.message}`;
                contactBtnField.style.marginBottom = '0';
                saveBtn.before(errorMessage);
            })
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message__content');
            errorMessage.textContent = 'Что-то пошло не так...';
            contactBtnField.style.marginBottom = '0';
            saveBtn.before(errorMessage);
        }
    }

    function loadClient(modalElement, modalElementTab, clientid) {
        const clientData = clientsData.data.find(client => client.id === clientid);
        const contactsArray = clientData.contacts;

        const closeBtn = document.querySelector('.change-client__close');
        const titleId = document.querySelector('.change-client__title-id');
        const form = document.getElementById('change-form');
        const surnameInput = document.querySelector('.change-client__input[name="surname"]');
        const nameInput = document.querySelector('.change-client__input[name="name"]');
        const lastNameInput = document.querySelector('.change-client__input[name="lastName"]');
        const contactBtnField = document.querySelector('.change-client__contacts-field');
        const addContactBtn = document.querySelector('.change-client__add-contact');
        const saveBtn = document.querySelector('.change-client__save-btn');
        const cancelBtn = document.querySelector('.change-client__cancel-btn');

        closeBtn.removeAttribute('disabled');
        titleId.innerHTML = `ID: ${clientData.id}`;
        surnameInput.value = clientData.surname;
        surnameInput.removeAttribute('disabled');
        nameInput.value = clientData.name;
        nameInput.removeAttribute('disabled');
        lastNameInput.value = clientData.lastName;
        lastNameInput.removeAttribute('disabled');
        addContactBtn.removeAttribute('disabled');
        saveBtn.removeAttribute('disabled');
        cancelBtn.removeAttribute('disabled');

        location.hash = `${clientData.id}`;

        if (contactsArray.length != 0) {
            contactBtnField.classList.add('modal__contacts-field_open');
            addContactBtn.classList.add('modal__add-contact_open');
        }
        contactsArray.forEach(contact => {
            type = contact.type;
            const contactItem = createContactField(type);
            if (contact.value.length > 0) {
                contactItem.contactWrapper.append(contactItem.clearBtn);
            } else contactItem.clearBtn.remove();
            contactItem.input.value = contact.value;
            addContactBtn.before(contactItem.contactWrapper);
            if (contactBtnField.childElementCount >= 11) addContactBtn.remove()
        })

        addContactBtn.addEventListener('click', () => {
            contactBtnField.classList.add('modal__contacts-field_open');
            addContactBtn.classList.add('modal__add-contact_open');

            const contactField = createContactField();
            addContactBtn.before(contactField.contactWrapper);
            if (contactBtnField.childElementCount >= 11) addContactBtn.remove()
        })

        form.addEventListener('submit', async e => {
            e.preventDefault();
            validateForm(contactBtnField, saveBtn, form);

            const data = {
                name: form.name.value.trim(),
                surname: form.surname.value.trim(),
                lastName: form.lastName.value.trim(),
                contacts: createContactsData(),
            };
            if (isValid) {
                main.append(protectiveShield);
                const saveResponse = await onSave(data, clientData.id, modalElement);
                await submitForm(saveResponse, modalElement, modalElementTab, contactBtnField, saveBtn);
                history.pushState("", document.title, window.location.pathname);
            } else return
        });

        cancelBtn.addEventListener('click', () => {
            main.append(createRemoveModal(clientData.id));
        });

    }

    function createChangeModalWithForm(modalElement, modalElementTab
        // clientId
    ) {
        modalBackground.classList.add('modal-background_is-open');
        const title = document.createElement('h3');
        const titleId = document.createElement('span');
        const closeBtn = document.createElement('button');
        const closeBtnWrapper = createCloseBtn();
        const form = document.createElement('form');
        const surnameLabel = createChangeModalInput('surname');
        const nameLabel = createChangeModalInput('name');
        const lastNameLabel = createChangeModalInput('lastName');
        const contactBtnField = document.createElement('div');
        const addContactBtn = document.createElement('button');
        const addContactBtnImg = document.createElement('img');
        const addContactBtnWord = document.createElement('p');
        const saveBtn = document.createElement('button');
        const cancelBtn = document.createElement('button');

        modalElement.classList.add('modal', 'change-client');
        setTimeout(() => { modalElement.classList.add('modal_is-open') }, 1);
        title.classList.add('modal__title', 'change-client__title', 'flex');
        titleId.classList.add('change-client__title-id');
        closeBtn.classList.add('modal__close', 'change-client__close', 'btn-reset')
        closeBtn.setAttribute('disabled', 'disabled');
        form.classList.add('modal__form', 'change-client__form', 'flex');
        form.setAttribute('id', 'change-form');
        form.action = '#';
        form.method = 'post';
        surnameLabel.span.classList.add('change-client__subscr-star');
        nameLabel.span.classList.add('change-client__subscr-star');
        contactBtnField.classList.add('modal__contacts-field', 'change-client__contacts-field');
        addContactBtn.classList.add('modal__add-contact', 'change-client__add-contact', 'flex', 'btn-reset');
        addContactBtn.type = 'button';
        addContactBtn.setAttribute('disabled', 'disabled');
        addContactBtnImg.classList.add('modal__add-contact-svg', 'change-client__add-contact-svg');
        addContactBtnImg.src = 'img/add_circle.svg';
        addContactBtnWord.classList.add('modal__add-contact-text', 'change-client__add-contact-text');
        saveBtn.classList.add('primary-btn', 'change-client__save-btn', 'flex', 'btn-reset');
        saveBtn.type = 'submit';
        saveBtn.setAttribute('disabled', 'disabled');
        cancelBtn.classList.add('secondary-btn', 'change-client__cancel-btn', 'flex', 'btn-reset');
        cancelBtn.type = 'button';
        cancelBtn.setAttribute('disabled', 'disabled');

        title.textContent = 'Изменить данные';
        titleId.innerHTML = `ID: `;
        surnameLabel.span.textContent = 'Фамилия';
        surnameLabel.input.setAttribute('disabled', 'disabled');
        nameLabel.span.textContent = 'Имя';
        nameLabel.input.setAttribute('disabled', 'disabled');
        lastNameLabel.span.textContent = 'Отчество';
        lastNameLabel.input.setAttribute('disabled', 'disabled');
        addContactBtnWord.textContent = 'Добавить контакт';
        saveBtn.textContent = 'Сохранить';
        cancelBtn.textContent = 'Удалить клиента';

        title.append(titleId);
        modalElement.append(title);
        closeBtn.append(closeBtnWrapper);
        modalElement.append(closeBtn);
        form.append(surnameLabel.label);
        form.append(nameLabel.label);
        form.append(lastNameLabel.label);
        addContactBtn.append(addContactBtnImg);
        addContactBtn.append(addContactBtnWord);
        contactBtnField.append(addContactBtn);
        form.append(contactBtnField);
        form.append(saveBtn);
        form.append(cancelBtn);
        modalElement.append(form);

        window.addEventListener('click', function (event) {
            if (event.target == modalBackground) {
                removeAllOfModal(modalElement, modalElementTab);
                if (window.location.hash) {
                    history.pushState("", document.title, window.location.pathname);
                }
            }
        });

        document.onkeydown = function (event) {
            event = event || window.event;
            if (event.key === 'Escape') {
                removeAllOfModal(modalElement, modalElementTab);
                if (window.location.hash) {
                    history.pushState("", document.title, window.location.pathname);
                }
            }
        }

        closeBtn.addEventListener('click', () => {
            removeAllOfModal(modalElement, modalElementTab);
            if (window.location.hash) {
                history.pushState("", document.title, window.location.pathname);
            }
        });

        cancelBtn.addEventListener('click', () => {
            removeAllOfModal(modalElement, modalElementTab);
        });

        return modalElement;
    }

    async function onSave(formData, clientId) {
        const response = await fetch(`https://clients-d-ch-a05d87fdc1be.herokuapp.com/api/clients/${clientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                surname: formData.surname,
                lastName: formData.lastName,
                contacts: createContactsData(),
            })
        })
        return response
    }

    function createRemoveModal(clientId) {
        if (!document.querySelector('.remove-client')) {
            modalBackground.classList.add('modal-background_is-open');
            const removeModalElement = document.createElement('div');
            const removeModalElementTab = new modalWindow(document, removeModalElement);
            const title = document.createElement('h3');
            const closeBtn = document.createElement('button');
            const closeBtnWrapper = createCloseBtn();
            const mainRemoveModal = document.createElement('p');
            const removeBtn = document.createElement('button');
            const cancelBtn = document.createElement('button');

            removeModalElement.classList.add('modal', 'remove-client');
            setTimeout(() => { removeModalElement.classList.add('modal_is-open'), 1 })
            removeModalElementTab.createTabIndex();
            title.classList.add('modal__title', 'remove-client__title');
            closeBtn.classList.add('modal__close', 'remove-client__close', 'btn-reset')
            mainRemoveModal.classList.add('remove-client__text');
            removeBtn.classList.add('primary-btn', 'remove-client__save-btn', 'flex', 'btn-reset');
            removeBtn.type = 'button';
            cancelBtn.classList.add('secondary-btn', 'remove-client__cancel-btn', 'flex', 'btn-reset');
            cancelBtn.type = 'button';

            title.textContent = 'Удалить клиента';
            mainRemoveModal.textContent = 'Вы действительно хотите удалить данного клиента?';
            removeBtn.textContent = 'Удалить';
            cancelBtn.textContent = 'Отмена';

            removeModalElement.append(title);
            closeBtn.append(closeBtnWrapper);
            removeModalElement.append(closeBtn);
            removeModalElement.append(mainRemoveModal);
            removeModalElement.append(removeBtn);
            removeModalElement.append(cancelBtn);

            history.pushState("", document.title, window.location.pathname);

            removeBtn.addEventListener('click', async () => {
                await fetch(`http://localhost:3000/api/clients/${clientId}`, {
                    method: 'DELETE',
                });
                removeAllOfModal(removeModalElement, removeModalElementTab);
                clientsData = await loadClientsData();
                createTableBody(clientsData.data);
                autocomplete(document.getElementById('headerInput'), clientsData.array);
            });

            window.addEventListener('click', function (event) {
                if (event.target == modalBackground || event.target == cancelBtn) {
                    removeAllOfModal(removeModalElement, removeModalElementTab);
                }
            });

            document.onkeydown = function (event) {
                event = event || window.event;
                if (event.key === 'Escape') {
                    removeAllOfModal(removeModalElement, removeModalElementTab);
                }
            }

            closeBtn.addEventListener('click', () => {
                removeAllOfModal(removeModalElement, removeModalElementTab);
            })

            return removeModalElement
        }
    }
})()