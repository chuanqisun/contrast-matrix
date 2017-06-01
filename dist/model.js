import { Color } from 'visually';
export class Model {
    constructor() {
        // TODO add palette and matrix into model as well
        this.backgrounds = [];
        this.foregrounds = [];
    }
    searialize() {
        const serializableModel = {
            foregrounds: this.serializeColorViewModels(this.foregrounds),
            backgrounds: this.serializeColorViewModels(this.backgrounds)
        };
        return JSON.stringify(serializableModel);
    }
    deserialize(serializedModel) {
        const serializableModel = JSON.parse(serializedModel);
        this.foregrounds = this.deserializeColorViewModels(serializableModel.foregrounds);
        this.backgrounds = this.deserializeColorViewModels(serializableModel.backgrounds);
    }
    serializeColorViewModels(colorViewModels) {
        return colorViewModels.map(colorViewModel => ({
            name: colorViewModel.name,
            color: colorViewModel.color.rgbaString,
        }));
    }
    deserializeColorViewModels(serializableColorViewModels) {
        return serializableColorViewModels.map(serializableColorViewModel => ({
            name: serializableColorViewModel.name,
            color: new Color(serializableColorViewModel.color),
        }));
    }
}
