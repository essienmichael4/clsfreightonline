import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientAnonymizationJob {
  private readonly logger = new Logger(ClientAnonymizationJob.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Runs every day at 02:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async anonymizeSoftDeletedClients() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .createQueryBuilder()
        .update(Client)
        .set({
          name: null,
          phone: null,
          email: () => `'anonymized_' || id || '@deleted.local'`,
          shippingMark: () => `'DELETED-' || id`,
          accountStage: 'anonymized',
        })
        .where('deletedAt IS NOT NULL')
        .andWhere(`deletedAt < NOW() - INTERVAL '30 days'`)
        .execute();

      await queryRunner.commitTransaction();

      this.logger.log(
        `Anonymized ${result.affected ?? 0} soft-deleted client(s)`
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Client anonymization failed', error);
    } finally {
      await queryRunner.release();
    }
  }
}
