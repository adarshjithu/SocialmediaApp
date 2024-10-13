import * as yup from "yup";
const nameRegex = /^[A-Za-zÀ-ÖØ-ÿ' -]+[A-Za-zÀ-ÖØ-ÿ]*$/;
const phoneNumberRegex = /^(\+?[1-9]\d{1,14})$/;
const hasIdenticalDigits = (value: string): boolean => {
    return value.split("").every((digit) => digit === value[0]);
};
export const profileSchema = yup.object().shape({
    name: yup
        .string()
        .min(2, "Must be at least 2 characters")
        .max(50, "Must be at most 15 characters")
        .matches(nameRegex, "Invalid name format")
        .required("Required")
        .trim(),
    username: yup
        .string()
        .min(2, "Must be at least 2 characters")
        .max(50, "Must be at most 15 characters")
        .matches(nameRegex, "Invalid name format")
   
        .trim(),
    email: yup.string().required("Required").email("Invalid email format"),
    phonenumber: yup
        .string()
        
        .max(10, "Enter a valid phonenumber")
        .min(10, "Enter a valid phonenumber")
        .test("no-identical-digits", "Invalid Phonenumber", (value) => {
            if (!value) return false;
            return !hasIdenticalDigits(value);
        })
        .matches(phoneNumberRegex, "Invalid Phonenumber"),
});
