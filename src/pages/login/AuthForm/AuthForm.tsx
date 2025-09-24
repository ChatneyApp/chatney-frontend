import { Tabs } from 'radix-ui';

import { TabsContent, TabsList, TabsTrigger } from '@/pages/dashboard/components/Tabs/Tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

enum AuthFormType {
    LOGIN = 'login',
    REGISTER = 'register',
}
const DEFAULT_FORM = AuthFormType.LOGIN;

export const AuthForm = () => {
    return (
        <div className="w-1/2 m-auto">
            <Tabs.Root
                defaultValue={DEFAULT_FORM}
            >
                <TabsList aria-label="Manage your account">
                    <TabsTrigger value={AuthFormType.LOGIN}>Login</TabsTrigger>
                    <TabsTrigger value={AuthFormType.REGISTER}>Register</TabsTrigger>
                </TabsList>
                <TabsContent value={AuthFormType.LOGIN}>
                    <LoginForm />
                </TabsContent>
                <TabsContent value={AuthFormType.REGISTER}>
                    <RegisterForm />
                </TabsContent>
            </Tabs.Root>
        </div>
    );
};
