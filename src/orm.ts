import {DataTypes, ModelStatic, Options, Sequelize, SyncOptions} from 'sequelize';
import {GrapeAttributes, GrapeColor, GrapeCreate, GrapeDto, GrapeInstance} from "./types/grape";
import {MemberDto, MemberInstance} from "./types/member";
import {TastingDto, TastingInstance} from "./types/tasting";
import {CountryDto, CountryInstance, CountryWithWines} from "./types/country";
import {WineTypeDto, WineTypeInstance, WineTypeWithWines} from "./types/wine-type";
import {WineDto, WineInstance} from "./types/wine";


function defineCountry(sequelize: Sequelize) {
    return sequelize.define<CountryInstance>(
        'countryModel',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false
            }
        },
        {
            tableName: 'countries',
            timestamps: false
        }
    );
}

function defineGrape(sequelize1: Sequelize) {
    return sequelize1.define<GrapeInstance>("grape",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.TEXT,
            color: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['blå', 'grön', 'annan', 'okänd']]
                }
            }
        },
        {
            timestamps: false,
            tableName: "grapes"
        }
    );
}

function defineTasting(sequelize1: Sequelize): ModelStatic<TastingInstance> {
    return sequelize1.define("tasting",
        {
            title: DataTypes.STRING(128),
            notes: DataTypes.TEXT('long'),
            date: DataTypes.DATE
        },
        {
            timestamps: false,
            tableName: "tasting"
        }
    );
}

function defineMember(sequelize1: Sequelize): ModelStatic<MemberInstance> {
    return sequelize1.define("member",
        {
            given: DataTypes.TEXT,
            surname: DataTypes.TEXT,
        },
        {
            timestamps: false,
            tableName: "members"
        }
    );
}

function defineWineType(sequelize1: Sequelize): ModelStatic<WineTypeInstance> {
    return sequelize1.define("winetypeModel",
        {
            name: DataTypes.STRING(20),
        },
        {
            timestamps: false,
            tableName: "winetypes"
        }
    );
}

function defineWine(sequelize1: Sequelize): ModelStatic<WineInstance> {
    return sequelize1.define("wine",
        {
            name: DataTypes.STRING(256),
            systembolaget: DataTypes.INTEGER,
            volume: DataTypes.INTEGER,

            createdAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            timestamps: false,
            tableName: "wines"
        }
    );
}

export class Orm {


    sequelize: Sequelize;
    private readonly Grape: ModelStatic<GrapeInstance>;
    private readonly Tasting: ModelStatic<TastingInstance>;
    private readonly Country: ModelStatic<CountryInstance>;
    private readonly Wine: ModelStatic<WineInstance>;
    private readonly WineType: ModelStatic<WineTypeInstance>;
    private readonly Member: ModelStatic<MemberInstance>;




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
    }

    async sync() {
        await this.sequelize.sync({ force: true });
    }


    createTables() {
        const opts: SyncOptions = {logging: false}; // TODO: Turn off logging, there's too much!
        return this.sequelize.sync(opts);
    }

    findTastings(): Promise<TastingDto[]> {
        const tastings = this.Tasting.findAll();
        return tastings.then(ts => ts.map(t => this.toTastingDto(t)));
    }

    async getTasting(id: number): Promise<TastingDto | null> {
        const tasting = await this.Tasting.findByPk(id);

        if (!tasting) {
            return null;
        }

        return this.toTastingDto(tasting);
    }

    findGrapes(): Promise<GrapeDto[]> {
        return this.Grape.findAll()
            .then(grapes =>
                grapes.map(g => ({
                    id: g.id,
                    name: g.name,
                    color: g.color  as 'blå' | 'grön' | null
                }))
            );
    }

    async findMembers(): Promise<MemberDto[]> {
        const members = await this.Member.findAll();
        return members.map(m => this.toMemberDto(m));
    }


    /**
     * Return all countries in the database.
     */
    async findCountries(): Promise<CountryDto[]> {
        const countries = await this.Country.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']], // sortera alfabetiskt
            include: [
                {
                    model: this.Wine,
                    as: 'wines',
                    attributes: ['id'],
                    required: false,
                }
            ]
        }) as CountryWithWines[];

        return countries.map(c => ({
            id: c.id,
            name: c.name,
            isUsed: c.wines?.length > 0
        }));
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


    async postGrape(grape: GrapeCreate): Promise<GrapeDto> {
        const created = await this.Grape.create(grape);
        return this.toGrapeDto(created);
    }

    postTasting(tasting) {
        return this.Tasting.create(tasting);
    }

    async postCountry(country): Promise<CountryDto> {
        const created = await this.Country.create(country);
        return {
            id: created.id,
            name: created.name,
            isUsed: false
        };
    }

    postMember(member) {
        return this.Member.create(member);
    }

    delGrape(name: string) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-destroy
        return this.Grape.destroy({
            where: {name: name}
        });
    }

    delGrapeById(id: number) {
        return this.Grape.destroy({where: {id: id}})
    }

    async getGrape(id: number): Promise<GrapeDto | null>  {
        const grape = await this.Grape.findByPk(id);
        if (!grape) {
            return null;
        }

        return this.toGrapeDto(grape);
    }

    private toGrapeDto(grape: GrapeInstance): GrapeDto {
        return {
            id: grape.id,
            name: grape.name,
            color: grape.color as GrapeColor
        };
    }

    private toTastingDto(t: TastingInstance): TastingDto {
        return {
            id: t.id,
            title: t.title,
            notes: t.notes,
            date: t.date
        };
    }

    private toCountryDto(c: CountryWithWines): CountryDto {
        return {
            id: c.id,
            name: c.name,
            isUsed: c.wines?.length > 0
        };
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

    private toMemberDto(m: MemberInstance): MemberDto {
        return {
            id: m.id,
            given: m.given,
            surname: m.surname,
        };
    }

    patchGrapeByNameAndColor(from: GrapeAttributes, to: GrapeAttributes) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-update

        return this.Grape.update(
            {name: to.name, color: to.color},
            {where: {name: from.name}}
        );
    }

    async findWineTypes(): Promise<WineTypeDto[]> {
        const models = await this.WineType.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
            include: [
                {
                    model: this.Wine,
                    as: 'wines',
                    attributes: ['id'],
                    required: false
                }
            ]
        }) as WineTypeWithWines[];

        return models.map(t => ({
            id: t.id,
            name: t.name,
            isUsed: t.wines?.length > 0
        }));
    }


    async postWineType(param: { name: string }) {
        return this.WineType.create(param);
    }

    async delWineById(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }

    async delCountryById(id: number) {
        const country: CountryWithWines = await this.Country.findByPk(id, {
            include: [{ model: this.Wine, as: 'wines', attributes: ['id'], required: false }]
        });

        if (!country) {
            return 'not_found';
        }
        if (country.wines?.length > 0) {
            return 'in_use';
        }

        await this.Country.destroy({where: {id: id}})
        return 'deleted';
    }

    async delWineTypeById(id: any) {
        const wineType: CountryWithWines = await this.WineType.findByPk(id, {
            include: [{ model: this.Wine, as: 'wines', attributes: ['id'], required: false }]
        });

        if (!wineType) {
            return 'not_found';
        }
        if (wineType.wines?.length > 0) {
            return 'in_use';
        }

        await this.WineType.destroy({where: {id: id}})
        return 'deleted';
    }
}
