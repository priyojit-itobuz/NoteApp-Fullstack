import * as yup from 'yup';

// validation conditions or schema using yup
export const signupUser = yup.object({
    userName: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

export const loginUser = yup.object({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

export const noteValidation = yup.object({
    title: yup.string().trim().min(3, 'Title must be at least 3 characters'),
    content: yup.string()
})