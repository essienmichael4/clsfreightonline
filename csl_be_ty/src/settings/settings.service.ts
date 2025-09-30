import { Injectable } from '@nestjs/common';
import { Helpline } from './entities/helpline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { InvoiceAddress } from './entities/address.entity';
import { BankDto, CreateInvoiceAddressDto, HelplineDto, MarqueDto, WarehouseDto } from './dto/request.dto';
import { Bank } from './entities/bank.entity';
import { Marque, Show } from './entities/marque.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Helpline) private readonly helplineRepo:Repository<Helpline>, 
        @InjectRepository(Bank) private readonly bankRepo:Repository<Bank>, 
        @InjectRepository(Marque) private readonly marqueRepo:Repository<Marque>, 
        @InjectRepository(Warehouse) private readonly warehouseRepo:Repository<Warehouse>, 
        @InjectRepository(InvoiceAddress) private readonly invoiceAddressRepo:Repository<InvoiceAddress>, 
        private userService: UserService,
    ){}

    async createInvoiceAddress(invoiceDto: CreateInvoiceAddressDto){
        const invoiceEntity = this.invoiceAddressRepo.create()
        const saveEntity = {
            ...invoiceEntity,
            streetAddress: invoiceDto.streetAddress,
            name: invoiceDto.name,
            addressLine: invoiceDto.addressLine,
            city: invoiceDto.city,
            state: invoiceDto.state,
            box: invoiceDto.box
        }

        return await this.invoiceAddressRepo.save(saveEntity)
    }

    async createMarqueAnnouncement(marqueDto: MarqueDto, updatedBy:number){
        const user = await this.userService.findUserById(updatedBy)
        const marqueEntity = this.marqueRepo.create()
        const saveEntity = {
            ...marqueEntity,
            announcement: marqueDto.announcement,
            ...(marqueDto.isShown && {isShown: marqueDto.isShown}),
            updatedBy:  user || undefined
        }

        return await this.marqueRepo.save(saveEntity)
    }

    async createWarehouse(warehouseDto: WarehouseDto){
        const warehouseEntity = this.warehouseRepo.create()
        const saveEntity = {
            ...warehouseEntity,
            name: warehouseDto.name,
            description: warehouseDto.description,
        }

        return await this.warehouseRepo.save(saveEntity)
    }

    async createBank(bankDto: BankDto){
        const bankEntity = this.bankRepo.create()
        const saveEntity = {
            ...bankEntity,
            name: bankDto.name,
            branch: bankDto.branch,
            accountNumber: bankDto.accountNumber,
            accountName: bankDto.accountName
        }

        return await this.bankRepo.save(saveEntity)
    }

    async createHelpline(helplineDto: HelplineDto){
        const helplineEntity = this.helplineRepo.create()
        const saveEntity = {
            ...helplineEntity,
            phone: helplineDto.phone,
        }

        return await this.helplineRepo.save(saveEntity)
    }

    findWarehouses(){
        return this.warehouseRepo.find()
    }

    findAllMarqueAnnouncement(){
        return this.marqueRepo.find()
    }

    findMarqueAnnouncementForUser(){
        return this.marqueRepo.find({
            where: {
                isShown: Show.TRUE
            }
        })
    }

    findBanks(){
        return this.bankRepo.find()
    }

    findHelplines(){
        return this.helplineRepo.find()
    }

    findInvoiceAddress(){
        return this.invoiceAddressRepo.findOne({
            where: {},
            order: {
                id: "DESC"
            }
        })
    }

    async updateMarqueAnnouncement(id:number, marqueDto: MarqueDto, updatedBy:number){
        const user = await this.userService.findUserById(updatedBy)
        return await this.marqueRepo.update(id, {
            announcement: marqueDto.announcement,
            updatedBy:  user || undefined
        })
    }

    updateInvoiceAddress(id:number, invoiceAddressDto: CreateInvoiceAddressDto){
        return this.invoiceAddressRepo.update(id, {
            state: invoiceAddressDto.state,
            name: invoiceAddressDto.name,
            streetAddress: invoiceAddressDto.streetAddress,
            addressLine: invoiceAddressDto.addressLine,
            city: invoiceAddressDto.city,
            box: invoiceAddressDto.box
        })
    }

    updateWarehouse(id:number, warehouseDto: WarehouseDto){
        return this.warehouseRepo.update(id, {
            description: warehouseDto.description,
            name: warehouseDto.name,
        })
    }

    updateBank(id:number, bankDto: BankDto){
        return this.bankRepo.update(id, {
            accountName: bankDto.accountName,
            name: bankDto.name,
            branch: bankDto.branch,
            accountNumber: bankDto.accountNumber
        })
    }

    updateHelpline(id:number, helplineDto: HelplineDto){
        return this.helplineRepo.update(id, {
            phone: helplineDto.phone,
        })
    }

    async updateStatus(id: number, updatedBy:number, show:Show)  {
        const user = await this.userService.findUserById(updatedBy)

        await this.marqueRepo.update(id, {
            isShown: show,
            updatedBy:  user || undefined
        });

        return await this.marqueRepo.findOneBy({id})
    }

    deleteMarqueAnnouncement(id: number){
        return this.marqueRepo.delete(id);
    }
}
