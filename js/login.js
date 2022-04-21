'use strict';


const loginNode = document.querySelector('.login')
const passwordNode = document.querySelector('.password')
const sendButton = document.querySelector('.send_login')
const errorNode = document.querySelector('.error')
let user = {
    login: loginNode.value,
    password: passwordNode.value
}


sendButton.addEventListener('click', sendLoginFunction)
loginNode.addEventListener('input', updateForm)
passwordNode.addEventListener('input', updateForm)


function updateForm() {
    user.login = loginNode.value
    user.password = passwordNode.value
}



function sendLoginFunction() {
    fetch('http://localhost:63342/only_js_kurs_bd/html/xyi',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        }).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            showError('Неверный логин или пароль')
        }
    }).then((body) => {
        let arrayBody = body['role'].split('')
        switch (arrayBody[0]) {
            case 'H':
                replaceUser('https://se.ifmo.ru/~s286535/html/applications.html', body)
                break
            case 'S':
                replaceUser('https://se.ifmo.ru/~s286535/html/reports.html', body)
                break
            case 'A':
                replaceUser('https://se.ifmo.ru/~s286535/html/buy_share.html', body)
                break
            case 'J':
                replaceUser('https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D0%BB%D0%BE%D0%BA%D0%BE%D1%81%D1%82', body)
                break
        }
    }).catch(() => {
            showError('Что-то пошло не так')
        }
    )
}

function showError(textError){
    errorNode.innerHTML = String(textError)
}

function replaceUser(url, body) {
    sessionStorage.clear()
    sessionStorage.setItem('token', body['token'])
    sessionStorage.setItem('role', body['role'])
    window.location.replace(url)
}
