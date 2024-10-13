import * as yup from "yup";
const nameRegex = /^[A-Za-zÀ-ÖØ-ÿ' -]+[A-Za-zÀ-ÖØ-ÿ]*$/;
const phoneNumberRegex = /^(\+?[1-9]\d{1,14})$/;
const hasIdenticalDigits = (value: string): boolean => {
     return value.split("").every((digit) => digit === value[0]);
};
export const userSchema = yup.object().shape({
     name: yup
          .string()
          .min(2, "Must be at least 2 characters")
          .max(50, "Must be at most 50 characters")
          .matches(nameRegex, "Invalid name format")
          .required("Required")
          .trim(),
     email: yup.string().required("Required").email("Invalid email format"),
     phonenumber: yup
          .string()
          .required("Required") // Ensure the field is not empty
          .max(10,"Enter a valid phonenumber")
          .min(10,'Enter a valid phonenumber')
          .test("no-identical-digits", "Invalid Phonenumber", (value) => {
               if (!value) return false;
               return !hasIdenticalDigits(value);
          })
          .matches(phoneNumberRegex, "Invalid Phonenumber"),
     password: yup.string().min(6, "Password must be atlest 6 characters").max(12, "Password maximum length exceeded").required("Required") .matches(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
          "Password must contain at least one uppercase letter, one number, and one special character"
        ),
     confirmpassword: yup
          .string()
          .min(6, "Password must be atlest 6 characters")
          .max(12, "Password maximum length exceeded")
          .required("Required")
          .oneOf([yup.ref("password")], "Password must match"),
});

export const resetPasswordSchema = yup.object().shape({
     oldpassword: yup.string().min(6, "Password must be atlest 6 characters").max(12, "Password maximum length exceeded").required("Required"),
     newpassword: yup.string().min(6, "Password must be atlest 6 characters").max(12, "Password maximum length exceeded").required("Required"),
     confirmpassword: yup
          .string()
          .min(6, "Password must be atlest 6 characters")
          .max(12, "Password maximum length exceeded")
          .required("Required")
          .oneOf([yup.ref("newpassword")], "Password must match"),
});
export const forgetPasswordSchema = yup.object().shape({
    
     password: yup.string().min(6, "Password must be atlest 6 characters").max(12, "Password maximum length exceeded").required("Required"),
     confirmpassword: yup
          .string()
          .min(6, "Password must be atlest 6 characters")
          .max(12, "Password maximum length exceeded")
          .required("Required")
          .oneOf([yup.ref("password")], "Password must match"),
});
