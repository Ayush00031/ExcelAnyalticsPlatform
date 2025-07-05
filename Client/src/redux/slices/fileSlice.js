import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Upload Excel file
export const uploadExcelFile = createAsyncThunk(
  "files/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

// Get uploaded files for logged-in user
export const getUserFiles = createAsyncThunk(
  "files/getUserFiles",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch files"
      );
    }
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState: {
    loading: false,
    error: null,
    success: false,
    files: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadExcelFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadExcelFile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadExcelFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user's uploaded files
      .addCase(getUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fileSlice.reducer;
