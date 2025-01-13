import { PrismaClient } from '@prisma/client';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import { connect } from '@tidbcloud/serverless';
import { PrismockClient } from 'prismock';

/**
 * TiDB Cloud用のPrismaクライアントを作成
 */
export const createPrismaClient = (databaseUrl: string) => {
  const connection = connect({ url: databaseUrl });
  const adapter = new PrismaTiDBCloud(connection);

  const client = new PrismaClient({ adapter });

  return client;
};

// 現状prismockの型定義が誤っており、推論が効かないため、再定義する
// https://github.com/morintd/prismock/issues/871
type Data = Record<string, Item[]>;
type Item = Record<string, unknown>;

interface PrismockData {
  getData: () => Data;
  setData: (data: Data) => void;
  reset: () => void;
}

export type PrismaMockClient = PrismaClient & PrismockData;

/**
 * テスト用のモックPrismaクライアントを作成
 * @see https://github.com/morintd/prismock?tab=readme-ov-file#usage
 */
export const createPrismaMockClient = (): PrismaMockClient => {
  return new PrismockClient() as PrismaMockClient;
};
