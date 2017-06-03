import { Color, FilePicker, JsonFileParser } from 'visually';
import { Model } from './model';
import { View } from './view';
    
export class Controller {
    private mainElement = document.getElementsByClassName('main')[0];
    private addBackground = document.getElementsByClassName('editor__add-background')[0];
    private addForeground = document.getElementsByClassName('editor__add-foreground')[0];
    private colorPicker = document.getElementsByClassName('editor__color-picker')[0] as HTMLInputElement;
    private inputElement = document.getElementsByClassName('editor__file-input')[0];
    private backgroundToggle = document.getElementById('background-toggle') as HTMLInputElement;
    private picker = new FilePicker(this.inputElement as HTMLInputElement);
    private parser = new JsonFileParser();
    private backgroundNewCounter = 0;
    private foregroundNewCounter = 0

    constructor(private model: Model, private view: View) {
        this.handleInput();
        this.view.render();
    }

    private handleInput(): void {
        this.addBackground.addEventListener('click', () => {
            try { 
                this.model.backgrounds.unshift({
                    name: "background " + ++this.backgroundNewCounter,
                    color: new Color(this.colorPicker.value)
                });
                this.view.render();
            } catch (e) {
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
            } catch (e) {
                window.alert('invalid color value');
            }
        });

        this.picker.filesPicked.subscribe(file => this.parser.parseFile(file[0]));
        this.parser.fileParsed.subscribe(object => {
            this.model.backgrounds = object.backgrounds.map((item: any) => ({ name: item.name, color: new Color(item.value)}));
            this.model.foregrounds = object.foregrounds.map((item: any) => ({ name: item.name, color: new Color(item.value)}));
            this.view.render();
            this.picker.reset();
        });

        this.backgroundToggle.addEventListener('click', () => {
            if(this.backgroundToggle.checked) {
                this.mainElement.classList.add('main--dark');
            } else {
                this.mainElement.classList.remove('main--dark');
            }
        });

    }
}