(function () {
    var FilePicker = (function () {
        function FilePicker(inputElement) {
            var _this = this;
            this.inputElement = inputElement;
            this.observers = [];
            inputElement.addEventListener('change', function (event) {
                var fileList = event.target.files;
                if (fileList.length >= 1) {
                    var file_1 = fileList[0];
                    _this.observers.forEach(function (observer) { return observer(file_1); });
                }
            });
        }
        FilePicker.prototype.addObserver = function (observer) {
            this.observers.push(observer);
        };
        FilePicker.prototype.reset = function () {
            this.inputElement.value = '';
        };
        return FilePicker;
    }());
    var JsonFileParser = (function () {
        function JsonFileParser() {
            var _this = this;
            this.fileReader = new FileReader();
            this.observers = [];
            this.fileReader.onload = function (e) {
                try {
                    var result_1 = JSON.parse(_this.fileReader.result);
                    _this.observers.forEach(function (observer) { return observer(result_1); });
                }
                catch (error) {
                    window.alert('import palette failed. please start with the sample file and try again.');
                }
            };
        }
        JsonFileParser.prototype.addObserver = function (observer) {
            this.observers.push(observer);
        };
        JsonFileParser.prototype.parseFile = function (file) {
            this.fileReader.readAsText(file);
        };
        return JsonFileParser;
    }());
    var Model = (function () {
        function Model() {
            // TODO add palette and matrix into model as well
            this.backgrounds = [];
            this.foregrounds = [];
        }
        return Model;
    }());
    var View = (function () {
        function View(model) {
            this.model = model;
            this.matrix = document.querySelectorAll('.matrix')[0];
            this.paletteForegrounds = document.querySelectorAll('.palette__foregrounds')[0];
            this.paletteBackgrounds = document.querySelectorAll('.palette__backgrounds')[0];
        }
        View.prototype.render = function () {
            this.renderMatrix();
            this.renderPalette();
            var model = encodeURIComponent(JSON.stringify(this.model));
            history.replaceState(model, 'matrix', '?m=' + model);
        };
        View.prototype.renderPalette = function () {
            this.cleanUpElement(this.paletteForegrounds);
            var matrixRows = document.getElementsByClassName('matrix__row');
            for (var i = 0; i < matrixRows.length; i++) {
                var matrixRow = matrixRows[i], background = this.model.backgrounds[i];
                var swatch_1 = document.createElement('div');
                swatch_1.classList.add('palette__swatch');
                var colorCode = document.createElement('span');
                colorCode.classList.add('palette__color-code');
                colorCode.innerHTML = this.rgb2hex(background.color.toString());
                swatch_1.appendChild(colorCode);
                var letterTContainer_1 = document.createElement('span');
                letterTContainer_1.classList.add('palette__background-demo-container');
                swatch_1.style.color = background.color.toString();
                swatch_1.appendChild(letterTContainer_1);
                swatch_1.setAttribute('title', background.name);
                matrixRow.insertBefore(swatch_1, matrixRow.firstChild);
            }
            // pseudo header. leave blank
            var swatch = document.createElement('div');
            swatch.classList.add('dummy__swatch');
            var letterT = document.createElement('span');
            var letterTContainer = document.createElement('span');
            swatch.appendChild(letterTContainer);
            this.paletteForegrounds.appendChild(swatch);
            for (var _i = 0, _a = this.model.foregrounds; _i < _a.length; _i++) {
                var foreground = _a[_i];
                var swatch_2 = document.createElement('div');
                swatch_2.classList.add('palette__swatch');
                var colorCode = document.createElement('span');
                colorCode.classList.add('palette__color-code');
                colorCode.innerHTML = this.rgb2hex(foreground.color.toString());
                swatch_2.appendChild(colorCode);
                var letterT_1 = document.createElement('span');
                letterT_1.classList.add('palette__foreground-demo');
                letterT_1.innerHTML = 'Text';
                var letterTContainer_2 = document.createElement('span');
                letterTContainer_2.classList.add('palette__foreground-demo-container');
                letterTContainer_2.appendChild(letterT_1);
                swatch_2.style.color = foreground.color.toString();
                swatch_2.appendChild(letterTContainer_2);
                swatch_2.setAttribute('title', foreground.name);
                this.paletteForegrounds.appendChild(swatch_2);
            }
        };
        View.prototype.renderMatrix = function () {
            var _this = this;
            this.cleanUpElement(this.matrix);
            var fragment = document.createDocumentFragment();
            var _loop_1 = function (i) {
                var backgroundColor = this_1.model.backgrounds[i].color;
                var row = document.createElement('div');
                row.classList.add('matrix__row');
                fragment.appendChild(row);
                var _loop_2 = function (j) {
                    var foregroundColor = this_1.model.foregrounds[j].color;
                    var swatch = document.createElement('div');
                    swatch.classList.add('matrix__swatch');
                    swatch.style.backgroundColor = backgroundColor.toString();
                    var contrast = backgroundColor.contrast(foregroundColor);
                    var rating = this_1.getWCAG2Rating(contrast.ratio);
                    swatch.setAttribute('data-fg', this_1.rgb2hex(foregroundColor.toString()));
                    swatch.setAttribute('data-bg', this_1.rgb2hex(backgroundColor.toString()));
                    swatch.setAttribute('data-ratio', contrast.ratio);
                    swatch.setAttribute('data-rating', rating);
                    var contrastRatio = document.createElement('span');
                    contrastRatio.classList.add('matrix__contrast-ratio');
                    contrastRatio.style.color = foregroundColor.toString();
                    contrastRatio.innerHTML = contrast.ratio;
                    swatch.appendChild(contrastRatio);
                    var displayRating = document.createElement('span');
                    displayRating.classList.add('matrix__rating-badge');
                    displayRating.style.color = backgroundColor.toString();
                    displayRating.style.backgroundColor = foregroundColor.toString();
                    displayRating.innerHTML = rating;
                    swatch.appendChild(displayRating);
                    swatch.setAttribute('title', "\"" + this_1.model.foregrounds[j].name + "\" on \"" + this_1.model.backgrounds[i].name + "\"");
                    swatch.addEventListener('click', function () { return _this.onSelect(i, j, swatch); });
                    row.appendChild(swatch);
                };
                for (var j = 0; j < this_1.model.foregrounds.length; j++) {
                    _loop_2(j);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.model.backgrounds.length; i++) {
                _loop_1(i);
            }
            this.matrix.appendChild(fragment);
        };
        View.prototype.cleanUpElement = function (element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        };
        View.prototype.getWCAG2Rating = function (contrastRatio) {
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
        };
        View.prototype.rgb2hex = function (rgb) {
            var result = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (result && result.length === 4) ? "#" +
                ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(result[3], 10).toString(16)).slice(-2) : '';
        };
        View.prototype.onSelect = function (row, column, swatch) {
            // remove all exist selections
            var selectedPaletteSwatches = document.querySelectorAll('.palette__swatch--selected');
            for (var i = 0; i < selectedPaletteSwatches.length; i++) {
                var selectedBackgroundSwatch = selectedPaletteSwatches[i];
                selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
            }
            var selectedMatrixSwatch = document.querySelectorAll('.matrix__swatch--selected');
            if (selectedMatrixSwatch.length) {
                selectedMatrixSwatch[0].classList.remove('matrix__swatch--selected');
            }
            // select matrix swatch
            swatch.classList.add('matrix__swatch--selected');
            // select palette swatch
            var backgroundPaletteSwatches = document.querySelectorAll('.matrix .palette__swatch');
            for (var i = 0; i < backgroundPaletteSwatches.length; i++) {
                var selectedBackgroundSwatch = backgroundPaletteSwatches[i];
                i === row ? selectedBackgroundSwatch.classList.add('palette__swatch--selected') : selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
            }
            var foregroundPaletteSwatches = document.querySelectorAll('.palette__foregrounds .palette__swatch');
            for (var i = 0; i < foregroundPaletteSwatches.length; i++) {
                var selectedForegroundSwatch = foregroundPaletteSwatches[i];
                i === column ? selectedForegroundSwatch.classList.add('palette__swatch--selected') : selectedForegroundSwatch.classList.remove('palette__swatch--selected');
            }
        };
        return View;
    }());
    var Controller = (function () {
        function Controller(model, view) {
            this.model = model;
            this.view = view;
            this.addBackground = document.getElementsByClassName('editor__add-background')[0];
            this.addForeground = document.getElementsByClassName('editor__add-foreground')[0];
            this.colorPicker = document.getElementsByClassName('editor__color-picker')[0];
            this.inputElement = document.getElementsByClassName('loader')[0];
            this.loader = new FilePicker(this.inputElement);
            this.parser = new JsonFileParser();
            this.backgroundNewCounter = 0;
            this.foregroundNewCounter = 0;
            this.handleInput();
            this.view.render();
        }
        Controller.prototype.handleInput = function () {
            var _this = this;
            this.addBackground.addEventListener('click', function () {
                try {
                    _this.model.backgrounds.unshift({
                        name: "background " + ++_this.backgroundNewCounter,
                        color: new Color(_this.hexToRgba(_this.colorPicker.value))
                    });
                    _this.view.render();
                }
                catch (e) {
                    window.alert('invalid color value');
                }
            });
            this.addForeground.addEventListener('click', function () {
                try {
                    _this.model.foregrounds.unshift({
                        name: "foreground " + ++_this.foregroundNewCounter,
                        color: new Color(_this.hexToRgba(_this.colorPicker.value))
                    });
                    _this.view.render();
                }
                catch (e) {
                    window.alert('invalid color value');
                }
            });
            this.loader.addObserver(function (file) { return _this.parser.parseFile(file); });
            this.parser.addObserver(function (object) {
                _this.model.backgrounds = object.backgrounds.map(function (item) { return ({ name: item.name, color: new Color(_this.hexToRgba(item.value)) }); });
                _this.model.foregrounds = object.foregrounds.map(function (item) { return ({ name: item.name, color: new Color(_this.hexToRgba(item.value)) }); });
                _this.view.render();
                _this.loader.reset();
            });
        };
        Controller.prototype.hexToRgba = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (result) {
                var r = parseInt(result[1], 16);
                var g = parseInt(result[2], 16);
                var b = parseInt(result[3], 16);
                return "rgba(" + r + ", " + g + ", " + b + ", 1)";
            }
            else {
                throw ('invalid hex value');
            }
        };
        return Controller;
    }());
    window.onload = function () {
        var model;
        // init model from url if avaialbe
        var pathArray = location.search.split('?m=');
        if (pathArray.length > 1) {
            var modelString = pathArray[pathArray.length - 1];
            model = JSON.parse(decodeURIComponent(modelString));
            for (var _i = 0, _a = model.backgrounds; _i < _a.length; _i++) {
                var background = _a[_i];
                background.color = new Color(background.color.rgba); // rebuild color object from string
            }
            for (var _b = 0, _c = model.foregrounds; _b < _c.length; _b++) {
                var foreground = _c[_b];
                foreground.color = new Color(foreground.color.rgba); // rebuild color object from string
            }
        }
        else {
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
        var view = new View(model);
        var controller = new Controller(model, view);
    };
})();
