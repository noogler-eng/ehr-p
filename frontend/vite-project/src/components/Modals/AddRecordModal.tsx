/**
 * AddRecordModal Component
 *
 * Modal for doctors to create new medical records with:
 * - Patient identification
 * - Vital signs (BP, HR, Cholesterol, Sugar)
 * - Clinical markers (Chest pain type, ECG, Max HR)
 * - Symptoms
 * - Prescriptions (multiple)
 * - Doctor recommendations
 * - Medical images (up to 5 files)
 *
 * Submits data as multipart/form-data with image uploads
 * Triggers AI analysis (XGBoost + Gemini) on backend
 */

import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { X, Activity, Upload, Image as ImageIcon, Plus, Trash2, Pill } from 'lucide-react';
import { checkInteractions, DrugInteractionDisplay } from '../DrugInteractionChecker';
import { showToast } from '../Toast';
import { AddressSelector } from '../AddressSelector';
import { MedicineSelector } from '../MedicineSelector';

const AddRecordModal = ({ onClose, onSuccess, account }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");

  // ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  const [prescriptions, setPrescriptions] = useState([{
    medicineName: '',
    dosage: '',
    duration: '',
    frequency: '',
    timing: '',
    instructions: ''
  }]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Drug interaction check (runs whenever prescriptions change)
  const drugInteractions = useMemo(() => {
    const meds = prescriptions.map(p => p.medicineName).filter(m => m.trim());
    return checkInteractions(meds);
  }, [prescriptions]);

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
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
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
      const files = Array.from(e.target.files).slice(0, 5); // Max 5 images
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
   * Handles form submission with image upload
   * Sends data as multipart/form-data
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();

      // Basic information
      submitData.append('patientAddress', selectedPatient || formData.get('patientAddr') as string);
      submitData.append('doctorAddress', account);

      // Vitals (as JSON string)
      const vitals = {
        bp: formData.get('bp') as string,
        heartRate: Number(formData.get('hr')),
        cholesterol: Number(formData.get('chol')),
        sugarLevel: Number(formData.get('sugar')),
        ecgResult: formData.get('ecg') as string
      };
      submitData.append('vitals', JSON.stringify(vitals));

      // Clinical markers (as JSON string)
      const clinicalMarkers = {
        chestPainType: formData.get('cpType') as string,
        maxHeartRate: Number(formData.get('maxHr'))
      };
      submitData.append('clinicalMarkers', JSON.stringify(clinicalMarkers));

      // Symptoms (as JSON string array)
      const symptomsText = formData.get('symptoms') as string;
      const symptoms = symptomsText ? symptomsText.split(',').map(s => s.trim()).filter(s => s) : [];
      submitData.append('symptoms', JSON.stringify(symptoms));

      // Prescriptions (as JSON string array, filter out empty ones)
      const validPrescriptions = prescriptions.filter(p => p.medicineName.trim());
      submitData.append('prescriptions', JSON.stringify(validPrescriptions));

      // Doctor recommendations
      const recommendations = formData.get('recommendations') as string;
      if (recommendations) {
        submitData.append('doctorRecommendations', recommendations);
      }

      // Append all selected images
      selectedImages.forEach((file) => {
        submitData.append('images', file);
      });

      // Submit to backend
      await axios.post(`http://localhost:8080/api/records/submit-visit`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast({ type: "success", title: "Record Created", message: "AI analysis complete — anchored to blockchain" });
      showToast({ type: "blockchain", title: "Blockchain TX", message: "Transaction confirmed on Ethereum Mainnet", duration: 5000 });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Submission error:', err);
      showToast({ type: "error", title: "Submission Failed", message: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 rounded-[3rem] my-8 custom-scrollbar">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">CLINICAL DIAGNOSIS</h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
              Visit Record & AI Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Patient Identity */}
          <AddressSelector
            type="patient"
            currentUserAddress={account}
            currentUserRole="Doctor"
            value={selectedPatient}
            onChange={setSelectedPatient}
            name="patientAddr"
            required
            label="Select Patient"
          />

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">Blood Pressure</label>
              <input
                name="bp"
                placeholder="120/80"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">Heart Rate</label>
              <input
                name="hr"
                type="number"
                placeholder="BPM"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">Cholesterol</label>
              <input
                name="chol"
                type="number"
                placeholder="mg/dl"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">Sugar Level</label>
              <input
                name="sugar"
                type="number"
                placeholder="mg/dl"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Clinical Markers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">Chest Pain Type</label>
              <select
                name="cpType"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none appearance-none focus:border-zinc-500"
              >
                <option value="asymptomatic">Asymptomatic</option>
                <option value="typical">Typical Angina</option>
                <option value="atypical">Atypical Angina</option>
                <option value="non-anginal">Non-anginal Pain</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">ECG Results</label>
              <select
                name="ecg"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none appearance-none focus:border-zinc-500"
              >
                <option value="normal">Normal</option>
                <option value="abnormal">ST-T wave abnormality</option>
                <option value="hypertrophy">LV Hypertrophy</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">Max Heart Rate</label>
              <input
                name="maxHr"
                type="number"
                placeholder="BPM"
                required
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">
              Symptoms / Clinical Notes
            </label>
            <textarea
              name="symptoms"
              placeholder="Enter symptoms separated by commas (e.g., chest pain, shortness of breath, fatigue)"
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white h-24 outline-none resize-none focus:border-zinc-500"
            />
          </div>

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
                          // Auto-fill dosage if a medicine was selected from the list
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
                        placeholder="e.g., 7 days, 2 weeks"
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
                      placeholder="e.g., Take with plenty of water, Avoid alcohol, May cause drowsiness"
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
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3">
              Doctor Recommendations
            </label>
            <textarea
              name="recommendations"
              placeholder="Enter your clinical recommendations, follow-up instructions, lifestyle advice, etc."
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white h-32 outline-none resize-none focus:border-zinc-500"
            />
          </div>

          {/* Medical Images Upload */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 flex items-center gap-2">
              <ImageIcon size={14} /> Medical Images (Lab Reports, X-Rays, etc.)
            </label>

            <div className="bg-black/40 border-2 border-dashed border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf,application/dicom"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
                max={5}
              />
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={32} className="text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400 font-bold">Click to upload medical images</p>
                <p className="text-[10px] text-zinc-600 mt-1">
                  JPEG, PNG, PDF, DICOM • Max 5 files • 10MB per file
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative bg-black/40 border border-zinc-800 rounded-xl p-3 group">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={20} className="text-zinc-600" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-white truncate font-medium">{file.name}</p>
                        <p className="text-[9px] text-zinc-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drug Interaction Warning */}
          {prescriptions.some(p => p.medicineName.trim()) && (
            <div className="bg-black/30 border border-zinc-800 rounded-2xl p-4">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                Drug Interaction Analysis
              </p>
              <DrugInteractionDisplay interactions={drugInteractions} />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Activity size={24} className="animate-spin" />
                PROCESSING AI PREDICTION...
              </span>
            ) : (
              <>
                <Activity size={24} />
                GENERATE REPORT & ANCHOR TO BLOCKCHAIN
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
