export class View {
    constructor(model) {
        this.model = model;
        this.matrix = document.querySelectorAll('.matrix')[0];
        this.paletteForegrounds = document.querySelectorAll('.palette__foregrounds')[0];
        this.paletteBackgrounds = document.querySelectorAll('.palette__backgrounds')[0];
    }
    render() {
        this.renderMatrix();
        this.renderPalette();
        const serializedModel = encodeURIComponent(this.model.searialize());
        history.replaceState(serializedModel, 'matrix', '?m=' + serializedModel);
    }
    renderPalette() {
        this.cleanUpElement(this.paletteForegrounds);
        const matrixRows = document.getElementsByClassName('matrix__row');
        for (let i = 0; i < matrixRows.length; i++) {
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
        for (let foreground of this.model.foregrounds) {
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
    renderMatrix() {
        this.cleanUpElement(this.matrix);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.model.backgrounds.length; i++) {
            const backgroundColor = this.model.backgrounds[i].color;
            const row = document.createElement('div');
            row.classList.add('matrix__row');
            fragment.appendChild(row);
            for (let j = 0; j < this.model.foregrounds.length; j++) {
                const foregroundColor = this.model.foregrounds[j].color;
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
                swatch.setAttribute('title', `"${this.model.foregrounds[j].name}" on "${this.model.backgrounds[i].name}"`);
                swatch.addEventListener('click', () => this.onSelect(i, j, swatch));
                row.appendChild(swatch);
            }
        }
        this.matrix.appendChild(fragment);
    }
    cleanUpElement(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }
    getWCAG2Rating(contrastRatio) {
        if (contrastRatio <= 3) {
            return 'FAIL';
        }
        else if (contrastRatio <= 4.5) {
            return 'AA LARGE';
        }
        else if (contrastRatio <= 7) {
            return 'AA';
        }
        else if (contrastRatio <= 22) {
            return 'AAA';
        }
        else {
            throw ('invalid ratio contrast ratio');
        }
    }
    onSelect(row, column, swatch) {
        // remove all exist selections
        const selectedPaletteSwatches = document.querySelectorAll('.palette__swatch--selected');
        for (let i = 0; i < selectedPaletteSwatches.length; i++) {
            const selectedBackgroundSwatch = selectedPaletteSwatches[i];
            selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
        }
        const selectedMatrixSwatch = document.querySelectorAll('.matrix__swatch--selected');
        if (selectedMatrixSwatch.length) {
            selectedMatrixSwatch[0].classList.remove('matrix__swatch--selected');
        }
        // select matrix swatch
        swatch.classList.add('matrix__swatch--selected');
        // select palette swatch
        const backgroundPaletteSwatches = document.querySelectorAll('.matrix .palette__swatch');
        for (let i = 0; i < backgroundPaletteSwatches.length; i++) {
            const selectedBackgroundSwatch = backgroundPaletteSwatches[i];
            i === row ? selectedBackgroundSwatch.classList.add('palette__swatch--selected') : selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
        }
        const foregroundPaletteSwatches = document.querySelectorAll('.palette__foregrounds .palette__swatch');
        for (let i = 0; i < foregroundPaletteSwatches.length; i++) {
            const selectedForegroundSwatch = foregroundPaletteSwatches[i];
            i === column ? selectedForegroundSwatch.classList.add('palette__swatch--selected') : selectedForegroundSwatch.classList.remove('palette__swatch--selected');
        }
    }
}
