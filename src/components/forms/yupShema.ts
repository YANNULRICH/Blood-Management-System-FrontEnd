import * as yup from 'yup';
import {globalT} from '../../lang';

export const regex = {
    number: /^\d+$/,
    cameroonPhoneNumber: /^(\(?(\+237|237)\)?\s?)?(6|2)(2|3|[5-9])[0-9]{7}$/,
    url: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    urlWithHttp: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    password: /^(?=.*[A-Z])(?=.*[\W_]).{5,}$|^$/,
}

export const email = yup.string().email(globalT('form.errors.email'));
export const address = yup.string().required(globalT('form.errors.required'));
export const name = yup.string().required(globalT('form.errors.required'));
export const username = yup.string().required(globalT('form.errors.required'));
export const code = yup.string().required(globalT('form.errors.required'));
export const password = yup.string().required(globalT('form.errors.required')).matches(regex.password, globalT('form.errors.password.valid'));
export const passwordNotRequired = yup.string().matches(regex.password, globalT('form.errors.password.valid'));
export const amount = yup
    .string()
    .test('numberCheck', globalT('form.errors.price'), (val: string | undefined) => val ? Number(val) > 0 : true);
export const birthDate = yup
    .date()
    .min(new Date(1900 , 11, 31), globalT('form.errors.birthDate.min'))
    .max(new Date(), globalT('form.errors.birthDate.max'))
    .required(globalT('form.errors.birthDate'));

export const amountRequired = amount.concat(amount).required(globalT('form.errors.required'));

export const phone = yup
    .string()
    .required(globalT('form.errors.required'))
    .matches(regex.cameroonPhoneNumber, globalT('form.errors.phone.cmr'))
    // .test('len', globalT('form.errors.phone.cmr'), (val: string | undefined) => val ? val.length === 9 : false);

export const url = yup.string()
    .matches(regex.url, globalT('form.errors.url'))
    .required(globalT('form.errors.required'));

export const urlWithHttp = yup.string()
    .matches(regex.urlWithHttp, globalT('form.errors.url'))
    .required(globalT('form.errors.required'));

export const type = yup.string().required(globalT('form.errors.required'));
export const description = yup.string().required(globalT('form.errors.required'));
export const numberDefault = yup.number().required(globalT('form.errors.required'));
export const integerDefault = yup
    .number()
    .required(globalT('form.errors.required'))
    .positive(globalT('form.errors.number.incorrect'));
export const stringDefault = yup.string().required(globalT('form.errors.required'));
export const objectDefault = yup.object().required(globalT('form.errors.required'));
export const arrayDefault = yup.array().required(globalT('form.errors.required'));
export const startDate = yup
    .date().required(globalT('form.errors.required'))
export const endDate = yup
    .date()
    .required(globalT('form.errors.required'))
    .when('startDate', (startDate, schema) => {
        return startDate && schema.min(startDate, globalT('form.control.date'));
    })
