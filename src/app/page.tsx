// app/page.tsx
import { API } from "@/apiEnv";
import { cookies } from "next/headers";
import AdminLayout from "@/components/layout/AdminLayout";
import Home from "@/components/Home";
import NewField from "@/components/NewField";
import ProfileModal from "@/components/Profile";
import VideoModal from "@/components/Video";
import FarmAdvisoryModal from "@/components/FarmAdvisory";
import SearchModal from "@/components/Search";
import FarmListModal from "@/components/FarmList";
import FarmIndexResults from "@/components/FarmIndexResults";
import Report from "@/components/Report";
import Weather from "@/components/Weather";
import AuthWrapper from "@/components/Auth/AuthWrapper";

export default async function AdminDashboard() {
  const cookieStore = await cookies(); 
  const authToken = cookieStore.get("token")?.value;
  let isAuthenticated = false;
  let userInfo = {};
  // Verify authentication status
  try {
    const res = await fetch(`${API}/auth/authenticated`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      isAuthenticated=true;
      const data = await res.json();
      userInfo=data;
    } else {
      console.log("Not authenticated");
    }
  } catch (err) {
    console.error("Auth check error:", err);
  }


  if (!isAuthenticated) {
    return (
      <div className="items-center justify-center bg-gray-100">
        <AuthWrapper />
      </div>
    );
  }

  return (
    <AdminLayout userInfo={userInfo}>
      <Home />
      <NewField />
      <FarmIndexResults />
      <ProfileModal userInfo={userInfo}/>
      <VideoModal />
      <SearchModal />
      <FarmAdvisoryModal />
      <FarmListModal />
      <Report />
      <Weather />
    </AdminLayout>
  );
}
