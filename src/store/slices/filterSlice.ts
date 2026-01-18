import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface FilterState {
  selectedSizes: string[];
  selectedColors: string[];
  priceFilter: [number, number] | null;
  priceRange: [number, number] | null;
}

const initialState: FilterState = {
  selectedSizes: [],
  selectedColors: [],
  priceFilter: null,
  priceRange: null,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSelectedSizes: (state, action: PayloadAction<string[]>) => {
      state.selectedSizes = action.payload;
    },
    addSize: (state, action: PayloadAction<string>) => {
      if (!state.selectedSizes.includes(action.payload)) {
        state.selectedSizes.push(action.payload);
      }
    },
    removeSize: (state, action: PayloadAction<string>) => {
      state.selectedSizes = state.selectedSizes.filter(
        (size) => size !== action.payload,
      );
    },
    toggleSize: (state, action: PayloadAction<string>) => {
      const index = state.selectedSizes.indexOf(action.payload);
      if (index > -1) {
        state.selectedSizes.splice(index, 1);
      } else {
        state.selectedSizes.push(action.payload);
      }
    },
    setSelectedColors: (state, action: PayloadAction<string[]>) => {
      state.selectedColors = action.payload;
    },
    addColor: (state, action: PayloadAction<string>) => {
      if (!state.selectedColors.includes(action.payload)) {
        state.selectedColors.push(action.payload);
      }
    },
    removeColor: (state, action: PayloadAction<string>) => {
      state.selectedColors = state.selectedColors.filter(
        (color) => color !== action.payload,
      );
    },
    toggleColor: (state, action: PayloadAction<string>) => {
      const index = state.selectedColors.indexOf(action.payload);
      if (index > -1) {
        state.selectedColors.splice(index, 1);
      } else {
        state.selectedColors.push(action.payload);
      }
    },
    setPriceFilter: (state, action: PayloadAction<[number, number]>) => {
      state.priceFilter = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      // Initialize priceFilter if not set
      if (!state.priceFilter) {
        state.priceFilter = action.payload;
      }
    },
    resetFilters: (state) => {
      state.selectedSizes = [];
      state.selectedColors = [];
      state.priceFilter = state.priceRange;
    },
  },
});

export const {
  setSelectedSizes,
  addSize,
  removeSize,
  toggleSize,
  setSelectedColors,
  addColor,
  removeColor,
  toggleColor,
  setPriceFilter,
  setPriceRange,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

