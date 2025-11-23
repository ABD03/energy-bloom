import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "../util/storage";
import Slices from "../slice";
import { encryptTransform } from "redux-persist-transform-encrypt";

const persistConfig: any = {
  key: "metbeatnews.com",
  storage,
  whitelist: ["Auth", "Visits"],
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_ENCRYPT_KEY || "secretKey",
      onError: function (error) {},
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, Slices);

const middleWareConfigs = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

export const makeStore = () => {
  const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware): any => [
      ...getDefaultMiddleware(middleWareConfigs),
    ],
  });
  const persistor = persistStore(Store);
  return { Store, persistor };
};

let storeInstance: ReturnType<typeof makeStore> | null = null;
const initializeStore = () => {
  if (!storeInstance) {
    storeInstance = makeStore();
  }
  return storeInstance;
};

const { Store, persistor } = initializeStore();
export { Store, persistor, initializeStore };
export type RootState = ReturnType<typeof Slices>;
export type AppStore = ReturnType<typeof makeStore>["Store"];
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
