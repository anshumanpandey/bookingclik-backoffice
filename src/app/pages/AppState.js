import { createGlobalState } from 'react-hooks-global-state';

const initialState = { success: false, error: false };
export const { useGlobalState: useAppState, setGlobalState: setGlobalAppState } = createGlobalState(initialState);