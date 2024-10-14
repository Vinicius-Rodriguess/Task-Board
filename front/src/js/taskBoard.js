import { noteInput } from "./main.js"
import { spinner } from "./spinner.js"
import { toaster } from "./toaster.js"

export const taskBoard = {
    currentTasks: [],
    container: document.querySelector("#notes-container"),

    get api() { 
        return "http://127.0.0.1:8080/"
    },

    tasksOnScreen() {
        taskBoard.currentTasks.forEach(task =>
            taskBoard.container.appendChild(taskBoard.createTask(task.id, task.content, task.fixed)))
    },

    orderTasks() {
        taskBoard.currentTasks.sort((a, b) => (b.fixed) - (a.fixed))
    },

    cleanTasks() {
        taskBoard.container.innerHTML = ""
    },

    generateRandomId() {
        return Math.floor(Math.random() * 986551554)
    },

    async showTasks() {
        taskBoard.cleanTasks()
        taskBoard.currentTasks = await taskBoard.getTasks()
        taskBoard.orderTasks()
        taskBoard.tasksOnScreen()
    },

    async addTask() {
        spinner.start()
        const newId = taskBoard.generateRandomId()

        try {
            const response = await fetch(taskBoard.api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: newId,
                    content: noteInput.value,
                    fixed: false,
                })
            })

            if (!response.ok) {
                toaster.open("ops algo deu errado, por favor tente mais tarde ;-;")
                return
            }

            taskBoard.currentTasks.unshift({
                id: newId,
                content: noteInput.value,
                fixed: false
            })

            noteInput.value = ""
            noteInput.focus()
            taskBoard.cleanTasks()
            taskBoard.orderTasks()
            taskBoard.tasksOnScreen()

        } catch (error) {
            toaster.open("ops algo deu errado, por favor tente mais tarde ;-;")
            console.error("Falha ao salvar tasks" + error)
        } finally {
            spinner.stop()
        }
    },

    async getTasks() {
        spinner.start()

        try {
            const response = await fetch(taskBoard.api)
            const data = await response.json()

            if (!response.ok) {
                toaster.open("Ocorreu uma falha ao carregar suas tasks, por favor tente mais tarde.")
                return
            }

            return data

        } catch (error) {
            toaster.open("Ocorreu uma falha ao carregar suas tasks, por favor tente mais tarde.")
            console.error("Falha ao carregar tasks", error)
        } finally {
            spinner.stop()
        }
    },

    async updateTask(id, content, fixed) {
        spinner.start()

        try {
            const response = await fetch(`${taskBoard.api}update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    content: content,
                    fixed: fixed,
                })
            })

            if (!response.ok) {
                toaster.open("ops algo deu errado, por favor tente mais tarde ;-;")
                return
            }

            const [task] = this.currentTasks.filter(task => task.id == id)
            task.content = content

            if (task.fixed !== fixed) {
                task.fixed = fixed
                taskBoard.cleanTasks()
                taskBoard.orderTasks()
                taskBoard.tasksOnScreen()
            }

        } catch (error) {
            toaster.open("ops algo deu errado, por favor tente mais tarde ;-;")
            console.error("Falha ao atualizar tasks", error)
        } finally {
            spinner.stop()
        }
    },

    async deleteTask(id, task) {
        spinner.start()
        
        try {
            const response = await fetch(`${taskBoard.api}delete/${id}`)

            if (!response.ok) {
                toaster.open("ops algo deu errado, por favor tente mais tarde ;-;")
                return
            }

            task.remove()

        } catch (error) {
            toaster.open("ops algo deu errado, por favor tente mais tarde ;-;")
            console.error("Falha ao deletar tasks", error)
        } finally {
            spinner.stop()
        }
    },

    createTask(id, content, fixed) {
        const task = document.createElement("div")
        task.classList.add("note")

        const textarea = document.createElement("textarea")
        textarea.value = content
        textarea.placeholder = "Adicione algum texto..."

        let debounceTimeout
        textarea.addEventListener("keyup", e => {
            const noteContent = e.target.value
            clearTimeout(debounceTimeout)
            debounceTimeout = setTimeout( async () => {
                await taskBoard.updateTask(id, noteContent, fixed);
            }, 1000)
        })

        const pinIcon = document.createElement("I")
        pinIcon.classList.add("bi", "bi-pin")
        pinIcon.addEventListener("click", () => {
            const invertFixed = fixed ? false : true
            taskBoard.updateTask(id, content, invertFixed)
        })

        const deleteIcon = document.createElement("i")
        deleteIcon.classList.add("bi", "bi-x-lg")
        deleteIcon.addEventListener("click", () => taskBoard.deleteTask(id, task))

        if (fixed) task.classList.add("fixed")

        task.appendChild(textarea)
        task.appendChild(pinIcon)
        task.appendChild(deleteIcon)

        return task
    }
}