import { Model } from "sequelize";

interface SomeAttributes {
    id: number,
    name: string
}

interface SomeValues extends Model<SomeAttributes>, SomeAttributes {} // Yields analysis error with no error text.
