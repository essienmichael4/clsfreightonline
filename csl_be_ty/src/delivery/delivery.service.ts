import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Confirmation, Delivery, PickupBy, PickupReady, Status } from './entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/user/entities/client.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { DeliveryResponseDto } from './dto/response.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

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
  async findAll(pageOptionsDto: PageOptionsDto) {
    const query = this.deliveryRepo
      .createQueryBuilder('delivery')
      .leftJoin('delivery.client', 'client') // use leftJoin, not leftJoinAndSelect
      .addSelect([
        'client.id',
        'client.name',
        'client.email',
        'client.shippingMark',
      ])
      .orderBy('delivery.createdAt', 'DESC')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [deliveries, total] = await query.getManyAndCount();

    const response = deliveries.map(
      (delivery) => new DeliveryResponseDto(delivery),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(response, pageMetaDto);
  }
  
  async export() {
    const query = this.deliveryRepo
      .createQueryBuilder('delivery')
      .leftJoin('delivery.client', 'client')
      .select([
        'delivery.id AS delivery_id',
        'delivery.phone AS delivery_phone',
        'delivery.location AS delivery_location',
        'delivery.deliveryType AS delivery_type',
        'delivery.status AS delivery_status',
        'client.name AS client_name',
        'client.email AS client_email',
        'client.shippingMark AS client_shipping_mark',
      ])
      .orderBy('delivery.createdAt', 'DESC');

    // Return as raw objects for easier CSV export
    const deliveries = await query.getRawMany();
    return deliveries;
  }

  // 🔹 Get all deliveries for a specific client
  async findAllClientDeliveries(pageOptionsDto: PageOptionsDto, clientId: number) {
    const query = this.deliveryRepo
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.client', 'client')
      .where('client.id = :clientId', { clientId })
      .select([
        'delivery.id',
        'delivery.phone',
        'delivery.location',
        'delivery.loaded',
        'delivery.deliveryType',
        'delivery.pickupBy',
        'delivery.thirdPartyName',
        'delivery.thirdPartyPhone',
        'delivery.status',
        'delivery.isConfirmed',
        'delivery.createdAt',
        'delivery.updatedAt',
        'client.id',
        'client.name',
        'client.email',
        'client.shippingMark',
      ])
      .orderBy('delivery.createdAt', 'DESC')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [deliveries, total] = await query.getManyAndCount();

    const response = deliveries.map(
      (delivery) => new DeliveryResponseDto(delivery),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(response, pageMetaDto);
  }


  async findClientSingleDelivery(id: number, clientId: number) {
    const delivery = await this.deliveryRepo.findOne({
      where: {
        id,
        client: { id: clientId },
      },
      relations: ['client'],
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery ${id} not found for client ${clientId}`);
    }

    return delivery;
  }

  async findOne(id: number) {
    const delivery = await this.deliveryRepo.findOne({
      where: {id},
      relations: {client: true}
    });

    return new DeliveryResponseDto(delivery)
  }

  async edit(id: number, updateDeliveryDto: UpdateDeliveryDto, clientId: number) {
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

  async editReadyForPickup(deliveryId: number, isPickupReady: PickupReady) {
    const delivery = await this.deliveryRepo.findOne({ where: { id: deliveryId } });
    if (!delivery) throw new BadRequestException('Delivery not found');

    delivery.isPickupReady = isPickupReady;
    await this.deliveryRepo.save(delivery);

    return { message: `Delivery ready for pickup updated to ${isPickupReady}`, delivery };
  }

  remove(id: number) {
    return this.deliveryRepo.delete(id)
  }
}
