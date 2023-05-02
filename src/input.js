export class Input {
    static keys = {};
    static mouse = { click: {} };

    static init() {
        document.addEventListener("keydown", (e) => Input.keys[e.key] = true);
        document.addEventListener("keyup", (e) => Input.keys[e.key] = false);

        document.addEventListener("mousedown", (e) => {
            Input.mouse[Input.mouseCodeToName(e.button)] = true
            Input.mouse.click[Input.mouseCodeToName(e.button)] = true
        });
        document.addEventListener("mouseup", (e) => {
            Input.mouse[Input.mouseCodeToName(e.button)] = false
        });
        document.addEventListener("mousemove", (e) => {
            Input.mouse.x = e.clientX - canvas.offsetLeft;
            Input.mouse.y = e.clientY - canvas.offsetTop;
        });

    }

    static mouseCodeToName(code) {
        switch (code) {
            case 0:
                return "left";
            case 1:
                return "middle";
            case 2:
                return "right";
        }
    }

    static update() {
        //reset click
        for (let k in Input.mouse.click) {
            if (Input.mouse.click[k]) {
                Input.mouse.click[k] = false
            }
        }
    }

}