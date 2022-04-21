const container = document.querySelector('.container')
const functionsBlock = document.querySelector('.function_open');
const burger = {
    node: document.querySelector('.function_burger'),
    state: true,
    changeState() {
    this.state = !this.state
    if (this.state) {
        functionsBlock.style.display = 'none'
    } else {
        functionsBlock.style.display = 'flex'
    }
}
}
const exit = document.querySelector('.function_open_exit');
const table = document.querySelector('.table');
const name = document.querySelector('.name');
let loadingInterval = setInterval(() => {
    loading(container.children[0], loadingInterval)
}, 500)


burger.node.addEventListener('click', () => {burger.changeState()})
exit.addEventListener('click', () => {burger.changeState()})

//http://localhost:17627/api/seller/courses
fetch('http://localhost:17627/api/user-credentials', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
    }
}).then((response) => {
    if (response.ok) {
        return response.text()
    } else {
        //window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
    }
}).then((body) => {
    name.innerHTML = body
}).catch(() => {
    for (let item of container.children) {
        if (item.className === 'loading') {
            item.style.display = 'none'
            continue
        }
        item.style.display = 'flex'
    }
    //window.location.replace('https://se.ifmo.ru/~s286535/html/login.html')
}).finally(() => {
    clearInterval(loadingInterval)
})


//http://localhost:17627/api/courses
//http://localhost:63342/only_js_kurs_bd/html/xyi
fetch('http://localhost:17627/api/courses', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': sessionStorage.getItem('token')
    }
}).then((response) => {
    if (response.ok) {
        return response.json()
    } else {

    }
}).then((body) => {
    addRow(body)
})


function addRow(body) {
    let row
    let textRow
    body.forEach(elem => {
        row = document.createElement('div')
        textRow = '<span>' + elem['name'] + '</span>' + '<span>' + 'Цена: ' + elem['price'] + '$' + '</span>'
        row.className = 'row'
        row.innerHTML = textRow
        table.append(row)
    })
}

function loading(loading) {
    if (loading.querySelector('.loading-content span').innerHTML.length < 3) {
        loading.querySelector('.loading-content span').append('.')
    } else {
        loading.querySelector('.loading-content span').innerHTML = ''
    }
}
