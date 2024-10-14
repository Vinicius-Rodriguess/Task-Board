import { taskBoard } from "./taskBoard.js"

export const noteInput = document.querySelector("#note-content")
export const addBtn = document.querySelector(".add-note")

addBtn.addEventListener("click", async () => taskBoard.addTask())
noteInput.addEventListener("keydown", async (e) => (e.key == "Enter")  && taskBoard.addTask())

taskBoard.showTasks()