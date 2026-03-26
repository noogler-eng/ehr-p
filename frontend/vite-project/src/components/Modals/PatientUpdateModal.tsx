/**
 * PatientUpdateModal Component - For Patients
 *
 * Allows patients to add updates to their EXISTING medical records:
 * - Upload new lab reports/images
 * - Add new symptoms they're experiencing
 * - Add notes about their condition
 * - Report how they're feeling
 *
 * Updates are visible to the doctor who created the record
 * Doctor can then re-run AI analysis with new data
 */

import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, Image as ImageIcon, Plus, Heart, FileText } from 'lucide-react';

interface PatientUpdateModalProps {
  record: any;
  patientAddress: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PatientUpdateModal = ({ record, patientAddress, onClose, onSuccess }: PatientUpdateModalProps) => {
  const [loading, setLoading] = useState(false);

  // ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [newSymptoms, setNewSymptoms] = useState('');
  const [patientNotes, setPatientNotes] = useState('');

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
   * Handles form submission - adds patient updates to existing record
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedImages.length === 0 && !newSymptoms.trim() && !patientNotes.trim()) {
      alert('Please add at least one update (images, symptoms, or notes)');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Record ID and patient address
      submitData.append('recordId', record._id);
      submitData.append('patientAddress', patientAddress);

      // New symptoms (append to existing)
      if (newSymptoms.trim()) {
        const symptomsArray = newSymptoms.split(',').map(s => s.trim()).filter(s => s);
        const existingSymptoms = record.clinicalData?.symptoms || [];
        const combinedSymptoms = [...existingSymptoms, ...symptomsArray];
        submitData.append('symptoms', JSON.stringify(combinedSymptoms));
      }

      // Patient notes
      if (patientNotes.trim()) {
        const existingNotes = record.patientNotes || '';
        const timestamp = new Date().toLocaleString();
        const updatedNotes = existingNotes
          ? `${existingNotes}\n\n[${timestamp}] ${patientNotes}`
          : `[${timestamp}] ${patientNotes}`;
        submitData.append('patientNotes', updatedNotes);
      }

      // Append images
      selectedImages.forEach((file) => {
        submitData.append('images', file);
      });

      // Submit to patient update endpoint
      await axios.put(
        `http://localhost:8080/api/records/patient-update/${record._id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Your updates have been added successfully! Your doctor can now see them.');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Update error:', err);
      alert(`Failed to add updates: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 md:p-10 rounded-[3rem] my-8 custom-scrollbar">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">
              ADD UPDATE TO VISIT
            </h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
              Share New Lab Results, Symptoms & How You're Feeling
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Original Visit Info */}
        <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 mb-6">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
            Original Visit
          </p>
          <p className="text-sm text-white font-medium mb-3">
            {new Date(record.visitDate).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {record.clinicalData?.symptoms?.slice(0, 3).map((s: string, i: number) => (
              <span key={i} className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">
                {s}
              </span>
            ))}
            {record.clinicalData?.symptoms?.length > 3 && (
              <span className="text-[9px] text-zinc-600">
                +{record.clinicalData.symptoms.length - 3} more
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* New Symptoms */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
              <Heart size={12} /> New Symptoms You're Experiencing
            </label>
            <textarea
              value={newSymptoms}
              onChange={(e) => setNewSymptoms(e.target.value)}
              placeholder="Describe any new symptoms (e.g., persistent cough, chest tightness, fatigue, dizziness). Separate multiple symptoms with commas."
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white h-24 outline-none resize-none focus:border-zinc-500"
            />
            <p className="text-[9px] text-zinc-600 ml-3">
              Your doctor will be notified about these new symptoms
            </p>
          </div>

          {/* Patient Notes / How I'm Feeling */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
              <FileText size={12} /> How I'm Feeling / Progress Notes
            </label>
            <textarea
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="Share how you're feeling, any changes you've noticed, medication side effects, questions for your doctor, etc."
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white h-32 outline-none resize-none focus:border-zinc-500"
            />
          </div>

          {/* Upload New Lab Results/Images */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
              <ImageIcon size={12} /> Upload New Lab Results / Medical Images
            </label>

            <div className="bg-black/40 border-2 border-dashed border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="patientUpdateImages"
              />
              <label
                htmlFor="patientUpdateImages"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={36} className="text-zinc-600 mb-3" />
                <p className="text-base text-zinc-300 font-bold mb-1">
                  Click to upload test results or images
                </p>
                <p className="text-[11px] text-zinc-600">
                  JPEG, PNG, PDF • Max 5 files • 10MB per file
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase ml-3">
                  {selectedImages.length} file(s) selected
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {selectedImages.map((file, index) => (
                    <div
                      key={index}
                      className="bg-black/40 border border-zinc-800 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-800 p-2 rounded-lg">
                          <ImageIcon size={20} className="text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium truncate max-w-[300px]">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-zinc-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              💡 <strong>Note:</strong> Your updates will be added to this existing visit record. Your doctor will be able to see your new symptoms, notes, and lab results. They can then re-analyze your condition with AI based on this new information.
            </p>
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
              disabled={loading || (selectedImages.length === 0 && !newSymptoms.trim() && !patientNotes.trim())}
              className="flex-1 bg-white text-black py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">ADDING UPDATES...</span>
              ) : (
                <>
                  <Plus size={20} />
                  ADD UPDATES TO RECORD
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientUpdateModal;
