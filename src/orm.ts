import {ModelStatic, Options, Sequelize, SyncOptions} from 'sequelize';
import {GrapeInstance} from "./types/grape";
import {CountryInstance} from "./types/country";
import {WineTypeInstance} from "./types/wine-type";
import {WineInstance} from "./types/wine";
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
import {WineRepository} from "./orm/repositories/wine.repository";
import {defineWineTastingHost} from "./orm/models/wine-tasting-host.model";

export class Orm {


    sequelize: Sequelize;
    readonly grapes: GrapeRepository;
    readonly tastings: TastingRepository;
    readonly countries: CountryRepository;
    readonly members: MemberRepository;
    readonly wineTypes: WineTypeRepository;
    readonly wines: WineRepository;




    constructor(database: string, dbUserName: string, dbPassword: string, options: Options) {
        this.sequelize = new Sequelize(database, dbUserName, dbPassword, options);

        const country: ModelStatic<CountryInstance> = defineCountry(this.sequelize);
        const grape: ModelStatic<GrapeInstance> = defineGrape(this.sequelize);
        const tasting = defineTasting(this.sequelize);
        const member = defineMember(this.sequelize);
        const wineType = defineWineType(this.sequelize);
        const tastingHost = defineWineTastingHost(this.sequelize);
        const wine = defineWine(this.sequelize);

        this.defineModelAssociations(country, wine, wineType);

        this.grapes = new GrapeRepository(grape);
        this.tastings = new TastingRepository(tasting, tastingHost);
        this.countries = new CountryRepository(country, wine);
        this.members = new MemberRepository(member);
        this.wineTypes = new WineTypeRepository(wineType, wine);
        this.wines = new WineRepository(wine, country, wineType);
    }

    private defineModelAssociations(
        country: ModelStatic<CountryInstance>,
        wine: ModelStatic<WineInstance>,
        wineType: ModelStatic<WineTypeInstance>,
    ) {
        wine.belongsTo(country, {
            foreignKey: 'country_id',
            as: 'countryModel'
        });
        country.hasMany(wine, {
            foreignKey: 'country_id',
            as: 'wines'
        });

        wine.belongsTo(wineType, {
            foreignKey: 'wine_type_id',
            as: 'winetypeModel'
        });
        wineType.hasMany(wine, {
            foreignKey: 'wine_type_id',
            as: 'wines'
        });
    }

    async sync() {
        await this.sequelize.sync({ force: true });
    }


    createTables() {
        const opts: SyncOptions = {logging: false}; // TODO: Turn off logging, there's too much!
        return this.sequelize.sync(opts);
    }

}
