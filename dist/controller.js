import { Color, FilePicker, JsonFileParser } from 'visually';
export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.addBackground = document.getElementsByClassName('editor__add-background')[0];
        this.addForeground = document.getElementsByClassName('editor__add-foreground')[0];
        this.colorPicker = document.getElementsByClassName('editor__color-picker')[0];
        this.inputElement = document.getElementsByClassName('loader')[0];
        this.picker = new FilePicker(this.inputElement);
        this.parser = new JsonFileParser();
        this.backgroundNewCounter = 0;
        this.foregroundNewCounter = 0;
        this.handleInput();
        this.view.render();
    }
    handleInput() {
        this.addBackground.addEventListener('click', () => {
            try {
                this.model.backgrounds.unshift({
                    name: "background " + ++this.backgroundNewCounter,
                    color: new Color(this.colorPicker.value)
                });
                this.view.render();
            }
            catch (e) {
                window.alert('invalid color value');
            }
        });
        this.addForeground.addEventListener('click', () => {
            try {
                this.model.foregrounds.unshift({
                    name: "foreground " + ++this.foregroundNewCounter,
                    color: new Color(this.colorPicker.value)
                });
                this.view.render();
            }
            catch (e) {
                window.alert('invalid color value');
            }
        });
        this.picker.filesPicked.subscribe(file => this.parser.parseFile(file[0]));
        this.parser.fileParsed.subscribe(object => {
            this.model.backgrounds = object.backgrounds.map((item) => ({ name: item.name, color: new Color(item.value) }));
            this.model.foregrounds = object.foregrounds.map((item) => ({ name: item.name, color: new Color(item.value) }));
            this.view.render();
            this.picker.reset();
        });
    }
}
