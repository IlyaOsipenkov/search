const changeInput = document.querySelector('.searchInput')


//create/remove elements
class HtmlElements {
    constructor() {
        this.app = document.querySelector('.app')
        this.searchWrapper = document.querySelector('.searching-wrapper')

        this.searchRepWrapper = this.createElement('div', 'searchRepWrapper')
        this.repWrapper = this.createElement('div', 'selected-rep-wrapper')
        this.app.append(this.searchRepWrapper)
        this.app.append(this.repWrapper)
    }

    //create element
    createElement(elTag, elClass) {
        const element = document.createElement(elTag)
        if (elClass) {
            element.classList.add(elClass)
        }
        return element
    }

    //create and add search content
    createSearchRep(data) {
        const searchPreviewRep = this.createElement('div', 'searchPreviewRep')
        searchPreviewRep.innerHTML = `<p>${data.name}</p>`
        this.addClickEventCreate(data, searchPreviewRep)
        this.searchRepWrapper.append(searchPreviewRep)
    }

    //create and add selected rep content
    createSelectedRep(data) {
        const selectedRepWrapper = document.querySelector('.selected-rep-wrapper')
        const selectedRep = this.createElement('div', 'selectedRep')
        selectedRep.innerHTML = `<div>    <p>Name: ${data.name}</p>
                                        <p>Owner: ${data.owner}</p>
                                        <p>Stars: ${data.stars}</p>
                                </div>`

        //maintaining the quantity
        const allSelectedRep = document.querySelectorAll('.selectedRep')
        if (allSelectedRep.length > 2) {
            allSelectedRep[1].remove()
        }
        selectedRepWrapper.append(selectedRep)
        this.createCross(selectedRep)
        this.addClickEventDelete(selectedRep)
    }

    //create crosses
    createCross(selectedRep) {
        const crossWr = this.createElement('div', 'crossSvg')
        const leftDown = this.createElement('div', 'leftDown')
        const leftUp = this.createElement('div', 'leftUp')
        leftDown.innerHTML = `<svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4"/>
        </svg>
        `
        leftUp.innerHTML = `<svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4"/>
        </svg>
        `
        crossWr.append(leftDown)
        crossWr.append(leftUp)
        selectedRep.append(crossWr)

    }

    //remove repositories when search reloaded
    removeRepWithReload() {
        const previewReps = document.querySelectorAll('.searchPreviewRep')
        const element = document.querySelector('.searchPreviewRep')
        const removeRep = () => {
            previewReps.forEach((rep) => {
                rep.remove()
            })
        }
        removeRep()
    }

    //click event for create
    addClickEventCreate(data, element) {
        const addRep = () => {
            const nodeListPreViewRep = document.querySelectorAll('.searchPreviewRep')
            nodeListPreViewRep.forEach((rep) => {
                rep.remove()
            })
            changeInput.value = ''
            this.createSelectedRep(data)
        }
        element.addEventListener('click', addRep)
    }

    //click event for delete
    addClickEventDelete(element) {
        const removeRep = () => {
            element.remove()
        }

        element.addEventListener('click', removeRep)
    }
}


//logic of work
class Search {
    constructor(htmlElements) {
        this.HtmlElements = htmlElements
        this.repData

        changeInput.oninput = (() => {
            const previewReps = document.querySelectorAll('.searchPreviewRep')
            if (previewReps.length > 4) {
                this.HtmlElements.removeRepWithReload()
            }
            this.debounce(() => {
                this.getter(`https://api.github.com/search/repositories?q=${changeInput.value}&per_page=5`)
            }, 500)
        })
    }



    async getter(url) {
        if (changeInput.value !== '') {
            let responce = await fetch(url)
            responce = await responce.json()

            responce.items.forEach((rep) => {
                this.repData = {
                    name: rep.name,
                    owner: rep.owner.login,
                    stars: rep.stargazers_count
                }
                this.HtmlElements.createSearchRep(this.repData)
            })
        }
    }


    debounce(callee, timeoutMs) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            callee()
        }, timeoutMs)
    }


}

//init
new Search(new HtmlElements())
