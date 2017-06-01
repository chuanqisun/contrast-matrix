import { Color } from 'visually';

export interface IColorViewModel {
    name: string;
    color: Color;
}

interface ISerializableColorViewModel {
    name: string;
    color: string;
}

interface ISerializableModel {
    backgrounds: ISerializableColorViewModel[];
    foregrounds: ISerializableColorViewModel[];
}

export class Model {
    // TODO add palette and matrix into model as well
    public backgrounds: IColorViewModel[] = [];
    public foregrounds: IColorViewModel[] = [];

    public searialize(): string {
        const serializableModel = {
            foregrounds: this.serializeColorViewModels(this.foregrounds),
            backgrounds: this.serializeColorViewModels(this.backgrounds)
        }

        return JSON.stringify(serializableModel);
    }

    public deserialize(serializedModel: string): void {
        const serializableModel = JSON.parse(serializedModel) as ISerializableModel;

        this.foregrounds = this.deserializeColorViewModels(serializableModel.foregrounds);
        this.backgrounds = this.deserializeColorViewModels(serializableModel.backgrounds);
    }

    private serializeColorViewModels(colorViewModels: IColorViewModel[]): ISerializableColorViewModel[] {
        return colorViewModels.map(colorViewModel => ({
            name: colorViewModel.name,
            color: colorViewModel.color.rgbaString,
        }));
    }

    private deserializeColorViewModels(serializableColorViewModels: ISerializableColorViewModel[]): IColorViewModel[] {
        return serializableColorViewModels.map(serializableColorViewModel => ({
            name: serializableColorViewModel.name,
            color: new Color(serializableColorViewModel.color),
        }));
    }
}