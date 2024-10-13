import bcrypt from 'bcrypt'

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
     const saltRounds = 10; // Number of salt rounds
     try {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          console.log("hashed password", hashedPassword);
          return hashedPassword;
     } catch (error) {
          console.error("Error hashing password:", error);
          throw new Error("Error hashing password");
     }
};

export const comparePassword = async (normalPassword: string, encryptedPassword: string) => {
     try {
          console.log(normalPassword, encryptedPassword);
          return await bcrypt.compare(normalPassword, encryptedPassword);
     } catch (error) {
          console.log(error);
     }
};
