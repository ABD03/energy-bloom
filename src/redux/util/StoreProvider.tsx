"use client";
import React from "react";
import { makeStore, initializeStore } from "../store/index";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import useIsClient from "@/util/useClient";

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef(initializeStore());

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      const unsubscribe = setupListeners(storeRef.current.Store.dispatch);
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const isClient = useIsClient();
  return (
    <Provider store={storeRef.current.Store}>
      {isClient ? (
        <PersistGate loading={null} persistor={storeRef.current.persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
};
