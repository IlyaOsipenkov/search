// import { Repository } from "./rep"

const changeInput = document.querySelector('.searchInput')


class HtmlElements {
    constructor() {
        this.app = document.querySelector('.app')
        this.searchWrapper = document.querySelector('.searching-wrapper')

        this.repWrapper = this.createElement('div', 'selected-rep-wrapper')
        // this.repList = this.createElement('ul', 'rep-list')
        // this.repWrapper.append(this.repList)

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

    //add search content
    createSearchRep(data) {
        const searchPreviewRep = this.createElement('div', 'searchPreviewRep')
        searchPreviewRep.innerHTML = `<p>${data.name}</p>`
        Search.addClickEvent(data, searchPreviewRep)
        this.searchWrapper.append(searchPreviewRep)
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

    //add selected rep content to main
    static createSelectedRep(data) {
        console.log('cringe')
        const selectedRep = this.createElement('div', 'selectedRep')
        selectedRep.innerHTML = `<p>    Name: ${data.name}<br>
                                        Owner: ${data.owner}<br>
                                        Stars: ${data.stars}<br>
                                </p>`
        // selectedRep.addEventListener('click',)
        this.app.append(selectedRep)
    }

}


class Search {
    static addClickEvent(data, element) {
        const addRep = () => {
            console.log(data.name)
            const nodeListPreViewRep = document.querySelectorAll('.searchPreviewRep')
            nodeListPreViewRep.forEach((rep) => {
                rep.remove()
            })
            changeInput.value = ''
        }

        const addSelectedRep = () => {
            // console.log(this)
            // this.HtmlElements.createSelectedRep(data)
            this.HtmlElements.createSelectedRep.apply(this.HtmlElements, data)

        }
        element.addEventListener('click', addRep)
        element.addEventListener('click', addSelectedRep)
    }
    // static addSelectedEvent(data, element) {
    //     const addSelectedRep = () => {
    //         console.log('da-detka')

    //     }

    //     element.addEventListener('click', addSelectedRep)
    // }


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
            // let repData
            responce.items.forEach((rep) => {
                this.repData = {
                    name: rep.name,
                    owner: rep.owner.login,
                    stars: rep.stargazers_count
                }
                this.HtmlElements.createSearchRep(this.repData)
                // this.HtmlElements.createSelectedRep(this.repData)
                console.log(this.repData)

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


new Search(new HtmlElements())
