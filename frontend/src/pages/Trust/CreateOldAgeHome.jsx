import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../context/TokenContext";
import Navbar from "../../components/Navbar";
import { Information } from "./components/FormSteps/Information";
import { useOldAgeHomeForm } from "./hooks/useOldAgeHomeForm";
import { LocationStep } from "./components/FormSteps/LocationStep";
import { BasicInfoStep } from "./components/FormSteps/BasicInfoStep";
import { TimingsStep } from "./components/FormSteps/TimingsStep";
import { ContactStep } from "./components/FormSteps/ContactStep";
import { FacilitiesStep } from "./components/FormSteps/FacilitiesStep";
import { FormNavigation } from "./components/FormNavigation";
import { initialFormState } from "./constants/formInitialState";
import { validateStep } from "./utils/formValidation";

const CreateOldAgeHome = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const [step, setStep] = useState(1);
  const {
    formData,
    setFormData,
    error,
    setError,
    handleInputChange,
    handleSocialLinksChange,
    addSocialLinkField,
    removeSocialLinkField,
    handlePhoneNumberChange,
    addPhoneNumberField,
    removePhoneNumberField,
    handleKeyPress,
    locationCodes,
    handleLocationChange,
    handleWorkingDaysChange,
    handleFacilityChange,
    addFacilityField,
    removeFacilityField,
    handleServiceChange,
    addServiceField,
    removeServiceField,
  } = useOldAgeHomeForm(initialFormState);
  const handleNextStep = () => {
    if (validateStep(step, formData)) {
      setStep(step + 1);
    } else {
      setError("Please fill in all required fields before proceeding");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 6) {
      return;
    }
    for (let i = 1; i <= 6; i++) {
      if (!validateStep(i, formData)) {
        setError(`Please complete all required fields in step ${i}`);
        setStep(i);
        return;
      }
    }
    try {
      const response = await fetch(
        "http://localhost:7001/api/old-age-homes/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/near-me");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const renderStep = () => {
    const steps = {
      1: (
        <BasicInfoStep
          formData={formData}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
        />
      ),

      2: (
        <LocationStep
          formData={formData}
          handleLocationChange={handleLocationChange}
          locationCodes={locationCodes}
        />
      ),

      3: (
        <TimingsStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleWorkingDaysChange={handleWorkingDaysChange}
        />
      ),

      4: (
        <ContactStep
          formData={formData}
          handlePhoneNumberChange={handlePhoneNumberChange}
          removePhoneNumberField={removePhoneNumberField}
          addPhoneNumberField={addPhoneNumberField}
          handleInputChange={handleInputChange}
          handleSocialLinksChange={handleSocialLinksChange}
          addSocialLinkField={addSocialLinkField}
          removeSocialLinkField={removeSocialLinkField}
        />
      ),

      5: <Information formData={formData} setFormData={setFormData} />,

      6: (
        <FacilitiesStep
          formData={formData}
          handleFacilityChange={handleFacilityChange}
          addFacilityField={addFacilityField}
          removeFacilityField={removeFacilityField}
          handleServiceChange={handleServiceChange}
          addServiceField={addServiceField}
          removeServiceField={removeServiceField}
        />
      ),
    };
    return steps[step];
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:max-w-md lg:max-w-lg transition-all">
          <h1 className="text-2xl font-semibold text-center text-[#002D74] tracking-wide mb-6">
            Create Old Age Home - Step {step}
          </h1>

          <form
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            className="space-y-6"
          >
            {renderStep()}

            {/* Step Navigation */}
            <FormNavigation
              step={step}
              totalSteps={6}
              onPrevious={() => setStep(step - 1)}
              onNext={handleNextStep}
              onSubmit={handleSubmit}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOldAgeHome;
