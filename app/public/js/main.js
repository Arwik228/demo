var selectElement = false;

const titleBar = (e) => {
    let title = document.getElementById("control_bar_title");
    if (e) {
        title.innerHTML = `Выбран элемент: ${e.innerText}`;
    } else {
        title.innerHTML = 'Пока ничего не выбрано';
    }
}

const clearSelectElement = () => {
    if (selectElement) {
        if (selectElement.classList.contains("select")) {
            selectElement.classList.remove("select");
        }
        if (selectElement.classList.contains("create")) {
            selectElement.classList.remove("create");
        }
        selectElement = false;
        titleBar(false);
    }
};

const createResponse = (data, allSelector, path, input) => {
    let id = data.response.id;
    if (id) {
        let inAdd = undefined, array = [];
        if (selectElement) {
            allSelector.forEach((e) => {
                if (e.dataset.path.includes(path)) {
                    array.push(e);
                }
            });
            inAdd = array[array.length - 1] ? array[array.length - 1] : selectElement;
        } else {
            inAdd = document.getElementById("find");
        }
        inAdd.insertAdjacentHTML("afterend", `<div data-id="${id}" data-path="${path}" 
                    class="elem" style="background-color:rgba(142 ,0 ,255 ,${(1 / path.split('/').length).toFixed(2)});
                    margin-left: calc(30px * ${path.split('/').length - 1})">${input.value}</div>`);
    }
    input.value = "";
    console.log(data.response.info || data.response.status);
}

document.getElementById("create").addEventListener("click", () => {
    let allSelector = document.querySelectorAll(".elem");
    let input = document.getElementById("control_bar_input");
    let path = "";
    if (selectElement) {
        path = selectElement.dataset.path === "root" ?
            `/${selectElement.dataset.id}` :
            `${selectElement.dataset.path}/${selectElement.dataset.id}`;
    } else {
        path = "root";
    }
    if (input.value && path) {
        fetch(`/api/element`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: btoa(path),
                content: input.value
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            createResponse(data, allSelector, path, input);
        });
    }
});

document.getElementById("change").addEventListener("click", () => {
    let input = document.getElementById("control_bar_input");
    let id = selectElement.dataset.id;
    if (input.value && id) {
        fetch(`/api/element`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                content: input.value
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.response.status === "ok") {
                selectElement.innerText = input.value;
            }
            input.value = "";
            console.log(data.response.info || data.response.status);
        });
    }
});

document.getElementById("remove").addEventListener("click", () => {
    let allSelector = document.querySelectorAll(".elem");
    let id = selectElement.dataset.id;
    let deleteArray = new Array(id);
    allSelector.forEach(element => {
        if (element.dataset && element.dataset.path.split('/').includes(id)) {
            deleteArray.push(element.dataset.id);
            element.remove();
        }
    });
    selectElement.remove();
    if (deleteArray[0]) {
        fetch(`/api/element`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: btoa(deleteArray.join())
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.response.info || data.response.status);
        });
    }
});

document.getElementById("find").addEventListener('keydown', function (e) {
    clearSelectElement();
    if (e.keyCode === 13) {
        let allSelector = document.getElementsByClassName("elem");
        for (key in allSelector) {
            if (allSelector[key].innerText && allSelector[key].innerText.includes(this.value)) {
                selectElement = allSelector[key];
                allSelector[key].scrollIntoView();
                allSelector[key].classList.add("select");
                titleBar(allSelector[key]);
                return;
            }
        }
    }
});

document.body.addEventListener('click', function (e) {
    let parsePath = e.path.filter((e) => e.id === "control_bar");
    if (!parsePath[0]) {
        clearSelectElement();
    }
    if (e.target.className === "elem") {
        e.target.classList.add("create");
        selectElement = e.target;
        titleBar(e.target);
    }
});


