import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useInactivityRedirect(timeout = 10000, redirectPath = '/') {
  const navigate = useNavigate();
  let inactivityTimer;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      navigate(redirectPath);
    }, timeout);
  };

  const handleUserActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    resetTimer(); // Start timer on mount

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, []);
}

