import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'


const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying...');
    const params = useParams()
    const token = params.token

    useEffect(() => {
        const verify = async () => {
            try {
                console.log(token)
                const res = await fetch(`http://localhost:3000/verify/${token}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const jsonData = await res.json()
                console.log(jsonData)
                setMessage('Email verified successfully!\nYou can Login now');
            } catch (error) {
                console.log(error)
                setMessage('Verification failed. The link may have expired.');
            }
        };
        verify();
    }, [token]);

    return (
        <div>
            <h2>Email Verification</h2>
            <pre>Email verified successfully!\nYou can Login now</pre>
            Click here to<Link to="/login" className="text-blue-600 underline "> Login</Link>
        </div>
    );
};

export default VerifyEmail


