import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package, Status } from 'src/package/entities/package.entity';
import { PackageType } from 'src/package/entities/packageType.entity';
import { Between, Not, Repository } from 'typeorm';

enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Package) private readonly packageRepo:Repository<Package>,
        @InjectRepository(PackageType) private readonly packageTypeRepo:Repository<PackageType>
    ){}

    async clientDashboardStatistics(from: string, to: string, currency:"USD"|"GHS", clientId: number){
        const results = {
            estimated: {
                name: "estimate",
                stat: await this.calculateEstimate(from, to, currency, clientId)
            },
            packages: {
                name: "all",
                stat: await this.countAllPackages(from, to, clientId)
            },
            undelivered: {
                name: "undelivered",
                stat: await this.countUndeliveredPackages(from, to, clientId)
            },
            delivered: {
                name: "delivered",
                stat: await this.countDeliveredPackages(from, to, clientId)
            }
        }

        return results
    }

    async calculateEstimate(from: string, to: string, currency:"USD"|"GHS", clientId: number){
        const packageType = await this.packageTypeRepo.find()
        const packages = await this.packageRepo.find({
            relations: {
                client: true,
                packageType: true
            },
            where: {
                client: {
                    id: clientId
                },
                createdAt: Between(new Date(from), new Date(to)),
                status: Not(Status.DELIVERED),
                isDeleted: Deleted.FALSE
            }
        })
        
        let estimate = 0;

        for (const pkg of packages) {
            let rate = 0
            if(currency === "USD"){
                rate = pkg?.packageType?.rate || packageType[0]?.rate || 0
            }else if(currency === "GHS"){
                rate = pkg?.packageType?.cedisRate || packageType[0]?.cedisRate || 0
            }

            estimate += pkg.cbm * rate;
        }

        return estimate;
    }

    async countAllPackages(from: string, to: string, clientId: number): Promise<number> {
        const query = await this.packageRepo
            .findAndCount({
                relations: {
                    client: true,
                    packageType: true
                },
                where: {
                    client: {
                        id: clientId
                    },
                    createdAt: Between(new Date(from), new Date(to)),
                    // status: Not(Status.DELIVERED),
                    isDeleted: Deleted.FALSE
                }
            })

        return query[1]
    }

    async countUndeliveredPackages(from: string, to: string, clientId: number): Promise<number> {
        const query = await this.packageRepo
            .findAndCount({
                relations: {
                    client: true,
                    packageType: true
                },
                where: {
                    client: {
                        id: clientId
                    },
                    createdAt: Between(new Date(from), new Date(to)),
                    status: Not(Status.DELIVERED),
                    isDeleted: Deleted.FALSE
                }
            })

        return query[1]
    }

    async countDeliveredPackages(from: string, to: string, clientId: number): Promise<number> {
        const query = await this.packageRepo
            .findAndCount({
                relations: {
                    client: true,
                    packageType: true
                },
                where: {
                    client: {
                        id: clientId
                    },
                    createdAt: Between(new Date(from), new Date(to)),
                    status: Status.DELIVERED,
                    isDeleted: Deleted.FALSE
                }
            })

        return query[1]
    }
}
