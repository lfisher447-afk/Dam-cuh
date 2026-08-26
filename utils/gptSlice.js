import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    title: "EN",
    lang: "en",
    moviesName: null,
    gptMovies: null,
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    changeTitle: (state, action) => {
      state.title = action.payload;
    },
    changeLang: (state, action) => {
      state.lang = action.payload;
    },
    addGptMovies: (state, action) => {
      const { moviesData, moviesName } = action.payload;
      state.gptMovies = moviesData;
      state.moviesName = moviesName;
    },
  },
});

export const { toggleGptSearchView, changeTitle, changeLang, addGptMovies } =
  gptSlice.actions;
export default gptSlice.reducer;
