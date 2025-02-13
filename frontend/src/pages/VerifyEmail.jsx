import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'


const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying...');
    const [flag,setFlag] = useState(false)
    const params = useParams();
    const token = params.token;

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`http://localhost:3000/verify/${token}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const jsonData = await res.json();
                   
                if (jsonData.success) {
                    setFlag(true)
                    setMessage(jsonData.message || "Email verified successfully! You can Login now.");
                } else {
                    setMessage(jsonData.message || "Verification failed. The link may have expired.");
                }
            } catch (error) {
                console.log(error);
                setMessage("Verification failed. The link may have expired.");
            }
        };
        verify();
    }, [token]);

    return (
        <div>
            <h2>Email Verification</h2>
            <pre>{message}</pre>
            {flag === true ? (<p>Click here to<Link to="/login" className="text-blue-600 underline "> Login</Link></p>):(<></>)}
        </div>
    );
};

export default VerifyEmail;

