import React, { useEffect } from "react";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listner = (e) => {
      let el = ref?.current;
      if (!el || el.contains(e.target)) {
        return;
      }

      handler(e);
    };

    document.addEventListener("mousedown", listner);
    document.addEventListener("touchstart", listner);

    return () => {
      document.removeEventListener("mousedown", listner);
      document.removeEventListener("touchstart", listner);
    };
  }, [ref, handler]);
};

export default useClickOutside;
