import { type ComponentType, PropsWithChildren } from 'react';

type ProviderComponent = ComponentType<PropsWithChildren>;

export function composeProviders(providers: ProviderComponent[]) {
    return providers.reduce(
        (AccumulatedProviders, CurrentProvider) =>
            ({ children }: PropsWithChildren) =>
            (
                <AccumulatedProviders>
                    <CurrentProvider>{children}</CurrentProvider>
                </AccumulatedProviders>
            ),
        ({ children }: PropsWithChildren) => children
    );
}
