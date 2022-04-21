const content = document.querySelector('.content')
const table = document.querySelector('.table')
const ok = document.querySelector('.ok')
const krest = document.querySelector('.krest')
const modal_window_result = document.querySelector('.modal_window_result')
const exit = document.querySelector('.function_open_exit')
const name = document.querySelector('.name')
const burger = {
    node: document.querySelector('.function_burger'),
    state: false,
    changeState(){
        this.state = !this.state
        if (this.state){
            functionsBlock.style.display = 'none'
        } else {
            functionsBlock.style.display = 'flex'
        }
    }
}
const functionsBlock = document.querySelector('.function_open')


burger.addEventListener('click', () => {burger.changeState()})
exit.addEventListener('click', () => {burger.changeState()})


fetch('http://localhost:17627/api/user-credentials', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
    }
}).then((response) => {
    if (response.ok){
        return response.text()
    } else {
        window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
    }
}).then((body) => {
    name.innerHTML = body
})
fetch('http://localhost:17627/api/application', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': sessionStorage.getItem('token')
    }
}).then((response) => {
    if (response.ok){
        return response.json()
    } else {
        window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
    }
}).then((body) => {
    add_row(body)
})


function add_row(body) {
    let row
    let text_row
    body.forEach(elem => {
        row = document.createElement('div')
        row.className = 'row'
        text_row = '<span class="id">' + elem['id'] + '</span>' + '<span class="name">' + elem['name'] + '</span>' + '<span class="surname">' + elem['surname'] + '</span>' + '<span class="phone">' + elem['phoneNumber'] + '</span>' + '<span class="education">' + elem['education'] + '</span>' + '<span class="about">' + elem['aboutYourself'] + '</span>' +
            '<span class="responses"><img class="ok" src="../content/ok.png"/><img class="krest" src="../content/krest2.png"/></span>'
        row.innerHTML = text_row
        table.append(row)
    })
}
document.onclick = function( e ) {
    if (e.target.className === 'ok') {
        send_result(true, e)
    }
    if (e.target.className === 'krest'){
        send_result(false, e)
    }
}
function send_result(result, e) {
    let id = e.target.parentElement.parentElement.querySelector('.id').innerHTML
    send_result_func(id, result, e)
    e.target.parentElement.parentElement.style.pointerEvents = 'none'
    e.target.style.transform = 'scale(1.5)'
    setTimeout(() => {
        e.target.style.transform = 'scale(1)'
    }, 300)
}

function send_result_func(id, result, e) {
    let result_str
    if (result){
        result_str = 'true'
    } else {
        result_str = 'false'
    }
    fetch('http://localhost:17627/api/application/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify({'reason': result_str})
    }).then((response) => {
        if (response.ok){
            open_modal_window_result(result, e)
        } else {
            open_modal_window_result("Что-то пошло не так", e)
        }
    }).catch(() => {
        open_modal_window_result("Что-то пошло не так", e)
    })
}

function open_modal_window_result(result, e) {
    if (typeof result === 'string') {
        change_modal_window_result('#ca1413 solid 10px', '../content/problema.jpg', result, false, e)
    } else {
        if (result) {
            change_modal_window_result('#2ecc71 solid 10px', '../content/prinat.jpg', 'Ублюдок принят на работу',
                true, e)
        } else {
            change_modal_window_result('#ca1413 solid 10px', '../content/neprinat.jpg', 'Ублюдок не принят на работу',
                true, e)
        }
    }
    setTimeout(() => {
        modal_window_result.style.opacity = '1'
    }, 1000)
    setTimeout(() => {
        modal_window_result.style.opacity = '0'
        e.target.parentElement.parentElement.style.pointerEvents = 'auto'
    }, 2500)
}

function change_modal_window_result(border, img, text, result_anim, e) {
    if (result_anim) {
        modal_window_result.style.border = border
        modal_window_result.querySelector('.modal_window_result_img').src = img
        modal_window_result.querySelector('.modal_window_result_text').innerHTML = text
        setTimeout(() => {
            e.target.parentElement.parentElement.style.transform = 'scale(0)'
        }, 400)
        setTimeout(() => {
            e.target.parentElement.parentElement.remove()
        }, 800)
    } else {
        modal_window_result.style.border = border
        modal_window_result.querySelector('.modal_window_result_img').src = img
        modal_window_result.querySelector('.modal_window_result_text').innerHTML = text
    }
}