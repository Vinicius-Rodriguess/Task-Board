export const toaster = {
    current: null,

    open(msg) {
        if (toaster.current) toaster.current.remove()

        const element = document.createElement("div")
        element.classList.add("toaster", "toaster-hide")

        const span = document.createElement("span")
        span.innerText = msg

        element.appendChild(span)
        document.body.appendChild(element)
        toaster.current = element

        element.classList.remove("toaster-hide")

        setTimeout(() => toaster.close(element), 3000)
    },

    close(element) {
        element.classList.add("toaster-hide")
        setTimeout(() => toaster.close(element), 1000)
    }
}