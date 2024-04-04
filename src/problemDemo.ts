import { Model, Optional } from "sequelize";


interface SomeAttributes {
    id: number,
    name: string
}

interface   SomeValues extends Model<SomeAttributes>, SomeAttributes {}
//interface  SomeInstance extends Sequelize.Instance<SomeAttributes>, SomeAttributes {}
type  SomeCreationAttributes = Optional<SomeAttributes, 'id'>
