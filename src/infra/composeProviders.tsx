import { ReactNode } from "react";

type ProviderProps = {
    children: React.ReactNode;
};

type ProviderComponent = React.ComponentType<ProviderProps>;


export function composeProviders(providers: ProviderComponent[]) {
    return providers.reduce(
        (AccumulatedProviders, CurrentProvider) =>
            ({ children }: { children: ReactNode }) =>
            (
                <AccumulatedProviders>
                    <CurrentProvider>{children}</CurrentProvider>
                </AccumulatedProviders>
            ),
        ({ children }: { children: ReactNode }) => <>{children}</> // initial accumulator
    );
}
