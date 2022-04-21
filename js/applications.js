const content = document.querySelector('.content')
const container = document.querySelector('.container')
const table = document.querySelector('.table')
const ok = document.querySelector('.ok')
const krest = document.querySelector('.krest')
const modalWindowResult = document.querySelector('.modal_window_result')
const exit = document.querySelector('.function_open_exit')
const name = document.querySelector('.name')
const burger = {
    node: document.querySelector('.function_burger'),
    state: true,
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
const loadingInterval = setInterval(() => {
    loading(container.children[0], loadingInterval)
}, 500)


burger.node.addEventListener('click', () => {burger.changeState()})
exit.addEventListener('click', () => {burger.changeState()})


fetch('http://localhost:17627/api/user-credentials', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
    }
}).then((response) => {
    if (response.ok){
        for (let item of container.children) {
            if (item.className === 'loading') {
                item.style.display = 'none'
                continue
            }
            item.style.display = 'flex'
        }
        return response.text()
    } else {
        window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
    }
}).then((body) => {
    name.innerHTML = body
}).catch(() =>{
    window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
}).finally(() => {
    clearInterval(loadingInterval)
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
    addRow(body)
})


function addRow(body) {
    let row
    let textRow
    body.forEach(elem => {
        row = document.createElement('div')
        row.className = 'row'
        textRow = '<span class="id">' + elem['id'] + '</span>' + '<span class="name">' + elem['name'] + '</span>' + '<span class="surname">' + elem['surname'] + '</span>' + '<span class="phone">' + elem['phoneNumber'] + '</span>' + '<span class="education">' + elem['education'] + '</span>' + '<span class="about">' + elem['aboutYourself'] + '</span>' +
            '<span class="responses"><img class="ok" src="../content/ok.png"/><img class="krest" src="../content/krest2.png"/></span>'
        row.innerHTML = textRow
        table.append(row)
    })
}
document.onclick = function( e ) {
    if (e.target.className === 'ok') {
        sendResult(true, e)
    }
    if (e.target.className === 'krest'){
        sendResult(false, e)
    }
}
function sendResult(result, e) {
    let id = e.target.parentElement.parentElement.querySelector('.id').innerHTML
    sendResultFunc(id, result, e)
    e.target.parentElement.parentElement.style.pointerEvents = 'none'
    e.target.style.transform = 'scale(1.5)'
    setTimeout(() => {
        e.target.style.transform = 'scale(1)'
    }, 300)
}

function sendResultFunc(id, result, e) {
    let resultStr
    if (result){
        resultStr = 'true'
    } else {
        resultStr = 'false'
    }
    fetch('http://localhost:17627/api/application/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify({'reason': resultStr})
    }).then((response) => {
        if (response.ok){
            openModalWindowResult(result, e)
        } else {
            openModalWindowResult("Что-то пошло не так", e)
        }
    }).catch(() => {
        openModalWindowResult("Что-то пошло не так", e)
    })
}

function openModalWindowResult(result, e) {
    if (typeof result === 'string') {
        changeModalWindowResult('#ca1413 solid 10px', '../content/problema.jpg', result, false, e)
    } else {
        if (result) {
            changeModalWindowResult('#2ecc71 solid 10px', '../content/prinat.jpg', 'Ублюдок принят на работу',
                true, e)
        } else {
            changeModalWindowResult('#ca1413 solid 10px', '../content/neprinat.jpg', 'Ублюдок не принят на работу',
                true, e)
        }
    }
    setTimeout(() => {
        modalWindowResult.style.opacity = '1'
    }, 1000)
    setTimeout(() => {
        modalWindowResult.style.opacity = '0'
        e.target.parentElement.parentElement.style.pointerEvents = 'auto'
    }, 2500)
}

function changeModalWindowResult(border, img, text, result_anim, e) {
    if (result_anim) {
        modalWindowResult.style.border = border
        modalWindowResult.querySelector('.modal_window_result_img').src = img
        modalWindowResult.querySelector('.modal_window_result_text').innerHTML = text
        setTimeout(() => {
            e.target.parentElement.parentElement.style.transform = 'scale(0)'
        }, 400)
        setTimeout(() => {
            e.target.parentElement.parentElement.remove()
        }, 800)
    } else {
        modalWindowResult.style.border = border
        modalWindowResult.querySelector('.modal_window_result_img').src = img
        modalWindowResult.querySelector('.modal_window_result_text').innerHTML = text
    }
}

function loading(loading) {
    if (loading.querySelector('.loading-content span').innerHTML.length < 3) {
        loading.querySelector('.loading-content span').append('.')
    } else {
        loading.querySelector('.loading-content span').innerHTML = ''
    }
}