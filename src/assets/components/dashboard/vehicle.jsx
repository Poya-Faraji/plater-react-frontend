import { useNavigate } from "react-router-dom";

const Vehicles = ({ vehicles }) => {
  const navigate = useNavigate();
  // Handle empty state
  if (!vehicles || vehicles.length === 0) {
    return navigate("/add-vehicle", { replace: true });
  }

  const ViewVehicleDetail = ({ id }) => {
    navigate(`/dashboard/vehicle/${id}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Your Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            onClick={() => ViewVehicleDetail(vehicle)}
            key={`${vehicle.first2digits}-${vehicle.letter}-${vehicle.last3digits}-${vehicle.citycode}`}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {vehicle.year || "N/A"}
              </span>
              <h3 className="font-semibold text-lg">
                {vehicle.model || "Unknown Model"}
              </h3>
            </div>

            <div className="mt-2">
              <p className="text-gray-600">License Plate:</p>
              <p
                dir="rtl"
                className="text-xl text-center font-mono bg-gray-100 p-2 rounded"
              >
                {vehicle.first2digits} | {vehicle.last3digits} |{" "}
                {vehicle.letter} | {vehicle.citycode}
              </p>
            </div>

            <div className="mt-2 flex justify-between items-start">
              <span>Color: </span>
              <span className="font-semibold text-lg">
                {vehicle.color || "Color not specified"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
