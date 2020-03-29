import { useContext, Context } from "react";
import { useObserver } from "mobx-react";

export const useStoreState = <Selection, ContextData, Store>(
  context: Context<ContextData>,
  storeSelector: (contextData: ContextData) => Store,
  dataSelector: (store: Store) => Selection
) => {
  const value = useContext(context);
  if (!value) throw new Error("No store");
  const store = storeSelector(value);
  return useObserver(() => {
    return dataSelector(store);
  });
};
