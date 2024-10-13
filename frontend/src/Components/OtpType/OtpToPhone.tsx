import { Button, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { colorContext } from '../../Context/colorContext'
import { ThemeInterface } from '../ThemeHandler/Themes'

function OtpToPhone({signupWithEmail,otpPhone,setOtpEmail,otpEmail,setOtpPhone,isEmail,setIsEmail}:any) {
    const theme:ThemeInterface = useContext(colorContext)
  return (
    <form action="" className="flex flex-col">
    <div className="p-8 ">
         <TextField
              name="phoenumber"
              value={otpPhone}
              onChange={(e) => setOtpPhone(e.target.value)}
              type="text"
              placeholder="Enter Mobile"
              size="small"
              className="w-[100%]"
              sx={{
                   "& .MuiInputBase-input::placeholder": {
                        color: "black", // Change this to your desired color
                        opacity: 0.8, // Adjust opacity if needed
                   },
              }}
         />

         <Button
              onClick={()=>signupWithEmail(false)}
              variant="contained"
              className="w-[100%]"
              sx={{
                   marginTop: "20px",
                   color: `${theme.normalButton.color}`,
                   backgroundColor: `${theme.normalButton.backgroundColor}`,
                   "&:hover": {
                        backgroundColor: "secondary.main",
                   },
              }}
         >
              next
         </Button>

         <Button
              style={{ textTransform: "none" }}
              onClick={() => setIsEmail(!isEmail)}
              variant="outlined"
              className="w-[100%]"
              sx={{ marginTop: "20px", color: "#4B164C", borderColor: "#4B164C" }}
         >
              SignUp With Email'
         </Button>
    </div>
</form>
  )
}

export default OtpToPhone
