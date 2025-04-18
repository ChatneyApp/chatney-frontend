import { useForm, Controller } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import styles from './CreateRoleForm.module.css';

// Define the GraphQL queries and mutations
const GET_PERMISSIONS_LIST = gql`
  query getPermissionsList {
    getPermissionsList {
      groups {
        label
        list
      }
    }
  }
`;

const CREATE_ROLE = gql`
  mutation CreateRole($roleData: CreateRoleDTO!) {
    createRole(RoleData: $roleData) {
      Id
      Name
      Permissions
      Settings {
        Base
      }
    }
  }
`;

type FormInputs = {
  name: string;
  permissions: string[];
  isBaseRole: boolean;
};

// Define the type for permission groups
type PermissionGroup = {
  label: string;
  list: string[];
};

export const CreateRoleForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Fetch permissions list
  const { data: permissionsData, loading: permissionsLoading, error: permissionsError } = useQuery(GET_PERMISSIONS_LIST);
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      permissions: [],
      isBaseRole: false
    }
  });

  const [createRole, { loading }] = useMutation(CREATE_ROLE, {
    onCompleted: (data) => {
      setSuccessMessage(`Role "${data.createRole.Name}" created successfully!`);
      setErrorMessage(null);
      reset();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setErrorMessage(`Error creating role: ${error.message}`);
      setSuccessMessage(null);
    }
  });

  const onSubmit = (data: FormInputs) => {
    createRole({
      variables: {
        roleData: {
          Name: data.name,
          Permissions: data.permissions,
          Settings: {
            Base: data.isBaseRole
          }
        }
      }
    });
  };

  // Get permission groups from the query result or show loading/error state
  const permissionGroups: PermissionGroup[] = permissionsData?.getPermissionsList?.groups || [];

  return (
    <div className={styles.formContainer}>
      <h2>Create New Role</h2>
      
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      {permissionsError && <div className={styles.errorMessage}>Error loading permissions: {permissionsError.message}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Role Name</label>
          <input
            id="name"
            {...register("name", { required: "Role name is required" })}
            className={styles.input}
          />
          {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Role Permissions</label>
          {permissionsLoading ? (
            <div>Loading permissions...</div>
          ) : (
            permissionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.permissionGroup}>
                <h4>{group.label}</h4>
                <div className={styles.permissionList}>
                  {group.list.map((permission, permIndex) => (
                    <div key={permIndex} className={styles.permissionItem}>
                      <label>
                        <input
                          type="checkbox"
                          {...register("permissions")}
                          value={permission}
                        />
                        {permission.split('.')[1]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              {...register("isBaseRole")}
            />
            Is Base Role
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading || permissionsLoading}
        >
          {loading ? 'Creating...' : 'Create Role'}
        </button>
      </form>
    </div>
  );
};
