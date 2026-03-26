/**
 * EditRecordModal Component - For Doctors
 *
 * Allows doctors to update existing medical records:
 * - Add more prescriptions with detailed instructions
 * - Update doctor recommendations
 * - Upload additional medical images
 * - Add follow-up notes
 *
 * Does NOT change vitals/AI predictions (immutable clinical data)
 */

import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, Image as ImageIcon, Plus, Trash2, Pill, Save, FileText } from 'lucide-react';
import { MedicineSelector } from '../MedicineSelector';

interface EditRecordModalProps {
  record: any;
  onClose: () => void;
  onSuccess: () => void;
  doctorAddress: string;
}

const EditRecordModal = ({ record, onClose, onSuccess, doctorAddress }: EditRecordModalProps) => {
  const [loading, setLoading] = useState(false);

  // ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Initialize with existing prescriptions or empty array
  const [prescriptions, setPrescriptions] = useState(
    record.prescriptions && record.prescriptions.length > 0
      ? record.prescriptions
      : [{ medicineName: '', dosage: '', duration: '', frequency: '', timing: '', instructions: '' }]
  );

  const [recommendations, setRecommendations] = useState(record.doctorRecommendations || '');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  /**
   * Adds a new empty prescription row
   */
  const addPrescription = () => {
    setPrescriptions([...prescriptions, {
      medicineName: '',
      dosage: '',
      duration: '',
      frequency: '',
      timing: '',
      instructions: ''
    }]);
  };

  /**
   * Removes a prescription row by index
   */
  const removePrescription = (index: number) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter((_, i) => i !== index));
    }
  };

  /**
   * Updates a specific prescription field
   */
  const updatePrescription = (index: number, field: string, value: string) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  /**
   * Handles image file selection (max 5 files)
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setSelectedImages(files);
    }
  };

  /**
   * Removes a selected image by index
   */
  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  /**
   * Handles form submission to update the record
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Record ID
      submitData.append('recordId', record._id);
      submitData.append('doctorAddress', doctorAddress);

      // Updated prescriptions (filter out empty ones)
      const validPrescriptions = prescriptions.filter(p => p.medicineName.trim());
      submitData.append('prescriptions', JSON.stringify(validPrescriptions));

      // Updated recommendations
      if (recommendations) {
        submitData.append('doctorRecommendations', recommendations);
      }

      // Append new images
      selectedImages.forEach((file) => {
        submitData.append('images', file);
      });

      // Submit update
      await axios.put(
        `http://localhost:8080/api/records/update/${record._id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Medical record updated successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Update error:', err);
      alert(`Failed to update record: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-10 rounded-[3rem] my-8 custom-scrollbar">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">
              UPDATE MEDICAL RECORD
            </h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
              Add Prescriptions, Recommendations & Images
            </p>
            <p className="text-zinc-600 text-[10px] font-mono mt-2">
              Record ID: {record._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Existing Data Summary */}
        <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 mb-8">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">
            Original Visit Date
          </p>
          <p className="text-sm text-white font-medium mb-4">
            {new Date(record.visitDate).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-[9px] text-zinc-600 uppercase">Blood Pressure</p>
              <p className="text-sm text-zinc-300 font-bold">{record.clinicalData?.vitals?.bp || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-600 uppercase">Heart Rate</p>
              <p className="text-sm text-zinc-300 font-bold">{record.clinicalData?.vitals?.heartRate || 'N/A'} bpm</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-600 uppercase">Cholesterol</p>
              <p className="text-sm text-zinc-300 font-bold">{record.clinicalData?.vitals?.cholesterol || 'N/A'} mg/dl</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-600 uppercase">Existing Images</p>
              <p className="text-sm text-zinc-300 font-bold">{record.images?.length || 0} files</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Enhanced Prescriptions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
                <Pill size={14} /> Prescriptions & Dosage Instructions
              </label>
              <button
                type="button"
                onClick={addPrescription}
                className="text-[10px] font-black text-zinc-400 hover:text-white uppercase flex items-center gap-1 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
              >
                <Plus size={12} /> Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="bg-black/40 border border-zinc-800 rounded-2xl p-5 space-y-4">

                  {/* Header with Remove Button */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                      Medicine #{index + 1}
                    </p>
                    {prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Medicine Name & Dosage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-600 uppercase ml-2">Medicine Name *</label>
                      <MedicineSelector
                        value={prescription.medicineName}
                        onChange={(name, dosage) => {
                          updatePrescription(index, 'medicineName', name);
                          if (dosage && !prescription.dosage) {
                            updatePrescription(index, 'dosage', dosage);
                          }
                        }}
                        placeholder="Search or type medicine..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-600 uppercase ml-2">Dosage *</label>
                      <input
                        placeholder="e.g., 500mg, 10ml, 2 tablets"
                        value={prescription.dosage}
                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Frequency, Timing & Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-600 uppercase ml-2">Frequency</label>
                      <select
                        value={prescription.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-500 appearance-none"
                      >
                        <option value="">Select frequency</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Four times daily">Four times daily</option>
                        <option value="Every 4 hours">Every 4 hours</option>
                        <option value="Every 6 hours">Every 6 hours</option>
                        <option value="Every 8 hours">Every 8 hours</option>
                        <option value="Every 12 hours">Every 12 hours</option>
                        <option value="As needed">As needed (PRN)</option>
                        <option value="Weekly">Weekly</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-600 uppercase ml-2">Timing</label>
                      <select
                        value={prescription.timing}
                        onChange={(e) => updatePrescription(index, 'timing', e.target.value)}
                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-500 appearance-none"
                      >
                        <option value="">Select timing</option>
                        <option value="Before meals">Before meals</option>
                        <option value="After meals">After meals</option>
                        <option value="With meals">With meals</option>
                        <option value="On empty stomach">On empty stomach</option>
                        <option value="Before bedtime">Before bedtime</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-600 uppercase ml-2">Duration</label>
                      <input
                        placeholder="e.g., 7 days, 2 weeks, 1 month"
                        value={prescription.duration}
                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-600 uppercase ml-2">Special Instructions</label>
                    <textarea
                      placeholder="e.g., Take with plenty of water, Avoid alcohol, Do not crush, May cause drowsiness"
                      value={prescription.instructions}
                      onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                      className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-500 resize-none h-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Recommendations */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
              <FileText size={12} /> Doctor's Recommendations & Follow-up Instructions
            </label>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Add clinical recommendations, follow-up schedule, lifestyle advice, dietary restrictions, exercise guidelines, when to return for checkup, warning signs to watch for, etc."
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white h-40 outline-none resize-none focus:border-zinc-500"
            />
          </div>

          {/* Additional Medical Images */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
              <ImageIcon size={12} /> Upload Additional Medical Images
            </label>

            <div className="bg-black/40 border-2 border-dashed border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="editImageUpload"
              />
              <label
                htmlFor="editImageUpload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={32} className="text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400 font-bold">Upload more images/reports</p>
                <p className="text-[10px] text-zinc-600 mt-1">
                  JPEG, PNG, PDF • Max 5 files • 10MB per file
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase ml-3">
                  {selectedImages.length} new file(s) selected
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="bg-black/40 border border-zinc-800 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon size={18} className="text-zinc-600" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs text-white truncate font-medium">{file.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <p className="text-[9px] text-zinc-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">UPDATING...</span>
              ) : (
                <>
                  <Save size={20} />
                  SAVE UPDATES
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecordModal;
