export const spinner = {
    element: document.createElement("div"),
    radius: 50,
    direction: "",
    width: 80,
    height: 80,
    speed: 1,
    bgColor: "rgba(0, 0, 0, 0.2)",
    bgBorderColor: "white",
    color: "#293ecc",
    timeToOpen: null,
    
    getHtml() {
        return `
        <style>
            @keyframes spin {100% { transform: rotate(${this.direction == "l" ? "-" : ""}360deg)}}
        </style>
        <div style="position: fixed;inset: 0;background-color: ${this.bgColor};display: flex;justify-content: center;align-items: center;">
            <div style="background-color: green;height: ${this.height}px;width: ${this.width}px;border-radius: ${this.radius}%;background-color: transparent;border: 7px ${this.bgBorderColor} solid;border-top: 7px ${this.color} solid;animation: spin ${this.speed}s linear infinite;"></div>
        </div>`;
    },

    start() {
        spinner.timeToOpen = setTimeout(() => {
            this.element.innerHTML = this.getHtml()
            document.body.appendChild(this.element)
        }, 1000)
    },

    stop() {
        clearTimeout(spinner.timeToOpen)
        this.element.remove()
    },
}