'use client';
import { useEditUserMutation } from '@/store/apis/userApi';
import { openPopup } from '@/store/slices/popupSlice';
import { Role, RoleName, User, UserFormEdit } from '@/types/user';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import SpinnerBtn from '../ui/SpinnerBtn';

interface FormEditUserProps {
  roles: Role[];
  user: User;
}

const FormEditUser = ({ roles, user }: FormEditUserProps) => {
  const router = useRouter();
  const [editUser, { isError, error, isLoading }] = useEditUserMutation();
  const dispatch = useDispatch();

  const initialValues: UserFormEdit = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role?.name as RoleName,
  };

  const validationSchema = yup.object().shape({
    first_name: yup.string().required().min(4).max(50),
    last_name: yup.string().required().min(4).max(50),
    email: yup.string().email().required().min(4).max(100),
    role: yup.string().oneOf(Object.values(RoleName)).required(),
  });

  const submitForm = async (values: UserFormEdit) => {
    const res = await editUser({ id: user.id, ...values });
    if ('data' in res) {
      router.refresh();
      dispatch(openPopup('User has been edited!'));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >
      {(formik) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
        } = formik;
        return (
          <form
            onSubmit={handleSubmit}
            noValidate
            className='w-full border border-gray-400 rounded-md px-3 py-8 md:px-5 md:py-12 relative'
          >
            <h2 className='text-xl text-center mb-10 sm:text-2xl'>Edit user</h2>
            <div className='flex justify-between items-center mb-3'>
              <label className='text-sm sm:text-lg'>First name</label>
              {errors.first_name && touched.first_name && (
                <p className='text-red-500 text-xs first-letter:capitalize sm:text-base'>
                  {errors.first_name}
                </p>
              )}
            </div>
            <input
              name='first_name'
              type='text'
              value={values.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className='border-b border-solid border-x-0 border-gray-400 border-t-0 w-full mb-10 p-2 sm:text-lg'
            />
            <div className='flex justify-between items-center mb-3'>
              <label className='text-sm sm:text-lg'>Last name</label>
              {errors.last_name && touched.last_name && (
                <p className='text-red-500 text-xs first-letter:capitalize sm:text-base'>
                  {errors.last_name}
                </p>
              )}
            </div>
            <input
              name='last_name'
              type='text'
              value={values.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className='border-b border-solid border-x-0 border-gray-400 border-t-0 w-full mb-10 p-2 sm:text-lg'
            />
            <div className='flex justify-between items-center mb-3'>
              <label className='text-sm sm:text-lg'>Email</label>
              {errors.email && touched.email && (
                <p className='text-red-500 text-xs first-letter:capitalize sm:text-base'>
                  {errors.email}
                </p>
              )}
            </div>
            <input
              name='email'
              type='text'
              step={0.01}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className='border-b border-solid border-x-0 border-gray-400 border-t-0 w-full mb-10 p-2 sm:text-lg'
            />
            <div className='flex justify-between items-center mb-3'>
              <label className='text-sm sm:text-lg'>Role</label>
              {errors.role && touched.role && (
                <p className='text-red-500 text-xs first-letter:capitalize sm:text-base'>
                  {errors.role}
                </p>
              )}
            </div>
            <select
              name='role'
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className='border-b border-solid border-x-0 border-gray-400 border-t-0 w-full mb-10 p-2 sm:text-lg'
            >
              <option value=''>Choose role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <button className='bg-yellow-500 w-full py-2 rounded-md hover:bg-yellow-800 transition-all duration-500 text-white mb-2 sm:text-lg'>
              Edit user
              {isLoading && <SpinnerBtn />}
            </button>
            {isError && error && 'status' in error && 'data' in error && (
              <p className='text-red-500 text-xs first-letter:capitalize sm:text-base absolute bottom-3 left-1/2 translate-x-[-50%]'>
                {(error.data as { error: string }).error}
              </p>
            )}
          </form>
        );
      }}
    </Formik>
  );
};

export default FormEditUser;
