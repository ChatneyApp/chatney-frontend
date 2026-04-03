export type SystemConfigId = number;
export enum SystemConfigType {
    Int = 'int',
    IntArray = 'int[]',
    String = 'string',
    StringArray = 'string[]',
}
export type SystemConfigValue = {
    id: SystemConfigId;
    name: string;
    value: string;
    type: SystemConfigType;
}
