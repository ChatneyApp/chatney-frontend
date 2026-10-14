import type { ConfigFieldsFragment } from '@/graphql/generated/graphql';

export type SystemConfigId = number;
export enum SystemConfigType {
    Int = 'int',
    IntArray = 'int[]',
    String = 'string',
    StringArray = 'string[]',
}
export type SystemConfigValue = ConfigFieldsFragment;
