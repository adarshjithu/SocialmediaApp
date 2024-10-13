// import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
// import { auth } from './firebase';

// // TypeScript declarations for global variables
// declare global {
//   interface Window {
//     recaptchaVerifier?: RecaptchaVerifier;
//     confirmationResult?: ConfirmationResult;
//   }
// }

// // Setup reCAPTCHA verifier
// const setupRecaptcha = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     if (typeof window !== 'undefined') {
//       try {
//         // Initialize RecaptchaVerifier
//         window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
//           size: 'invisible',
//           callback: (response: any) => {
//             // reCAPTCHA solved, allow send OTP
//             resolve();
//           },
//           'expired-callback': () => {
//             // Handle reCAPTCHA expiration
//             reject('reCAPTCHA expired');
//           }
//         }, auth);

//         // Render the reCAPTCHA widget
//         window.recaptchaVerifier.render().catch(reject);
//       } catch (error) {
//         reject(error);
//       }
//     } else {
//       reject('Window is undefined');
//     }
//   });
// };

// // Send OTP
// const sendOtp = (phoneNumber: string): void => {
//   setupRecaptcha().then(() => {
//     if (!window.recaptchaVerifier) {
//       console.error('reCAPTCHA verifier not initialized.');
//       return;
//     }

//     const appVerifier = window.recaptchaVerifier;

//     signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then((confirmationResult: ConfirmationResult) => {
//         // SMS sent. Save the confirmationResult to verify the OTP later
//         window.confirmationResult = confirmationResult;
//         alert('OTP sent!');
//       })
//       .catch((error: Error) => {
//         console.error('Error during OTP send:', error);
//       });
//   }).catch((error: Error) => {
//     console.error('Error setting up reCAPTCHA:', error);
//   });
// };

// export { sendOtp };
