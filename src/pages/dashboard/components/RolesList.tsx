import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { RoleEditor } from '@/pages/dashboard/components/RoleEditor/RoleEditor';
import { CreateRoleForm } from '@/pages/dashboard/components/RoleForm/CreateRoleForm';
import { RolesListProvider, useRolesList } from '@/contexts/RolesListContext';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const RolesListCore = () => {
    const { t } = useTranslation();
    const { roles } = useRolesList();

    return <div>
        {roles.map(role => (
            <RoleEditor key={role.id} role={role}/>
        ))}
        {!roles.length && (
            <EmptyListMessage>
                {t('dashboard.roles.empty')}
            </EmptyListMessage>
        )}
    </div>;
};

export const RolesList = () => {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <RolesListProvider>
                    <CreateRoleForm cta={t('dashboard.roles.create')} title={t('dashboard.roles.createTitle')} submitText={t('dashboard.roles.createTitle')}/>
                    <RolesListCore/>
                </RolesListProvider>
            </Suspense>
        </>
    );
};
