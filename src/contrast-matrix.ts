import { Color, FilePicker, JsonFileParser } from 'visually';

declare function download(...arg: any[]): any;

(function() {
    interface IColorViewModel {
        name: string;
        color: Color;
    }

    class Model {
        // TODO add palette and matrix into model as well
        public backgrounds: IColorViewModel[] = [];
        public foregrounds: IColorViewModel[] = [];
    }

    class View {
        private matrix = document.querySelectorAll('.matrix')[0];
        private paletteForegrounds = document.querySelectorAll('.palette__foregrounds')[0];
        private paletteBackgrounds = document.querySelectorAll('.palette__backgrounds')[0];

        constructor(private model: Model) { }

        public render() {
            this.renderMatrix();
            this.renderPalette();
            const model = encodeURIComponent(JSON.stringify(this.model));
            history.replaceState(model, 'matrix', '?m=' + model)
        }

        private renderPalette() {
            this.cleanUpElement(this.paletteForegrounds);
            const matrixRows = document.getElementsByClassName('matrix__row');
            for(let i = 0; i < matrixRows.length; i++) {
                let matrixRow = matrixRows[i], background = this.model.backgrounds[i];
                const swatch = document.createElement('div');
                swatch.classList.add('palette__swatch');

                const colorCode = document.createElement('span');
                colorCode.classList.add('palette__color-code');
                colorCode.innerHTML = background.color.hexString;
                swatch.appendChild(colorCode);

                const letterTContainer = document.createElement('span');
                letterTContainer.classList.add('palette__background-demo-container');
                swatch.style.color = background.color.hexString;
                swatch.appendChild(letterTContainer);

                swatch.setAttribute('title', background.name);

                matrixRow.insertBefore(swatch, matrixRow.firstChild);
            }

            // pseudo header. leave blank
                const swatch = document.createElement('div');
                swatch.classList.add('dummy__swatch');
                const letterT = document.createElement('span');
                const letterTContainer = document.createElement('span');
                swatch.appendChild(letterTContainer);

                this.paletteForegrounds.appendChild(swatch);

            for(let foreground of this.model.foregrounds) {
                const swatch = document.createElement('div');
                swatch.classList.add('palette__swatch');

                const colorCode = document.createElement('span');
                colorCode.classList.add('palette__color-code');
                colorCode.innerHTML = foreground.color.hexString;
                swatch.appendChild(colorCode);

                const letterT = document.createElement('span');
                letterT.classList.add('palette__foreground-demo');
                letterT.innerHTML = 'Text';
                const letterTContainer = document.createElement('span');
                letterTContainer.classList.add('palette__foreground-demo-container');
                letterTContainer.appendChild(letterT);
                swatch.style.color = foreground.color.hexString;
                swatch.appendChild(letterTContainer);

                swatch.setAttribute('title', foreground.name);

                this.paletteForegrounds.appendChild(swatch);
            }
        }

        private renderMatrix() {
            this.cleanUpElement(this.matrix);
            
            const fragment = document.createDocumentFragment();

            for(let i = 0; i < this.model.backgrounds.length; i++) {
                const backgroundColor = this.model.backgrounds[i].color;
                const row = document.createElement('div');
                row.classList.add('matrix__row')
                fragment.appendChild(row);
                for(let j = 0; j < this.model.foregrounds.length; j++) {
                    const foregroundColor = this.model.foregrounds[j].color
                    const swatch = document.createElement('div');
                    swatch.classList.add('matrix__swatch');
                    swatch.style.backgroundColor = backgroundColor.hexString;
                    const contrast = foregroundColor.getContrastOnBackground(backgroundColor);
                    const rating = this.getWCAG2Rating(contrast);
                    
                    swatch.setAttribute('data-fg', foregroundColor.hexString);
                    swatch.setAttribute('data-bg', backgroundColor.hexString);
                    swatch.setAttribute('data-ratio', contrast.toString());
                    swatch.setAttribute('data-rating', rating);

                    const contrastRatio = document.createElement('span');
                    contrastRatio.classList.add('matrix__contrast-ratio');
                    contrastRatio.style.color = foregroundColor.hexString;
                    contrastRatio.innerHTML = contrast.toString();
                    swatch.appendChild(contrastRatio);

                    const displayRating = document.createElement('span');
                    displayRating.classList.add('matrix__rating-badge');
                    displayRating.style.color = backgroundColor.hexString;
                    displayRating.style.backgroundColor = foregroundColor.hexString;
                    displayRating.innerHTML = rating;
                    swatch.appendChild(displayRating);

                    swatch.setAttribute('title', `"${this.model.foregrounds[j].name}" on "${this.model.backgrounds[i].name}"`)

                    swatch.addEventListener('click', () => this.onSelect(i, j, swatch));

                    row.appendChild(swatch);
                }
            }

            this.matrix.appendChild(fragment);
        }

        private cleanUpElement(element: Element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        }

        private getWCAG2Rating(contrastRatio: number) {
            if (contrastRatio <= 3) {
                return 'FAIL';
            } else if (contrastRatio <= 4.5) {
                return 'AA LARGE';
            } else if (contrastRatio <= 7) {
                return 'AA';
            } else if (contrastRatio <= 22) {
                return 'AAA';
            } else {
                throw('invalid ratio contrast ratio');
            }
        }

        private onSelect(row: number, column: number, swatch: HTMLElement) {
            // remove all exist selections
            const selectedPaletteSwatches = document.querySelectorAll('.palette__swatch--selected');
            for(let i = 0; i < selectedPaletteSwatches.length; i++) {
                const selectedBackgroundSwatch = selectedPaletteSwatches[i];
                selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
            }

            const selectedMatrixSwatch = document.querySelectorAll('.matrix__swatch--selected');
            if(selectedMatrixSwatch.length) {
                selectedMatrixSwatch[0].classList.remove('matrix__swatch--selected');
            }

            // select matrix swatch
            swatch.classList.add('matrix__swatch--selected');

            // select palette swatch
            const backgroundPaletteSwatches = document.querySelectorAll('.matrix .palette__swatch');
            for(let i = 0; i < backgroundPaletteSwatches.length; i++) {
                const selectedBackgroundSwatch = backgroundPaletteSwatches[i];
                i === row ? selectedBackgroundSwatch.classList.add('palette__swatch--selected') : selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
            }

            const foregroundPaletteSwatches = document.querySelectorAll('.palette__foregrounds .palette__swatch');
            for(let i = 0; i < foregroundPaletteSwatches.length; i++) {
                const selectedForegroundSwatch = foregroundPaletteSwatches[i];
                i === column ? selectedForegroundSwatch.classList.add('palette__swatch--selected') : selectedForegroundSwatch.classList.remove('palette__swatch--selected');
            }

        }
    }
    
    class Controller {
        private addBackground = document.getElementsByClassName('editor__add-background')[0];
        private addForeground = document.getElementsByClassName('editor__add-foreground')[0];
        private colorPicker = document.getElementsByClassName('editor__color-picker')[0] as HTMLInputElement;
        private inputElement = document.getElementsByClassName('loader')[0];
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
        }
    }

    window.onload = function() {
        let model: Model;

        // init model from url if avaialbe
        const pathArray = location.search.split('?m=');
        if (pathArray.length > 1) {
            const modelString = pathArray[pathArray.length - 1];    
            model = JSON.parse(decodeURIComponent(modelString));
            for(let background of model.backgrounds) {
                background.color = new Color(background.color.rgba); // rebuild color object from string
            }
            for(let foreground of model.foregrounds) {
                foreground.color = new Color(foreground.color.rgba); // rebuild color object from string
            }
        } else {
            model = new Model();
            model.backgrounds = [
                { name: 'Absolutely Black', color: new Color('rgba(0, 0, 0, 1)') },
                { name: 'Gandalf the Grey', color: new Color('rgba(120, 120, 120, 1)') },
                { name: 'Absolutely White', color: new Color('rgba(255, 255, 255, 1)') },
            ];
            model.foregrounds = [
                { name: 'Darth Vader Black', color: new Color('rgba(10, 10, 10, 1)') },
                { name: 'The 25th shade of Grey', color: new Color('rgba(128, 128, 128, 1)') },
                { name: 'Not-quite White', color: new Color('rgba(240, 240, 240, 1)') },
            ];
        }

        let view = new View(model);

        let controller = new Controller(model, view);
    }
})();