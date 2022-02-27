let catList = []
let user = Cookies.get('user')
let localStorage = window.localStorage

let main = document.querySelector('main')


//Дорисовываем кнопки для админа
renderUI(Boolean(user))

//создаём карточки котов
function createCards(arr) {

    main.innerHTML = ''
    
    for (let index = 0; index < arr.length; index++) {
        const cat = arr[index]

        //Если у кота нет имени, то его не существует (кот Шрёдингера, в базе есть, а данные не заполнены), пропускаем такого
        if (cat.name == undefined || cat.name == '') continue

        //Если у кота нет возраста 
        if (cat.age == undefined || cat.age == '') {
            cat.age = `<никто не знает возраст>`
        } 

        //Если картинка отстуствует ставим по умолчанию
        if (cat.img_link == undefined || cat.img_link == '') {
            cat.img_link = `https://www.pngitem.com/pimgs/m/173-1730291_black-cat-black-and-animal-shadow-clipart-of.png`
        }

        //Если описание отстуствует ставим по умолчанию
        if (cat.description == undefined || cat.description == '') {
            cat.description = `<не описуемой красоты>`
        }


        let card = document.createElement('div')
        card.className ='card'
        card.id = index
        main.append(card)

        card.addEventListener('click', () => { openModalInfo(index); } )
    
        // Картинка
        let imgCard = document.createElement('img')
        imgCard.className ='card-img'
        imgCard.style.backgroundImage = `url(${cat.img_link})`
        card.append(imgCard)
    
        // Имя
        let h3 = document.createElement('h3')
        h3.innerHTML = cat.name + (cat.favourite?` &#10084;`:'')
        card.append(h3)
    
        // Рейтинг
        let p = document.createElement('p')
        p.className ='rate'
        card.append(p)
        
        let rate = cat.rate
        for (let index = 1; index <= 10; index++) {
            let img = document.createElement('img')
    
            if (index <= rate) {
                img.src = `img/cat-fill.svg`
                img.alt = `^_^`
            } else {
                img.src = `img/cat-stroke.svg`
                img.alt = `O_o`
            }
            p.append(img)
        }

        if (user) {
            //панель с конками
            let btnCard = document.createElement('div')
            btnCard.className = 'btn_card'
            card.append(btnCard)

            // Кнопка удалить
            let btnDel = document.createElement('button')
            btnDel.innerHTML = 'удалить'
            btnDel.id = index
            btnCard.append(btnDel)

            btnDel.onclick = function(event) {
                let index = event.target.id
                let resultConfirm = confirm(`Действительно хочешь удалить кота ${catList[index].name}?`)
                if (resultConfirm) {
                    delCat(index)
                }

                event.stopPropagation()
            };

            // Кнопка изменить
            let btnUpd = document.createElement('button')
            btnUpd.innerHTML = 'изменить'
            btnUpd.id = index
            btnCard.append(btnUpd)

            btnUpd.onclick = function(event) {
                let index = event.target.id

                //заполняем окно для редактирования
                let modal = document.querySelector('#modal_upd')

                const inputs = modal.querySelectorAll('.input-form')
                inputs.forEach(input => {
                    if (input.name === 'favourite') {
                        input.checked = (catList[index])[input.name];
                    } else {
                        input.value = (catList[index])[input.name]
                    }
                })
                
                modal.classList.add('active')

                event.stopPropagation()
            };
        }


    }
}

//клик по карточке
function openModalInfo(index) {
    let modal = document.querySelector('#modal_info')

    const cat = catList[index];
    
    let infoImg = document.querySelector('.info-img')
    infoImg.src = `${cat.img_link}`

    let h2 = document.querySelector('.information h2')
    h2.innerText = cat.name

    let h3 = document.querySelector('.information h3')
    h3.innerText = cat.age + ' год'

    let p = document.querySelector('.information p')
    p.innerText = cat.description

    modal.classList.add('active')
}

function openModalAdd() {
    let modal = document.querySelector('#modal_add')

    modal.classList.add('active')
}

//закрыть окно
function closeInfo(e) {    
    let _elm = e.target.closest('.info-block') //ищем нужного родителя среди всех родителей
    _elm.classList.remove('active')
}

//запрос списка котов с сервера
function getCatListFromServer() {
    fetch(`https://sb-cats.herokuapp.com/api/show`).then((dataResult) => {
        dataResult.json().then((result) => {
            catList = result.data //использую в onClick
            // сохраняем результат в localStorage
            localStorage.catList = JSON.stringify(catList)
            createCards(catList) // рисуем карточки
        })
    })
}

//запрос на удаление кота с сервера
function delCat(index) {
    let cat = catList[index]
    console.log(cat);

    if  (user) {
        // catList.splice(index, 1);
        // createCards(catList) // рисуем карточки

        api.deleteCat(cat.id).then(result =>{
            catList.splice(index, 1);
            // catList = result.data //использую в onClick
            // сохраняем результат в localStorage
            localStorage.catList = JSON.stringify(catList)
            createCards(catList) // рисуем карточки
        })
    } else { alert('Операция запрещена для не авторизованного пользователя') }

}



// проверка наличия сохраняённой локальной копии
if (window.localStorage.catList == undefined) {
    //отправляем запрос
    getCatListFromServer()
} else {
    // загружаем из localStorage
    catList = JSON.parse(window.localStorage.catList)           
    createCards(catList) // рисуем карточки
}

// перерисовка по авторизации
function renderUI(isLogin) {
    let btnLogin = document.querySelector('.btn__auth') 
    let btnNewCat = document.querySelector('.btn__newCat')
    if (isLogin) { 
        btnLogin.innerText = 'Выйти'
        btnNewCat.classList.remove('hide')
    } else { 
        btnLogin.innerText = 'Авторизоваться' 
        btnNewCat.classList.add('hide')
    }

    createCards(catList)
}

// кнопка авторизации
let btnLogin = document.querySelector('.btn__auth') 
btnLogin.addEventListener('click', (e) => {
    if (!user) {
        Cookies.set('user', 'админ', {secure: true, samesite: 'lax'})
    } else {
        Cookies.remove('user')
    }
    user = Cookies.get('user')
    renderUI(Boolean(user))
})

// кнопка обновить список
let btnRefreshCatList = document.querySelector('.btn__refreshCatList') 
btnRefreshCatList.addEventListener('click', (e) => {
    getCatListFromServer()
})

let btnNewCat = document.querySelector('.btn__newCat') 
btnNewCat.addEventListener('click', (e) => { openModalAdd(); } )

//кнопка добавить нового кота
const formAdd = document.querySelector('#addCat');
const inputsAdd = formAdd.querySelectorAll('.input-form');
formAdd.addEventListener('submit', (e)=> {
    e.preventDefault();
    const bodyJSON = {};
    inputsAdd.forEach((input) => {
        if (input.name === 'favourite') {
            bodyJSON[input.name] = input.checked;
        } else {
            bodyJSON[input.name] = input.value;
        }
    })

    let id = getNextId()
    console.log(id);

    bodyJSON['id'] = id;

    api.addCat(bodyJSON).then(data =>{
        if(data.message !== 'ok') {
            alert('Невозможно создать кота')
        } else {
            localStorage.clear();
            getCatListFromServer()
            createCards(catList)

            e.target.reset()
            let modal = document.querySelector('#modal_add')
            modal.classList.remove('active')
        }
    })
})

//кнопка изменить кота
const formUpd = document.querySelector('#updCat');
const inputsUpd = formUpd.querySelectorAll('.input-form');
formUpd.addEventListener('submit', (e)=> {
    e.preventDefault();
    const bodyJSON = {};
    inputsUpd.forEach((input) => {
        if (input.name === 'favourite') {
            bodyJSON[input.name] = input.checked;
        } else {
            bodyJSON[input.name] = input.value;
        }
    })

    // let id = getNextId()
    // console.log(id);

    // bodyJSON['id'] = id;

    api.updateCat(bodyJSON.id, bodyJSON).then(data =>{
        if(data.message !== 'ok') {
            alert('Невозможно изменить кота')
        } else {
            localStorage.clear();
            getCatListFromServer()
            createCards(catList)

            e.target.reset()
            let modal = document.querySelector('#modal_upd')
            modal.classList.remove('active')
        }
    })
})

//вычисляем следующий id
function getNextId() {
    let result  = 0
    catList.map((elm) => {
        if  (elm.id != undefined) {
            if (elm.id>result) result = elm.id
        }
    })
    return result + 1
} 





