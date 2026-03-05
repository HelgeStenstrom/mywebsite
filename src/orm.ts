import {ModelStatic, Options, Sequelize, SyncOptions} from 'sequelize';
import {GrapeInstance} from "./types/grape";
import {MemberInstance} from "./types/member";
import {TastingInstance} from "./types/wine-tasting";
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
    private readonly Grape: ModelStatic<GrapeInstance>;
    private readonly Tasting: ModelStatic<TastingInstance>;
    private readonly Country: ModelStatic<CountryInstance>;
    private readonly Wine: ModelStatic<WineInstance>;
    private readonly WineType: ModelStatic<WineTypeInstance>;
    private readonly Member: ModelStatic<MemberInstance>;
    private readonly TastingHost: ModelStatic<any>;
    readonly grapes: GrapeRepository;
    readonly tastings: TastingRepository;
    readonly countries: CountryRepository;
    readonly members: MemberRepository;
    readonly wineTypes: WineTypeRepository;
    readonly wines: WineRepository;




    constructor(database: string, dbUserName: string, dbPassword: string, options: Options) {
        this.sequelize = new Sequelize(database, dbUserName, dbPassword, options);


        this.Country = defineCountry(this.sequelize);
        this.Grape = defineGrape(this.sequelize);
        this.Tasting = defineTasting(this.sequelize);
        this.Member = defineMember(this.sequelize);
        this.WineType = defineWineType(this.sequelize);
        this.Wine = defineWine(this.sequelize);
        this.TastingHost = defineWineTastingHost(this.sequelize)

        this.defineModelAssociations();

        this.grapes = new GrapeRepository(this.Grape);
        this.tastings = new TastingRepository(this.Tasting, this.TastingHost);
        this.countries = new CountryRepository(this.Country, this.Wine);
        this.members = new MemberRepository(this.Member);
        this.wineTypes = new WineTypeRepository(this.WineType, this.Wine);
        this.wines = new WineRepository(this.Wine, this.Country, this.WineType);
    }

    private defineModelAssociations() {
        this.Wine.belongsTo(this.Country, {
            foreignKey: 'country_id',
            as: 'countryModel'
        });
        this.Country.hasMany(this.Wine, {
            foreignKey: 'country_id',
            as: 'wines'
        });

        this.Wine.belongsTo(this.WineType, {
            foreignKey: 'wine_type_id',
            as: 'winetypeModel'
        });
        this.WineType.hasMany(this.Wine, {
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
