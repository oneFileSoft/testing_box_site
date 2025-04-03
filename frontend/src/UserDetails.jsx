import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showToastSuccess, showToastError } from "./utils/toastUtils";
import "./App.css";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post("/getAllUsers", { username: "abc" });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleSeeActivities = async () => {
    const selectedUserIds = Object.keys(selectedUsers).filter(
      (userId) => selectedUsers[userId]
    );

    if (!fromDate || !toDate || selectedUserIds.length === 0) {
      showToastError("Please select users and set a date range.");
      return;
    }

    try {
      const response = await axios.post("/transactions", {
        beginDate: fromDate,
        endDate: toDate,
        userIds: selectedUserIds,
      });

      if (response.data.success) {
        setTransactions(response.data.data);
        showToastSuccess("Transactions fetched successfully.");
      } else {
        showToastError(response.data.message || "Fetch failed");
      }
    } catch (error) {
      showToastError("Error fetching transactions: " + (error.response?.data.message || error.message));
    }
  };

  const truncateLast32 = (str) => str.slice(0, 3);

  const groupedTransactions = transactions.reduce((acc, txn) => {
    if (!acc[txn.userName]) acc[txn.userName] = [];
    acc[txn.userName].push(txn);
    return acc;
  }, {});

  const userTotals = Object.keys(groupedTransactions).reduce((acc, user) => {
    acc[user] = groupedTransactions[user][0].total_for_the_period;
    return acc;
  }, {});

  const totalUsers = Object.keys(userTotals).length;
  const averageSpending = totalUsers > 0 ? (Object.values(userTotals).reduce((sum, val) => sum + val, 0) / totalUsers).toFixed(2) : 0;

  const additionalFunds = Object.keys(userTotals).reduce((acc, user) => {
    acc[user] = Math.max(0, averageSpending - userTotals[user]);
    return acc;
  }, {});

  return (
    <div className="user-container">
      <h2 className="text-xl mb-4">User List</h2>
      <div style={{ maxHeight: "400px", overflowY: "auto", width: "100%" }}>
        <div className="mb-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center mb-2">
              <input type="checkbox" checked={!!selectedUsers[user.id]} onChange={() => handleCheckboxChange(user.id)} className="mr-2" />
              <span>{truncateLast32(user.uName)}</span>
            </div>
          ))}
        </div>
      </div>

      <table style={{ width: "90%" }} className="table-style">
        <tbody>
          <tr>
            <td><label>From Date:</label></td>
            <td><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2" /></td>
            <td><label>To Date:</label></td>
            <td><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2" /></td>
            <td><button onClick={handleSeeActivities}>See activities</button></td>
          </tr>
        </tbody>
      </table>

      {transactions.length > 0 && (
        <div style={{ maxHeight: "400px", overflowY: "auto", width: "100%" }}>
          <table className="border-collapse w-full border border-gray-400 mt-4 table-style">
            <thead>
              <tr className="bg-gray-200">
                <th>User</th>
                <th>Trans Date</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedTransactions).map((userName, idx) => (
                <React.Fragment key={idx}>
                  {groupedTransactions[userName].map((record, index) => (
                    <tr key={index}>
                      <td>{truncateLast32(record.userName)}</td>
                      <td>{new Date(record.transDate).toLocaleDateString()}</td>
                      <td>${record.transAmount.toFixed(2)}</td>
                      <td>{record.transDescr}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-300 font-bold">
                    <td colSpan="2" style={{ textAlign: "right" }}>Total for {truncateLast32(userName)}</td>
                    <td style={{ textAlign: "right" }}>${userTotals[userName].toFixed(2)}</td>
                    <td></td>
                  </tr>
                </React.Fragment>
              ))}
              <tr className="font-bold bg-gray-200">
                <td colSpan="2" style={{ textAlign: "right" }}>Average spending per user:</td>
                <td style={{ textAlign: "right" }}>${averageSpending}</td>
                <td></td>
              </tr>
              {Object.keys(additionalFunds).map((userName, idx) => (
                additionalFunds[userName] > 0 && (
                  <tr key={idx} className="bg-gray-100">
                    <td colSpan="2" style={{ textAlign: "right" }}>{truncateLast32(userName)} adds to company balance:</td>
                    <td style={{ textAlign: "right" }}>${additionalFunds[userName].toFixed(2)}</td>
                    <td></td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserDetails;
