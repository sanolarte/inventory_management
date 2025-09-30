import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../../components/Button";
import { FiLogOut, FiTable } from "react-icons/fi";
import { LuPackageOpen } from "react-icons/lu";
import { PiPackageFill } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";



function ActionCard({ title, description, emoji, cta }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 grid place-items-center rounded-lg bg-cyan-50 text-cyan-700 text-xl">
          {emoji}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          <div className="mt-4">{cta}</div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden p-8 md:p-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 grid place-items-center rounded-full text-cyan-700 text-4xl">
              <PiPackageFill />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome{user?.username ? `, ${user.username}` : ""}
              </h1>
              <p className="text-gray-500">Inventory — choose an option</p>
            </div>

            <div className="ml-auto">
              <Button variant="logout" rightIcon={<FiLogOut />} onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <ActionCard
              title="Inventory Products"
              description="View and manage products in a data table."
              emoji={<LuPackageOpen />}
              cta={
                <Link to="/products">
                  <Button variant="primary" leftIcon={<FiTable />}>
                    Open dashboard
                  </Button>
                </Link>
              }
            />
            <ActionCard
              title="Sign out"
              description="Close your session safely."
              emoji={<BsDoorOpenFill />}
              cta={
                <Button variant="danger" leftIcon={<FiLogOut />} onClick={handleLogout}>
                  Sign out
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
