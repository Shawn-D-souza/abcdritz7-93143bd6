import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only scroll to top on PUSH (new navigation) or REPLACE actions,
    // not on POP (back/forward) actions
    if (navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [pathname, navigationType]);

  return null;
}
