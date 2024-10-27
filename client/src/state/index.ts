import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Creamos una interfaces para definir un tipo de objeto con esos estados
export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}


//Aqui creamos un objeto de tipo initialStateType, y lo inicializamos todos como false por defecto
const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
};



//Aqui usamos 2 funciones de reduxtoolkit, create slice, para administrar los estados
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {

    //Es funcion nos cambia el estado, del sidebar
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },

    //Esta funciono nos cambia el estado del darkmode
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;
export default globalSlice.reducer;