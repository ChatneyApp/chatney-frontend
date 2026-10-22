import type { ConfigFieldsFragment } from '@/graphql/generated/graphql';

export type SystemConfigId = number;
export enum SystemConfigType {
    Bool = 'bool',
    Int = 'int',
    IntArray = 'int[]',
    String = 'string',
    StringArray = 'string[]',
}
export type SystemConfigValue = ConfigFieldsFragment;
