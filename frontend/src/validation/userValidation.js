import * as yup from 'yup';

// validation conditions or schema using yup
export const signupUser = yup.object({
    userName: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    email: yup.string().required('Email is required').email('Invalid email format').email("Must include special Character"),
    password: yup.string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
});

export const loginUser = yup.object({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
});

export const noteValidation = yup.object({
    title: yup.string().trim().min(3, 'Title must be at least 3 characters'),
    content: yup.string()
})