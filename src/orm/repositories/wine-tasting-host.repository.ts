import {ModelStatic} from "sequelize";
import {WineTastingHostCreateDto, WineTastingHostDto, WineTastingHostInstance} from "../../types/wine-tasting";


export class WineTastingHostRepository {

    constructor(
        private readonly WineTastingHost: ModelStatic<WineTastingHostInstance>,
    ) {}

    async create(wineTastingId: number, host: WineTastingHostCreateDto): Promise<WineTastingHostDto> {

        const memberId = host.memberId;
        const created = await this.WineTastingHost.create({wineTastingId, memberId});
        return this.toDto(created);
    }


    async findByTastingId(
        wineTastingId: number,
    ): Promise<WineTastingHostDto[]> {
        const hosts = await this.WineTastingHost.findAll({
            where: {wineTastingId: wineTastingId},
        });
        return hosts.map(this.toDto);
    }

    async replaceAll(wineTastingId: number, hosts: WineTastingHostCreateDto[]): Promise<void> {
        await this.WineTastingHost.destroy({ where: { wineTastingId } });
        await Promise.all(
            hosts.map(host => this.WineTastingHost.create({ wineTastingId, memberId: host.memberId }))
        );
    }

    private toDto(host: WineTastingHostInstance): WineTastingHostDto {
        return {
            memberId: host.memberId,
        };
    }
}