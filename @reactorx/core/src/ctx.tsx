import React, { createContext, useContext, useEffect } from "react";
import { IEpic, Store } from "./core";

const StoreContext = createContext({} as Store<any>);

export const StoreProvider = StoreContext.Provider;

export const useStore = () => {
  return useContext(StoreContext);
};

export const useEpic = (epic: IEpic, inputs: any[] = []) => {
  const store$ = useStore();

  useEffect(() => {
    const subscription = store$.epicOn(epic);

    return () => {
      subscription.unsubscribe();
    };
  }, inputs);
};

const EpicOn = ({ children, inputs }: { children: IEpic; inputs?: any[] }) => {
  useEpic(children, inputs);
  return null;
};

export const epicOn = (epic: IEpic, inputs?: any[]) => {
  return <EpicOn inputs={inputs}>{epic}</EpicOn>;
};
