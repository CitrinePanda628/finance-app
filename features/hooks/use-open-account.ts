import{ create } from 'zustand';



type OpenState  = {
    id? : string
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose:() => void
}



export const useOpenAccount = create<OpenState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({isOpen: true, id}),
    onClose: () => set({isOpen: false, id: undefined})
}));

export const useOpenCategory = create<OpenState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({isOpen: true, id}),
    onClose: () => set({isOpen: false, id: undefined})
}));


export const useOpenTransaction = create<OpenState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({isOpen: true, id}),
    onClose: () => set({isOpen: false, id: undefined})
}));