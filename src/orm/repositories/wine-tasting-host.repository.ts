import {ModelStatic} from "sequelize";
import {WineTastingHostCreateDto, WineTastingHostDto, WineTastingHostInstance} from "../../types/wine-tasting";


export class WineTastingHostRepository {

    constructor(
        private readonly WineTastingHost: ModelStatic<WineTastingHostInstance>,
    ) {}

    async create(wineTastingId: number, host: WineTastingHostCreateDto): Promise<WineTastingHostDto> {

        const memberId = host.memberId;
        return this.WineTastingHost.create({wineTastingId, memberId});
    }


    async findByTastingId(
        wineTastingId: number,
    ): Promise<WineTastingHostDto[]> {
        const hosts = await this.WineTastingHost.findAll({
            where: {wineTastingId: wineTastingId},
        });
        return hosts.map(this.toDto);
    }

    private toDto(host: WineTastingHostInstance): WineTastingHostDto {
        return {
            memberId: host.memberId,
        };
    }
}