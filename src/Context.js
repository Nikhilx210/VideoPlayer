import React, { createContext,useContext,useState } from 'react'
const playContect=createContext();
const Context = ({children}) => {
    const [videoPaused, setVideoPaused] = useState(false);
  return (
    <playContect.Provider value={[videoPaused,setVideoPaused]}>
      {children}
    </playContect.Provider>
  )
}
export const UsePlay = ()=>{
    return useContext(playContect);
}
export default Context
