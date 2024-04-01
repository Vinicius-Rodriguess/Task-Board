const notesContainer = document.querySelector("#notes-container")
const noteInput = document.querySelector("#note-content")
const addBtn = document.querySelector(".add-note")
const searchInput = document.querySelector("#search-input")
const exportBtn = document.querySelector("#export-notes")

const NOTE = {
    show() {
        NOTE.clean()

        NOTE.get().forEach(note => {
            const noteElement = NOTE.create(note.id, note.content, note.fixed)

            notesContainer.appendChild(noteElement)
        });
    },

    clean() {
        notesContainer.replaceChildren([])
    },

    generateId() {
        return Math.floor(Math.random() * 5000)
    },

    get() {
        const notes = JSON.parse(localStorage.getItem("notes") || "[]")

        const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1)

        return orderedNotes
    },

    save(notes) {
        localStorage.setItem("notes", JSON.stringify(notes))
    },

    create(id, content, fixed) {
        const element = document.createElement("div")
        element.classList.add("note")

        const textarea = document.createElement("textarea")
        textarea.value = content
        textarea.placeholder = "Adicione algum texto..."
        textarea.addEventListener("keyup", e => {

            const noteContent = e.target.value

            NOTE.update(id, noteContent)

        })

        const pinIcon = document.createElement("I")
        pinIcon.classList.add(...["bi", "bi-pin"])
        pinIcon.addEventListener("click", () => NOTE.toggleFixNote(id))

        const deleteIcon = document.createElement("i")
        deleteIcon.classList.add(...["bi", "bi-x-lg"])
        deleteIcon.addEventListener("click", () => NOTE.delete(id, element))

        const duplicateIcon = document.createElement("i")
        duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"])
        duplicateIcon.addEventListener("click", () => NOTE.copy(id))

        if (fixed) element.classList.add("fixed")

        element.appendChild(textarea)
        element.appendChild(pinIcon)
        element.appendChild(deleteIcon)
        element.appendChild(duplicateIcon)

        return element
    },

    toggleFixNote(id) {
        const notes = NOTE.get()

        const targetNote = notes.filter(note => note.id === id)[0]

        targetNote.fixed = !targetNote.fixed;

        NOTE.save(notes)

        NOTE.show()
    },

    delete(id, element) {

        const notes = NOTE.get().filter(note => note.id !== id)

        NOTE.save(notes)

        notesContainer.removeChild(element)

    },

    update(id, newContent) {

        const notes = NOTE.get()

        const targetNote = notes.filter(note => note.id === id)[0]

        targetNote.content = newContent

        NOTE.save(notes)
    },

    copy(id) {

        const notes = NOTE.get()

        const targetNote = notes.filter(note => note.id === id)[0]

        const noteObject = {
            id: NOTE.generateId(),
            content: targetNote.content,
            fixed: false,
        }

        const noteElement = NOTE.create(noteObject.id, noteObject.content, noteObject.fixed)

        notesContainer.appendChild(noteElement)

        notes.push(noteObject)

        NOTE.save(notes)
    },

    exportData() {

        const notes = NOTE.get()

        const csvString = [
            ["ID", "Conteúdo", "Fixado?"],
            ...notes.map(note => [note.id, note.content, note.fixed])
        ]
            .map(e => e.join(","))
            .join("\n")

        const element = document.createElement("a")

        element.href = "data:text/csv;charset=utf-8" + encodeURI(csvString)

        element.target = "_blank"

        element.download = "note.csv"

        element.click()
    },

    search(search) {

        const searchResults = NOTE.get().filter(note => note.content.includes(search))

        if (search !== "") {
            NOTE.clean()

            searchResults.forEach(note => {
                const noteElement = NOTE.create(note.id, note.content, note.fixed)
                notesContainer.appendChild(noteElement)
            })

            return
        }

        NOTE.clean()

        NOTE.show()
    },

    add() {
        const notes = NOTE.get()

        const noteObject = {
            id: NOTE.generateId(),
            content: noteInput.value,
            fixed: false
        }

        const noteElement = NOTE.create(noteObject.id, noteObject.content, noteObject.fixed)

        notesContainer.appendChild(noteElement)

        notes.push(noteObject)

        NOTE.save(notes)

        noteInput.value = ""
        noteInput.focus()
    }
}

addBtn.addEventListener("click", () => NOTE.add())

searchInput.addEventListener("keyup", e => NOTE.search(e.target.value))

exportBtn.addEventListener("click", () => NOTE.exportData())

noteInput.addEventListener("keydown", e => {
    if (e.key === "Enter") NOTE.add()
})

NOTE.show()