import { create } from "zustand";
import type { TextBlockType } from "@myTypes/globalTypes";

type MockState = {
  mock: TextBlockType[];

  setMock: (mock: TextBlockType[]) => void;

  updateBlock: (id: string, data: Partial<TextBlockType>) => void;

  addBlock: () => void;

  deleteBlock: (id: string) => void;
};

function createEmptyBlock(): TextBlockType {
  return {
    id: crypto.randomUUID(),
    isCode: false,
    text: "",
  };
}

const useMock = create<MockState>((set, get) => ({
  mock: [createEmptyBlock()],

  setMock: (mock) => set({ mock }),

  updateBlock: (id, data) =>
    set({
      mock: get().mock.map((b) =>
        b.id === id ? { ...b, ...data } : b
      ),
    }),

  addBlock: () =>
    set({
      mock: [...get().mock, createEmptyBlock()],
    }),

  deleteBlock: (id) =>
    set({
      mock: get().mock.filter((b) => b.id !== id),
    }),
}));

export default useMock;
