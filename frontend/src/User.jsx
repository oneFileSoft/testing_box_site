import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import { showToastSuccess, showToastError } from './utils/toastUtils';
import { hashPassword } from './utils/utils';
import { fromZonedTime, format } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import "./App.css";

export default function User() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [transDescr, setTransDescr] = useState('');
    const [transTotal, setTransTotal] = useState('');
    const [transDate, setTransDate] = useState('');
    const [records, setRecords] = useState([]);
    const [secureKey, setSecureKey] = useState('');

    const navigate = useNavigate();

    const fetchRecordsForUser = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`/getExpenses?userId=${userId}`);
            console.log("Response from backend:", response.data);
            if (response.data.success) {
                setRecords(response.data.expenses);
            } else {
                console.error("Failed to fetch records: ", response.data.message);
                showToastError("Failed to fetch records: " + response.data.message);
            }
        } catch (error) {
            console.error("Error fetching records:", error);
            showToastError("Error fetching records: " + error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            console.log("(useEffect) -> User ID:", userId);
            fetchRecordsForUser();
        }
    }, [userId]);

    const handleDelete = async (userId, id) => {
        if (!id) {
          showToastError("Cannot delete — expense ID is missing.");
          return;
        }
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            const response = await axios.delete('/deleteExpense', { data: { userId, expenseId: id } });

            if (response.data.success) {
                setRecords([]);
                showToastSuccess("Record deleted successfully.");
                fetchRecordsForUser();
            } else {
                showToastError("Failed to delete record." + response.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showToastError("Error deleting record: " + message);        }
    };

const handleLogin = async () => {
    if (!username || !password) { showToastError("Username and password are required!"); return; }

    try {
        const hashedUsername = username.slice(0, 3) + await hashPassword(username);
        const hashedPassword = await hashPassword(password);

        const response = await axios.post('/login', { username: hashedUsername, password: hashedPassword });

        if (response.data.success) {
            sessionStorage.setItem('user', `${username}__${response.data.userId}`);
            setUserId(response.data.userId);
            showToastSuccess(`Welcome, ${username}!`);
            if (username.startsWith("arbatrade")) { navigate("/specific_user", { state: { password } }); }
        } else {
            showToastError(response.data.message || "Login failed");
        }
    } catch (error) {
        showToastError("Error during login: " + (error.response?.data?.message || error.message));
    }
};
    const handleInsertUser = async () => {
        if (!username || !password || !secureKey) {
            showToastError('[Username], [Password] and [Admin password] are required fields!');
            return;
        }
        const un = username;
        const hashedUsername = username.slice(0, 3) + await hashPassword(username);
        const hashedPassword = await hashPassword(password);

        try {
            const response = await axios.post('/insert', { username: hashedUsername, password: hashedPassword, dbKey: await hashPassword(secureKey) });

            if (response.data.success) {
                showToastSuccess(`User: ${un} inserted successfully.`);
            } else {
                showToastError(response.data.message || 'Insert failed');
            }
        } catch (error) {
            if (error.response) {
                showToastError("Error inserting User: " + error.response.data.message);
            } else {
                showToastError("Error inserting User: " + error.message);
            }
        }
    };

    const checkOtherUsers = async () => {
        showToastSuccess('Select Users for review, as well From and To dates');
        navigate("/user_details");
    };

    const handleDateInput = (inputDate) => {
        const timeZone = 'America/Chicago';
        const zonedDate = fromZonedTime(parseISO(inputDate), timeZone);
        return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'UTC' });
    };
    const handleShortDateInput = (inputDate) => {
        const timeZone = 'America/Chicago';
        const zonedDate = fromZonedTime(parseISO(inputDate), timeZone);
        return format(zonedDate, "MM-dd-yyyy", { timeZone: 'UTC' });
    };

const getStoredUsername = (index) => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? storedUser.split('__')[index] : '';
};
    const handleInsertExpense = async () => {
            const storedUser = sessionStorage.getItem('user');
            const userId = storedUser ? storedUser.split('__')[1] : null;
            if (userId ==null) {
                await showToastError("You'll need to re-authenticate\nthis User for adding new Expenses");
                navigate('/');
            }
        if (!transDescr || transDescr.length > 2000) {
            showToastError('Description is required and must be under 2000 characters!');
            return;
        }
        if (!transTotal || isNaN(parseFloat(transTotal))) {
            showToastError('Total amount must be a valid number!');
            return;
        }
        try {
            const formatedDate = handleDateInput(transDate);
            const response = await axios.post('/insertExpense', { userId, transDescr, transTotal, transDate: formatedDate });
            if (response.data.success) {
                setRecords([]);
                showToastSuccess("Record inserted successfully.");
                await fetchRecordsForUser();
//                 setRecords([...records, {transDescr | transTotal | transDate}]);
                setTransDescr(''); setTransTotal(''); setTransDate('');
            } else { showToastError(response.data.message || 'Insert failed'); }
        } catch (error) { showToastError("Error inserting record: " + error);  }
    };

    return (
        <div className="session-container" style={{ overflowY: "auto" }}>
            {!userId ? (
                <>
                    <h2>Login or insert new User</h2>
                    <input type="text" id='uname' placeholder="Your User Name" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 w-40 mb-2 block" maxLength={25} />
                    <input type="password" id='passw' placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-40 block" />
                    <button onClick={handleLogin} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Authenticate</button>
                    &nbsp;
                    <input type="password" placeholder="Admin password"
                           value={secureKey} onChange={(e) => setSecureKey(e.target.value)} className="border p-2 w-40 ml-2" />
                    <button onClick={handleInsertUser} className="bg-blue-500 text-white py-2 px-4 rounded"> Insert New-User </button>
                    &nbsp;
                </>
            ) : (
                <>
                    <div>
                        <div className="flex items-center mt-4">
                            <h2>Add Expense for {getStoredUsername(0)} &nbsp;&nbsp;&nbsp;
                              <button onClick={() => checkOtherUsers()} className="bg-green-500 text-white py-2 px-4 rounded" > See other users: </button>
                            </h2>
                        </div>
                        <input type="text" placeholder="Description" value={transDescr} onChange={(e) => setTransDescr(e.target.value)} className="border p-2 w-60 mb-2 block" style={{ width: "90%" }}  />
                        <input type="number" placeholder="Total Amount" value={transTotal} onChange={(e) => setTransTotal(e.target.value)} className="border p-2 w-40 block" style={{ width: "90%" }}  />
                        <input type="date" value={transDate} onChange={(e) => setTransDate(e.target.value)} className="border p-2 w-40 block" style={{ width: "90%" }}  />
                        <button onClick={() => handleInsertExpense()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Insert Record</button>

                        <h3 className="mt-4">User Expenses</h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                            <table className="border-collapse w-full border border-gray-400 mt-4">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Transaction Description</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length > 0 && records.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                                            <td className="border p-2">{record.transDescr}</td>
                                            <td className="border p-2">{record.transTotal}</td>
                                            <td className="border p-2">{handleShortDateInput(record.transDate)}</td>
                                            <td className="border p-2">
                                                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => handleDelete(userId, record.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            <ToastContainer />
        </div>
    );
}



