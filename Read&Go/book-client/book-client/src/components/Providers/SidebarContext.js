import { createContext } from "react";

const SidebarContext = createContext({
  showSidebar: false,
  toggleSidebar: () => {},
});

export default SidebarContext;