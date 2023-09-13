import "./App.css";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import About from "./pages/About";
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Contact from "./pages/Contact";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constant";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {
  const {user}= useSelector((state)=>(state.profile))

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
          <Route path="/" element={<Home/>} ></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/verify-email" element= {<VerifyEmail/>} />
          <Route path="/update-password/:id" element={<UpdatePassword/>} />
          <Route path="/forgot-password" element={
            <OpenRoute>
               <ForgotPassword/>
            </OpenRoute>
          } />
          <Route path="/about" element={
              <About/>
          } />
          <Route path="/contact" element={<Contact/>} />
          <Route
            element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }
            >
              <Route path="dashboard/my-profile" element={<MyProfile/>} />
              {
                user?.accountType === ACCOUNT_TYPE.STUDENT &&(
                  <>
                  <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
                  <Route path="/dashboard/cart" element={<Cart/>} />
                  </>
                )
              }
              {
                user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                  <>
                    <Route path="dashboard/add-course" element={<AddCourse/>} />
                    <Route path="dashboard/my-courses" element= {<MyCourses/>} />
                    <Route path="dashboard/edit-course/:courseId" element= {<EditCourse/>} />
                    <Route path="dashboard/instructor" element= {<Instructor/>} />
                  </>
                )
              }
          </Route>
          <Route path="catalog/:catalogName" element={<Catalog/>}></Route>
          <Route path="course/:courseId" element= {<CourseDetails/>}></Route>
          <Route element={
              <PrivateRoute>
                  <ViewCourse />
              </PrivateRoute>
          } >
            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route path="view-course/:courseId/section/:sectionId/sub-section/:subsectionId" element={<VideoDetails/>} />
                </>
              )
            }
          </Route>
          <Route path="*" element={<Error/>} />
      </Routes>
    </div>
  )
}

export default App;
