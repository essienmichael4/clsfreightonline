import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Confirmation, Delivery, PickupBy, Status } from './entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/user/entities/client.entity';

@Injectable()
export class DeliveryService {
  constructor (
    @InjectRepository(Delivery) private readonly deliveryRepo:Repository<Delivery>, 
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>, 
  ){}

  async create(createDeliveryDto: CreateDeliveryDto, clientId:number) {
    try{
      // 1️⃣ Validate client existence
      const client = await this.clientRepo.findOne({where: {id: clientId}})
      if(!client) throw new BadRequestException("Client does not exist")

        // 2️⃣ Validate third-party pickup details
      if(createDeliveryDto.pickupBy === PickupBy.THIRD_PARTY){
        if(!createDeliveryDto.thirdPartyName || !createDeliveryDto.thirdPartyPhone) throw new BadRequestException("All thrid party details must be fully provided")
      }

      // 3️⃣ Create the delivery entity directly using `this.deliveryRepo.create()`
      const delivery = this.deliveryRepo.create({
        deliveryType: createDeliveryDto.deliveryType,
        phone: createDeliveryDto.phone,
        pickupBy: createDeliveryDto.pickupBy,
        loaded: createDeliveryDto.loadedDate,
        location: createDeliveryDto.location,
        ...(createDeliveryDto.pickupBy === PickupBy.THIRD_PARTY && {
          thirdPartyName: createDeliveryDto.thirdPartyName,
          thirdPartyPhone: createDeliveryDto.thirdPartyPhone,
        }),
        client,
      });

      // 4️⃣ Save the delivery entity
      return await this.deliveryRepo.save(delivery)
    }catch(err){
      throw err instanceof BadRequestException ? err : new BadRequestException(err.message);
    }
  }

  // 🔹 Get all deliveries (optionally include client)
  async findAll(includeClient = false) {
    return this.deliveryRepo.find({
      relations: includeClient ? ['client'] : [],
      order: { createdAt: 'DESC' },
    });
  }

  // 🔹 Get all deliveries for a specific client
  async findAllClientDeliveries(clientId: number) {
    return this.deliveryRepo.find({
      where: { client: { id: clientId } },
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  async edit(id: number, updateDeliveryDto: CreateDeliveryDto, clientId: number) {
    try {
      // 1️⃣ Validate client existence
      const client = await this.clientRepo.findOne({ where: { id: clientId } });
      if (!client) {
        throw new BadRequestException("Client does not exist");
      }

      // 2️⃣ Find existing delivery record
      const delivery = await this.deliveryRepo.findOne({
        where: { id },
        relations: ['client'],
      });

      if (!delivery) {
        throw new BadRequestException("Delivery not found");
      }

      // 3️⃣ Validate third-party pickup details
      if (updateDeliveryDto.pickupBy === PickupBy.THIRD_PARTY) {
        const { thirdPartyName, thirdPartyPhone } = updateDeliveryDto;
        if (!thirdPartyName || !thirdPartyPhone) {
          throw new BadRequestException("All third party details must be fully provided");
        }
      }

      // 4️⃣ Merge updated fields
      Object.assign(delivery, {
        deliveryType: updateDeliveryDto.deliveryType ?? delivery.deliveryType,
        phone: updateDeliveryDto.phone ?? delivery.phone,
        pickupBy: updateDeliveryDto.pickupBy ?? delivery.pickupBy,
        loaded: updateDeliveryDto.loadedDate ?? delivery.loaded,
        location: updateDeliveryDto.location ?? delivery.location,
        ...(updateDeliveryDto.pickupBy === PickupBy.THIRD_PARTY && {
          thirdPartyName: updateDeliveryDto.thirdPartyName,
          thirdPartyPhone: updateDeliveryDto.thirdPartyPhone,
        }),
        client,
      });

      // 5️⃣ Save and return updated delivery
      const updatedDelivery = await this.deliveryRepo.save(delivery);
      return updatedDelivery;
    } catch (err) {
      console.error("Error editing delivery:", err);
      throw err instanceof BadRequestException
        ? err
        : new BadRequestException(err.message || "Failed to edit delivery");
    }
  }

  async editStatus(deliveryId: number, status: Status) {
    try {
      const delivery = await this.deliveryRepo.findOne({ where: { id: deliveryId } });
      if (!delivery) throw new BadRequestException("Delivery not found");

      delivery.status = status;
      await this.deliveryRepo.save(delivery);

      return { message: `Delivery status updated to ${status}`, delivery };
    } catch (err) {
      throw err;
    }
  }

  async editConfirmation(deliveryId: number, confirmation: Confirmation) {
    const delivery = await this.deliveryRepo.findOne({ where: { id: deliveryId } });
    if (!delivery) throw new BadRequestException('Delivery not found');

    delivery.isConfirmed = confirmation;
    await this.deliveryRepo.save(delivery);

    return { message: `Delivery confirmation updated to ${confirmation}`, delivery };
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
