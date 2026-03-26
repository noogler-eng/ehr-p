/**
 * OnboardingModal Component
 *
 * Modal for new users to complete their profile setup:
 * - Full legal name
 * - Age and gender
 * - Blood group
 * - System role (Patient, Doctor, Pharmacist, Admin)
 *
 * Submits user profile to backend and creates account in database
 */

import React from 'react';
import axios from 'axios';

const OnboardingModal = ({ account, onComplete }: any) => {
  /**
   * Handles form submission and user registration
   * Creates new user profile in database linked to wallet address
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
        walletAddress: account,
        name: formData.get('name'),
        role: formData.get('role'),
        age: Number(formData.get('age')),
        gender: formData.get('gender'),
        bloodGroup: formData.get('bloodGroup'),
        activeMedications: [] // Initialized as empty for new users
    };

    try {
      const { data } = await axios.post(`http://localhost:8080/api/auth/login`, payload);
      onComplete(data.user);
    } catch (err) {
      alert("Profile initialization failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto p-10 rounded-[2.5rem] my-auto custom-scrollbar">
        <h2 className="text-3xl font-black text-white mb-2 italic">MASTER PROFILE</h2>
        <p className="text-zinc-500 text-sm mb-8">Establish your clinical identity on the blockchain network[cite: 126].</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Basic Info */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Full Legal Name</label>
            <input name="name" required className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-zinc-500" placeholder="e.g., Sharad Poddar" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Age</label>
              <input name="age" type="number" required className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none" placeholder="Years" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Gender</label>
              <select name="gender" className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none appearance-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Section: Clinical Identity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Blood Group</label>
              <select name="bloodGroup" className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none appearance-none">
                <option value="A+">A+</option><option value="O+">O+</option>
                <option value="B+">B+</option><option value="AB+">AB+</option>
                <option value="A-">A-</option><option value="O-">O-</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">System Role</label>
              <select name="role" className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none appearance-none font-bold text-zinc-400">
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black mt-4 hover:bg-zinc-200 transition-all uppercase tracking-tighter">
            Initialize & Secure Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;