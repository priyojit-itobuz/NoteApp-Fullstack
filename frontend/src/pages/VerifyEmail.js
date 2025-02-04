import { useEffect, useState } from "react";

const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying...');
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
  
    useEffect(() => {
      const verify = async () => {
        try {
          await axios.get(`http://localhost:3000/verify/${token}`);
          setMessage('Email verified successfully!');
        } catch {
          setMessage('Verification failed. The link may have expired.');
        }
      };
      verify();
    }, [token]);
  
    return (
      <div>
        <h2>Email Verification</h2>
        <p>{message}</p>
      </div>
    );
  };