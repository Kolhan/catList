let main = document.querySelector('main')
let modal = document.querySelector('.info-block')

let catList = []

//создаём карточки котов
function createCards(arr) {
    
    for (let index = 0; index < arr.length; index++) {
        const cat = arr[index]

        //Если у кота нет имени 
        if (cat.name == undefined || cat.name == '') {
            cat.name = `<Бродячий котЭ>`
        }

        //Если у кота нет возраста 
        if (cat.age == undefined || cat.age == '') {
            cat.age = `<никто не знает возраст>`
        } else cat.age =  cat.age + ' год'

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

        card.addEventListener('click', () => { onClick(index); } )
    
        // Картинка
        let imgCard = document.createElement('img')
        imgCard.className ='card-img'
        imgCard.style.backgroundImage = `url(${cat.img_link})`
        card.append(imgCard)
    
        // Имя
        let h3 = document.createElement('h3')
        h3.innerText = cat.name
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
    
    }
}



//клик по карточке
function onClick(index) {
    const cat = catList[index];
    
    let infoImg = document.querySelector('.info-img')
    infoImg.src = `${cat.img_link}`

    let h2 = document.querySelector('.information h2')
    h2.innerText = cat.name

    let h3 = document.querySelector('.information h3')
    h3.innerText = cat.age

    let p = document.querySelector('.information p')
    p.innerText = cat.description

    modal.classList.add('active')
}

//закрыть окно
function closeInfo() {
    modal.classList.remove('active')
}

//отправляем зпрос
fetch(`https://sb-cats.herokuapp.com/api/show`).then((dataResult) => {
    dataResult.json().then((result) => {
        catList = result.data //использую в onClick
        createCards(catList)
    })
})


