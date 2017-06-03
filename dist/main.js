import { Color } from 'visually';
import { Model } from './model';
import { View } from './view';
import { Controller } from './controller';
(function () {
    window.onload = function () {
        let model = new Model();
        // init model from url if avaialbe
        const pathArray = location.search.split('?m=');
        if (pathArray.length > 1) {
            const modelString = pathArray[pathArray.length - 1];
            model.deserialize(decodeURIComponent(modelString));
        }
        else {
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
    };
})();
