// import type { BearType } from '@myTypes/globalTypes'
// import { create } from 'zustand'
// // const useBear = create((set) => ({
// //   bears: 0,
// //   increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
// //   removeAllBears: () => set({ bears: 0 }),
// //   updateBears: (newBears: BearType) => set({ bears: newBears }),
// // }))

import type { TextBlockType } from "@myTypes/globalTypes";
import { create } from "zustand";
type MockState = {
    mock: TextBlockType[];
    setMock: (mock: TextBlockType[]) => void;
}
const useMock = create<MockState>((set) => ({
    mock: [],
    setMock: (mock: TextBlockType[]) => set({ mock }),
}));

export default useMock;
