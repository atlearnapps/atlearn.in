// lazyImports.js
import React from "react";

export const Home = React.lazy(() => import("src/pages/New pages/Home/Home"));
export const Auth0Home = React.lazy(() => import("src/pages/New pages/Home/Auth0Home"));
export const Courses= React.lazy(() => import("src/pages/New pages/LMS/Courses"));
export const MoreCourses = React.lazy(() => import("src/pages/New pages/LMS/MoreCourses"));
export const CourseDetails = React.lazy(() => import("src/pages/New pages/CourseDetails/CourseDetails"));
export const OnlineClasses = React.lazy(() => import("src/pages/New pages/Online_Classes/OnlineClasses"));
export const AllRooms = React.lazy(() => import("src/pages/New pages/Online_Classes/AllRooms"));
export const JoinScheduleRoom = React.lazy(() => import("src/pages/New pages/JoinRoom/JoinRoom"));
export const PublicRecords = React.lazy(() => import("src/pages/New pages/Online_Classes/PublicRecords"));
export const NewPricing = React.lazy(() => import("src/pages/New pages/Pricing/Pricing"));
export const Checkout = React.lazy(() => import("src/pages/checkout/Checkout"));
export const Testimonial = React.lazy(() => import("src/pages/New pages/Testimonial/Testimonial"));
export const TermsConditions = React.lazy(() => import("src/pages/New pages/Policy/TermsConditions"));
export const PricingPolicy = React.lazy(() => import("src/pages/New pages/Policy/PricingPolicy"));
export const Privacy = React.lazy(() => import("src/pages/New pages/Policy/Privacy"));
export const CancellationRefund = React.lazy(() => import("src/pages/New pages/Policy/CancellationRefund"));
export const Survey = React.lazy(() => import("src/pages/New pages/Survey/Survey"));
export const Contact = React.lazy(() => import("src/pages/New pages/Contact/Contact"));
export const FAQ = React.lazy(() => import("src/pages/New pages/FAQ/FAQ"));
export const Instructors = React.lazy(() => import("src/pages/New pages/Instructors/Instructors"));
export const InstructorDetails = React.lazy(() => import("src/pages/New pages/Instructors/InstructorDetails"));
export const Assessments = React.lazy(() => import("src/pages/New pages/PracticalTest/Assessments"));
export const PracticalTest = React.lazy(() => import("src/pages/New pages/PracticalTest/PracticalTest"));
export const PracticalTestDetails = React.lazy(() => import("src/pages/New pages/PracticalTest/PracticalTestDetails"));
export const Workshops = React.lazy(() => import("src/pages/New pages/Workshops/Workshops"));
export const QuestionBank = React.lazy(() => import("src/pages/New pages/QuestionBank/QuestionBank"));
export const BecomeACourseCreator = React.lazy(() => import("src/pages/New pages/BecomeaCourseCreator/BecomeaCourseCreator"));
export const Feedback = React.lazy(() => import("src/pages/Feedback/Feedback"));
export const AIGradingTool = React.lazy(() => import("src/pages/New pages/AIGradingTool/AIGradingTool"));
export const AIAssistants= React.lazy(()=>import("src/pages/New pages/AI/AIAssistants"));
export const ChatwithAI = React.lazy(()=>import("src/pages/New pages/AI/ChatwithAI"));
export const CourseManagement = React.lazy(()=>import("src/pages/New pages/CourseManagement/CourseManagement"));
//Moderator
export const Moderator = React.lazy(() => import("src/pages/room/Moderator/Home/Home"));
export const SingleRoom = React.lazy(() => import("src/pages/room/Moderator/SingleRoom/SingleRoom"));
export const RecordingPage = React.lazy(() => import("src/pages/RoomRecording/RecordingPage"));
export const OnlyJoin = React.lazy(() => import("src/pages/JoinRoom/OnlyJoin"));
//Settings
export const AdminProfile = React.lazy(() => import("src/pages/user/AdminProfile/AdminProfile"));
export const DeleteAccount = React.lazy(() => import("src/pages/user/AdminProfile/DeleteAccount"));
export const MyMeeting = React.lazy(() => import("src/pages/user/MyMeeting/MyMeeting"));
export const MyScbscription = React.lazy(() => import("src/pages/user/My Subscription/MyScbscription"));
export const MyTransaction = React.lazy(() => import("src/pages/user/My Transaction/MyTransaction"));
export const AppCredentials = React.lazy(() => import("src/pages/user/AppCredentials/AppCredentials"));
//Admin
export const DashboardAppPage = React.lazy(() => import("src/pages/DashboardAppPage"));
export const MangeUsers = React.lazy(() => import("src/pages/admin-organization/ManageUser/MangeUsers"));
export const Auth0Users = React.lazy(()=> import ("src/pages/admin-organization/Auth0Users/Auth0Users"))
export const ServerRoom = React.lazy(() => import("src/pages/admin-organization/ServerRoom/ServerRoom"));
export const ServerRecordings = React.lazy(() => import("src/pages/admin-organization/ServerRecordings/ServerRecordings"));
export const SiteSettings = React.lazy(() => import("src/pages/admin-organization/SiteSettings/SiteSettings"));
export const RoomConfiguration = React.lazy(() => import("src/pages/admin-organization/RoomConfiguration/RoomConfiguration"));
export const Role = React.lazy(() => import("src/pages/admin-organization/Role/Role"));
export const Monitor = React.lazy(() => import("src/pages/admin-organization/Monitor/Monitor"));
export const SubscriptionPlans = React.lazy(() => import("src/pages/admin-organization/Subscriptionplans/Subscriptionplans"));
export const AllTransaction = React.lazy(() => import("src/pages/admin-organization/AllTransaction/AllTransaction"));