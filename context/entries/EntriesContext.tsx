import { createContext } from "react";
import { Entry } from "../../interfaces";

interface ContextProps {
  entries: Entry[];

  // Methods
  addNewEntry: (description: string) => void;
  updateEntry: (entry: Entry, showSnackBar?: boolean) => void;
  deleteEntry: (_id: string, showSnackbar?: boolean) => Promise<void>;
  refreshEntries: () => Promise<void>;
}

export const EntriesContext = createContext({} as ContextProps);
