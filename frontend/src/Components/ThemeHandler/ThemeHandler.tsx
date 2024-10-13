import React, { useState } from "react";
import { colorObj } from "./Themes";
import { colorContext } from "../../Context/colorContext";

function ThemeHandler({ children }:any) {
     const [theme, setTheme] = useState(colorObj);
     return (
          <div>
               <colorContext.Provider value={theme}>{children}</colorContext.Provider>
          </div>
     );
}

export default ThemeHandler;
