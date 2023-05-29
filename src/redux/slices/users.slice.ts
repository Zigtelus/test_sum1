import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  userId: number;
  name: string;
  login: string;
  password: string;
};

type UsersState = {
  data: UserType[];
  loading: boolean;
  authenticateUser: UserType | null;
};

const initialState: UsersState = {
  data: [],
  loading: false,
  authenticateUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    addNewUser: (state: UsersState, action: PayloadAction<{login: string; password: string; name: string;}>) => {
      const lastUser = state.data[state.data.length - 1];
      const userId = lastUser?.userId ?? 0;
    
      const newUser = { ...action.payload, userId: userId + 1 };
      state.data = [...state.data, newUser];
    },
    addUsers: (state: UsersState, action: PayloadAction<UserType[]>) => {
      state.data = action.payload
    },
    changeLoading: (state: UsersState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    authenticateUser: (state: UsersState, action: PayloadAction<{ login: string; password: string } | null>) => {
      const payload = action.payload;
  
      if (payload !== null) {
        const { login, password } = payload;
        const user = state.data.find((u) => u.login === login && u.password === password);

        state.authenticateUser = user ?? null;
      } else {
        state.authenticateUser = null;
      }
    },
  }
});

export type { UserType };

export const { addNewUser, addUsers, changeLoading, authenticateUser } = usersSlice.actions;
export default usersSlice.reducer;
