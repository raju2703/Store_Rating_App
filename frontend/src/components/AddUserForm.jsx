import React, { useState } from "react";

const AddUserForm = ({ addUser }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.address
    ) {
      alert("Please fill out all fields.");
      return;
    }

    addUser(newUser);
    setNewUser({
      name: "",
      email: "",
      password: "",
      address: "",
      role: "user",
    });
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={newUser.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
          className="border px-3 py-2 rounded col-span-2"
        >
          <option value="user">Normal User</option>
          <option value="admin">Admin User</option>
        </select>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
