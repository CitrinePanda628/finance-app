import{ create } from 'zustand';



type NewAState  = {
    isOpen: boolean;
    onOpen: () => void;
    onClose:() => void
}


export const useNewAccount = create<NewAState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}));


export const useNewCategory = create<NewAState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))


export const useNewTransaction = create<NewAState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))
