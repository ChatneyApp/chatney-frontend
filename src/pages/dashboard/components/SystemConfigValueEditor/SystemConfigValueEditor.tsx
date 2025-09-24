import {SystemConfigValue} from '@/types/systemConfig';
import styles from './SystemConfigValueEditor.module.css';
import {SystemConfigValueForm} from '@/pages/dashboard/components/SystemConfigValueForm/SystemConfigValueForm';

type Props = {
    systemConfigValue: SystemConfigValue;
}

export const SystemConfigValueEditor = ({systemConfigValue}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {systemConfigValue.name}
            </div>
            <div className={styles.value}>
                {systemConfigValue.value}
            </div>
            <div className={styles.controls}>
                <SystemConfigValueForm cta="Edit" title={`Edit ${systemConfigValue.name}`} submitText="Save Changes" systemConfigValue={systemConfigValue}/>
            </div>
        </div>
    );
};
