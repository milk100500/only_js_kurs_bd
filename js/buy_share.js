let stock = ['Атмосфера ВТ!!!', 'Дэн дэн дэн', 'Apple', 'Gazprom', 'Леха бомжара', 'Леха воняет']
const container = document.querySelector('.container')
let stockName;
let stockPrice;
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
const exit = document.querySelector('.function_open_exit')
const coke = document.querySelector('.coke')
const stockInput = document.querySelector('#input_stock')
const stockInputPrice = document.querySelector('.input_price')
const modalOk = document.querySelector('.modal-ok')
const loadingInterval = setInterval(() => {
    loading(container.children[0], loadingInterval)
}, 500)


burger.node.addEventListener('click', () => {burger.changeState()})
exit.addEventListener('click', () => {burger.changeState()})


coke.addEventListener('click', sendReport)
stockInput.addEventListener('input', () => {
    stockName = stockInput.value
})
stockInputPrice.addEventListener('input', () => {
    stockPrice = stockInputPrice.value
})


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
})


fetch('http://localhost:17627/api/courses', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => {
    if (response.ok){
        return response.json()
    } else {

    }
}).then((body) => {
    stock = body
})


autocomplete(document.getElementById("input_stock"), stock)


function autocomplete(elem, array) {
    let currentFocus;
    elem.addEventListener("input", function(e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete_list");
        a.setAttribute("class", "autocomplete_items");
        this.parentNode.appendChild(a);
        for (i = 0; i < array.length; i++) {
            if (array[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + array[i].substr(0, val.length) + "</strong>";
                b.innerHTML += array[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
                b.addEventListener("click", function(e) {
                    elem.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    elem.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete_list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete_active");
    }
    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete_active");
        }
    }
    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete_items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != elem) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

async function sendReport() {
    coke.style.pointerEvents = 'none'
    await fetch('http://localhost:17627/api/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{'stock': stockName, 'price': stockPrice}])
    }).then((response) => {
        if (response.ok){
            changeModalOk('ok', true)
        } else {
            changeModalOk('krest2', false)
        }
    }).catch(() => {
        changeModalOk('krest2', false)
    })
    setTimeout(() => {
        coke.style.pointerEvents = 'auto'
    }, 2000)
}

function changeModalOk(url, result) {
    modalOk.style.border = result ? '#2ecc71' + ' solid 25px' : '#ca1413' + ' solid 25px'
    modalOk.querySelector('img').src = '../content/' + url + '.png'
    coke.style.pointerEvents = 'none'
    modalOk.style.left = '50%'
    setTimeout(() => {
        modalOk.style.left = '-50%'
    }, 2000)
    setTimeout(() => {
        coke.style.pointerEvents = 'auto'
    }, 3000)
}

function loading(loading) {
    if (loading.querySelector('.loading-content span').innerHTML.length < 3) {
        loading.querySelector('.loading-content span').append('.')
    } else {
        loading.querySelector('.loading-content span').innerHTML = ''
    }
}
