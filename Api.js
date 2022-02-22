const onError = (response) => {
    if (response.ok) {
        return response.json()
    }
    return Promise.reject({
                        message: 'Сервер не доступен',
                        error: response
                        })
}

class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    getAllCats() {
        return fetch(`${this._url}/show`)
            .then(onError)
    }

    getCatById(value) {
        return fetch(`${this._url}/show/${value}`)
            .then(onError)
    }

    addCat(bodyData) {
        return fetch(`${this._url}/add`, {
                method: "POST",
                headers: this._headers,
                body: JSON.stringify(bodyData)
            })
            .then(onError)
    }

    updateCat(value, bodyData) {
        return fetch(`${this._url}/update/${value}`, {
                method: "PUT",
                headers: this._headers,
                body: JSON.stringify(bodyData)
            })
            .then(onError)
    }

    deleteCat(value) {
        return fetch(`${this._url}/delete/${value}`, {
                method: "DELETE",
                headers: this._headers,
            })
            .then(onError)
    }
}

const api = new Api({
    url: 'https://sb-cats.herokuapp.com/api',
    headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
    }
})