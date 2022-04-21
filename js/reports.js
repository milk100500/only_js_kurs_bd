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
const content = document.querySelector('.content')
const reports = document.querySelector('.reports')
const modalWindow = {
    node: document.querySelector('.window'),
    state: false
}
const exit = document.querySelector('.function_open_exit')
const name = document.querySelector('.name')
const buttonOk = document.querySelector('.modal-window_button-ok')
const coks = document.querySelector('.coke')
const modalOk = document.querySelector('.ok')
let report


buttonOk.addEventListener('click', changeModalWindowState)
reports.addEventListener('input', checkReportSymbols)
burger.node.addEventListener('click', () => {burger.changeState()})
exit.addEventListener('click', () => {burger.changeState()})
coks.addEventListener('click', sendReport)


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
        //window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
    }
}).then((body) => {
    name.innerHTML = body
}).catch(() => {
    //window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
})


function changeModalWindowState() {
    modalWindow.state = !modalWindow.state
    if (modalWindow.state){
        modalWindow.node.style.opacity = 1
        modalWindow.node.style.pointerEvents = 'auto'
        document.body.style.overflowY = 'hidden'
        reports.blur()
    } else {
        modalWindow.node.style.opacity = 0
        modalWindow.node.style.pointerEvents = 'none'
        content.style.pointerEvents = 'auto'
        document.body.style.overflowY = 'scroll'
    }
}

function checkReportSymbols() {
    report = reports.value
    if (report.length > 10){
        changeModalWindowState()
    }
}

async function sendReport() {
    coks.style.pointerEvents = 'none'
    await fetch('http://localhost:17627/api/application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'report': report})
    }).then((response) => {
        if (response.ok){
            modalOk.querySelector('img').src = '../content/ok.png'
            modalOk.style.border = '#2ecc71 solid 25px'
            modalOk.style.left = '50%'
        } else {
            modalOk.querySelector('img').src = '../content/krest2.png'
            modalOk.style.border = '#ca1413 solid 25px'
            modalOk.style.left = '50%'
        }
        setTimeout(() => {
            modalOk.style.left = '-50%'
        }, 2000)
    }).catch(() => {
        modalOk.querySelector('img').src = '../content/krest2.png'
        modalOk.style.border = '#ca1413 solid 25px'
        modalOk.style.left = '50%'
        coks.style.pointerEvents = 'none'
        setTimeout(() => {
            modalOk.style.left = '-50%'
        }, 2000)
    })
    setTimeout(() => {
        coks.style.pointerEvents = 'auto'
    }, 2000)
}
