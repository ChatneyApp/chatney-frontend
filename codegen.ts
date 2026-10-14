import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: './graphql/schema.graphql',
    documents: ['src/**/*.{ts,tsx}', '!src/graphql/generated/**'],
    ignoreNoDocuments: false,
    generates: {
        './src/graphql/generated/': {
            preset: 'client',
            presetConfig: {
                fragmentMasking: false,
            },
            config: {
                useTypeImports: true,
                strictScalars: true,
                enumsAsTypes: true,
                scalars: {
                    UUID: 'string',
                    DateTime: 'string',
                    Long: 'number',
                    Upload: 'File',
                },
            },
        },
    },
};

export default config;
