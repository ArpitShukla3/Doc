import { create } from "zustand";
export interface SocketStoreState {
  setSocketId: (id: string) => void;
  socketId: string | null;
}
const useSocketStore = create<SocketStoreState>(set => ({
  socketId: null,
  setSocketId: (id: string) => set({ socketId: id }),
}));
export default useSocketStore;