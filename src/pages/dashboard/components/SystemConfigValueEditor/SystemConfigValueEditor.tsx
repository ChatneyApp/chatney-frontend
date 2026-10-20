import { useTranslation } from 'react-i18next';

import { SystemConfigValue } from '@/types/systemConfig';
import styles from './SystemConfigValueEditor.module.css';
import { SystemConfigValueForm } from '@/pages/dashboard/components/SystemConfigValueForm/SystemConfigValueForm';

type Props = {
    systemConfigValue: SystemConfigValue;
}

export const SystemConfigValueEditor = ({ systemConfigValue }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {systemConfigValue.name}
            </div>
            <div className={styles.value}>
                {systemConfigValue.value}
            </div>
            <div className={styles.controls}>
                <SystemConfigValueForm cta={t('common.edit')} title={t('dashboard.config.editTitle', { name: systemConfigValue.name })} submitText={t('common.saveChanges')} systemConfigValue={systemConfigValue}/>
            </div>
        </div>
    );
};
