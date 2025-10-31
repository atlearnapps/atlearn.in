import React, { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import * as Pages from "src/utils/LazyImportsRoutes/lazyImports";
import { AuthProtect } from "./utils/ProtectRoutes/AuthProtect/AuthProtect";
//Layout
import ProfileDashboardLayout from "./layouts/dashboard/ProfileDashboardLayout";
import OrganizationLayout from "./layouts/dashboard/OrganizationLayout";
import ModeratorLayout from "./layouts/moderator/ModeratorLayout";
import NewLayout from "./components/New components/NewLayout";
//------------------------------------------
import AdminPanel from "./pages/admin-organization/Admin/AdminPanel";
import Callback from "./pages/Callback/Callback";
import Page404 from "./pages/Page404";
import Loader from "./components/New components/Loader/Loader";
import Register from "./pages/New pages/Auth/Register";

// --------------------------------------------------------------------------------------

// import SignIn from "./pages/SignIn/SignIn";
// import SignUp from "./pages/SignUp/SignUp";
// import JoinRoom from "./pages/JoinRoom/JoinRoom";
// import JoinRoomLayout from "./layouts/joinRoom/JoinRoomLayout";
// import PublicRecordes from "./pages/publicRecordes/PublicRecordes";
// import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
// import ForgetPasswordUser from "./pages/ForgetPassword/ForgetPassword";
// import ResetPassword from "./pages/resetPassword/ResetPassword";
// import SuccessPage from "./pages/SuccessPage/SuccessPage";
// import CancelPage from "./pages/CancelPage/CancelPage";
// import Marketplace from "./pages/New pages/Marketplace/Marketplace";

export default function Router() {
  const routes = useRoutes([
    //new template layout

    {
      path: "/",
      element: <NewLayout />,
      children: [
        {
          path: "/",
          element: <Pages.Home />,
          // element: <Pages.Auth0Home />,

        },
        {
          path: "courses",
          element: <Pages.Courses />,
        },
        {
          path: "all-courses",
          element: <Pages.MoreCourses />,
        },
        { path: "course-details", element: <Pages.CourseDetails /> },

        {
          path: "meetings",
          element: <Pages.OnlineClasses />,
        },
        {
          path: "join-meetings",
          element: <Pages.AllRooms />,
        },
        {
          path: "Join-meeting",
          element: <Pages.JoinScheduleRoom />,
        },
        {
          path: "public-records",
          element: <Pages.PublicRecords />,
        },
        {
          path: "pricing",
          element: <Pages.NewPricing />,
        },
        {
          path: "checkout",
          element: <Pages.Checkout />,
        },
        {
          path: "assessments",
          element: <Pages.Assessments />,
        },
        {
          path: "online-test",
          element: <Pages.PracticalTest />,
        },
        {
          path: "online-test-details",
          element: <Pages.PracticalTestDetails />,
        },
        {
          path: "terms-and-conditions",
          element: <Pages.TermsConditions />,
        },
        {
          path: "privacy-policy",
          element: <Pages.Privacy />,
        },
        {
          path: "pricing-policy",
          element: <Pages.PricingPolicy />,
        },
        {
          path: "cancellation-refund-policy",
          element: <Pages.CancellationRefund />,
        },
        {
          path: "survey",
          element: <Pages.Survey />,
        },
        {
          path: "contact",
          element: <Pages.Contact />,
        },
        {
          path: "faq",
          element: <Pages.FAQ />,
        },
        {
          path: "tutors",
          element: <Pages.Instructors />,
        },
        {
          path: "tutor-details",
          element: <Pages.InstructorDetails />,
        },
        {
          path: "tutorial",
          element: <Pages.Workshops />,
        },
        {
          path: "feedback",
          element: <Pages.Feedback />,
        },
        {
          path: "testimonials",
          element: <Pages.Testimonial />,
        },
        {
          path: "question-bank",
          element: <Pages.QuestionBank />,
        },
        {
          path: "become-a-course-creator",
          element: <Pages.BecomeACourseCreator />,
        },
        {
          path: "ai-grading-tool",
          element: <Pages.AIGradingTool />,
        },
        {
          path: "ai",
          element: <Pages.AIAssistants />,
        },
        {
          path: "ai-chat/:id",
          element: <Pages.ChatwithAI />,
        },
             {
          path: "course-management",
          element: <Pages.CourseManagement />,
        },
      ],
    },

    { path: "404", element: <Page404 /> },

    {
      element: <ModeratorLayout />,
      children: [
        {
          path: "room",
          element: (
            <AuthProtect>
              <Pages.Moderator />
            </AuthProtect>
          ),
        },

        {
          path: "room/:id",
          element: (
            <AuthProtect>
              <Pages.SingleRoom />
            </AuthProtect>
          ),
        },
        {
          path: "recordings",
          element: (
            <AuthProtect>
              <Pages.RecordingPage />
            </AuthProtect>
          ),
        },
        {
          path: "only-join",
          element: (
            <AuthProtect>
              <Pages.OnlyJoin />
            </AuthProtect>
          ),
        },
      ],
    },

    {
      path: "/settings",
      element: (
        <AuthProtect>
          <ProfileDashboardLayout />
        </AuthProtect>
      ),
      children: [
        { element: <Navigate to="/settings/profile" />, index: true },
        { path: "profile", element: <Pages.AdminProfile /> },
        { path: "deleteAccount", element: <Pages.DeleteAccount /> },
        { path: "mymeeting", element: <Pages.MyMeeting /> },
        { path: "mysubscription", element: <Pages.MyScbscription /> },
        { path: "mytransaction", element: <Pages.MyTransaction /> },
        { path: "app-credentials", element: <Pages.AppCredentials /> },
      ],
    },
    {
      path: "/organization",
      element: (
        <AuthProtect>
          <OrganizationLayout />
        </AuthProtect>
      ),
      children: [
        { element: <Navigate to="/organization/admin" />, index: true },
        { path: "admin", element: <AdminPanel /> },
        { path: "dashboard", element: <Pages.DashboardAppPage /> },
        { path: "users", element: <Pages.MangeUsers /> },
        { path: "auth0-users",element:<Pages.Auth0Users />},
        { path: "server-rooms", element: <Pages.ServerRoom /> },
        { path: "server-recordings", element: <Pages.ServerRecordings /> },
        { path: "site-settings", element: <Pages.SiteSettings /> },
        { path: "room-configuration", element: <Pages.RoomConfiguration /> },
        { path: "roles", element: <Pages.Role /> },
        { path: "monitor", element: <Pages.Monitor /> },
        { path: "subscription-plans", element: <Pages.SubscriptionPlans /> },
        { path: "alltransactions", element: <Pages.AllTransaction /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
    { path: "/callback", element: <Callback /> },
    {
      path:"/register",element:<Register/>
    }
  ]);

  // return routes;

  return <Suspense fallback={<Loader />}>{routes}</Suspense>;
}
