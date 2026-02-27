import {ModelStatic, Options, Sequelize, SyncOptions} from 'sequelize';
import {GrapeAttributes, GrapeInstance} from "./types/grape";
import {MemberInstance} from "./types/member";
import {TastingInstance} from "./types/tasting";
import {CountryInstance} from "./types/country";
import {WineTypeInstance} from "./types/wine-type";
import {WineDto, WineInstance} from "./types/wine";
import {defineMember} from "./orm/models/member.model";
import {defineCountry} from "./orm/models/country.model";
import {defineGrape} from "./orm/models/grape.model";
import {defineTasting} from "./orm/models/tasting.model";
import {defineWineType} from "./orm/models/wine-type.model";
import {defineWine} from "./orm/models/wine.model";
import {GrapeRepository} from "./orm/repositories/grape.repository";
import {TastingRepository} from "./orm/repositories/tasting.repository";
import {CountryRepository} from "./orm/repositories/country.repository";
import {MemberRepository} from "./orm/repositories/member.repository";
import {WineTypeRepository} from "./orm/repositories/wine-type.repository";

export class Orm {


    sequelize: Sequelize;
    private readonly Grape: ModelStatic<GrapeInstance>;
    private readonly Tasting: ModelStatic<TastingInstance>;
    private readonly Country: ModelStatic<CountryInstance>;
    private readonly Wine: ModelStatic<WineInstance>;
    private readonly WineType: ModelStatic<WineTypeInstance>;
    private readonly Member: ModelStatic<MemberInstance>;
    grapes: GrapeRepository;
    tastings: TastingRepository;
    countries: CountryRepository;
    members: MemberRepository;
    wineTypes: WineTypeRepository;




    constructor(database: string, dbUserName: string, dbPassword: string, options: Options) {
        this.sequelize = new Sequelize(database, dbUserName, dbPassword, options);


        this.Country = defineCountry(this.sequelize);
        this.Grape = defineGrape(this.sequelize)
        this.Tasting = defineTasting(this.sequelize)
        this.Member = defineMember(this.sequelize)
        this.WineType = defineWineType(this.sequelize)
        this.Wine = defineWine(this.sequelize)

        this.Wine.belongsTo(this.Country, {
            foreignKey: 'country',
            as: 'countryModel'
        });
        this.Country.hasMany(this.Wine, {
            foreignKey: 'country',
            as: 'wines'
        });

        this.Wine.belongsTo(this.WineType, {
            foreignKey: 'winetype',
            as: 'winetypeModel'
        });
        this.WineType.hasMany(this.Wine, {
            foreignKey: 'winetype',
            as: 'wines'
        });

        this.grapes = new GrapeRepository(this.Grape);
        this.tastings = new TastingRepository(this.Tasting);
        this.countries = new CountryRepository(this.Country, this.Wine);
        this.members = new MemberRepository(this.Member);
        this.wineTypes = new WineTypeRepository(this.WineType, this.Wine);
    }

    async sync() {
        await this.sequelize.sync({ force: true });
    }


    createTables() {
        const opts: SyncOptions = {logging: false}; // TODO: Turn off logging, there's too much!
        return this.sequelize.sync(opts);
    }

    patchGrapeByNameAndColor(from: GrapeAttributes, to: GrapeAttributes) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-update

        return this.Grape.update(
            {name: to.name, color: to.color},
            {where: {name: from.name}}
        );
    }

    async postWine(param: {
        country: number; name: string; systembolaget: number; volume: number; winetype: number
    }) {
        return this.Wine.create(param);
    }

    async findWines(): Promise<WineDto[]> {
        const wines = await this.Wine.findAll(
            {
                include: [
                    {
                        model: this.WineType,
                        as: 'winetypeModel',
                        attributes: ['id', 'name'],
                        required: true
                    },
                    {
                        model: this.Country,
                        as: 'countryModel',
                        attributes: ['id', 'name'],
                        required: true
                    }
                ]
            }
        );
        return wines.map(this.toWineDto);
    }

    private toWineDto(w: WineInstance): WineDto {
        return {
            id: w.id,
            name: w.name,
            systembolaget: w.systembolaget,
            volume: w.volume,
            createdAt: w.createdAt,
            wineType: w.winetypeModel ?? { id: 0, name: '', isUsed: false },
            country: w.countryModel ?? { id: 0, name: '', isUsed: false }
        };
    }


    async delWineById(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }

}
