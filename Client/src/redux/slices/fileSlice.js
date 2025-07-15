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

// Get all files uploaded by current user
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

// Get specific file data by file ID
export const getFileDataById = createAsyncThunk(
  "files/getFileDataById",
  async (fileId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch file data"
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
    userFiles: [],
    selectedFileData: null,
  },
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
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

      // Get User Files
      .addCase(getUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.userFiles = action.payload;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Selected File Data
      .addCase(getFileDataById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedFileData = null;
      })
      .addCase(getFileDataById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFileData = action.payload;
      })
      .addCase(getFileDataById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedFileData = null;
      });
  },
});

export const { clearSuccess, clearError } = fileSlice.actions;
export default fileSlice.reducer;
