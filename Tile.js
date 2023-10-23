export default class Tile {
    #tileElement
    #x
    #y
    #value

    constructor(tileContainer, value = (Math.random() > 0.5 ? 2 : 4)) {
        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add("tile")
        tileContainer.append(this.#tileElement);
        this.value = value;
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v;
        this.#tileElement.textContent = v;
        const power = Math.log2(v); //, How big the number is it returns the power of 2 and based on that we are setting the background color of the respective tile

        const backgroundLightness = 100 - power * 9;
        this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`);

        this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`); //, The logic used here is if background is more bright then the text becomes light and vice versa
    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty("--x", value);
    }
    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty("--y", value);
    }

    // remove function to remove the tile from DOM
    remove() {
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {
                once: true,
            })
        })
    }
}
