import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Contact = () => {
  const { state } = useLocation();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">{state.name}</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>

          <div className="mb-4">
            <h4 className="font-medium">Phone Numbers:</h4>
            {state.contact_numbers.map(
              (number, index) =>
                number && (
                  <p key={index} className="ml-4">
                    <a href={`tel:${number}`}>{number}</a>
                  </p>
                )
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-medium">Email:</h4>
            <p className="ml-4">
              <a href={`mailto:${state.email}`}>{state.email}</a>
            </p>
          </div>

          <div>
            <h4 className="font-medium">Address:</h4>
            <p className="ml-4">{state.address}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
