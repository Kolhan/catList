let main = document.querySelector('main')
let modal = document.querySelector('.info-block')

let catList = []

function createCards(arr) {
    
    for (let index = 0; index < arr.length; index++) {
        const cat = arr[index]
        // console.log(cat)

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

function onClick(index) {
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

function closeInfo() {
    modal.classList.remove('active')
}


fetch(`https://sb-cats.herokuapp.com/api/show`).then((dataResult) => {
    dataResult.json().then((result) => {
        console.log(result)
        catList = result.data
        createCards(result.data)
    })
})


