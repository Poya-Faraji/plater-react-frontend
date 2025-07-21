import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";

const Vehicles = ({ vehicles }) => {
  const navigate = useNavigate();

  const viewVehicleDetail = (id) => {
    navigate(`/dashboard/vehicle/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card
            key={`${vehicle.first2digits}-${vehicle.letter}-${vehicle.last3digits}-${vehicle.citycode}`}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => viewVehicleDetail(vehicle.id)}
          >
            <div className="flex justify-between items-start">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {vehicle.year || "نامشخص"}
              </span>
              <Typography variant="h6" className="font-semibold">
                {vehicle.model || "مدل نامشخص"}
              </Typography>
            </div>

            <div className="mt-4">
              <Typography variant="small" className="text-gray-600 text-right">
                پلاک وسیله نقلیه:
              </Typography>
              <Typography
                variant="h6"
                className="text-center font-mono bg-gray-100 p-2 rounded mt-1"
              >
                {vehicle.first2digits} | {vehicle.last3digits} |{" "}
                {vehicle.letter} | {vehicle.citycode}
              </Typography>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Typography variant="small">رنگ:</Typography>
              <Typography variant="small" className="font-medium">
                {vehicle.color || "نامشخص"}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;  