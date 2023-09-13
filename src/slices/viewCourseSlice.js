const { createSlice } = require("@reduxjs/toolkit");

const initialState= {
    courseSectionData: [],
    courseEntireData: [],
    completedLectures: [],
    totalNumberOfLectures: 0,
}

const viewCourseSlice= createSlice({
    name: "viewCourse",
    initialState,
    reducers:{
        setEntireCourseData: (state,action)=>{
            state.courseEntireData= action.payload
        },
        setCourseSectionData: (state,action)=>{
            state.courseSectionData= action.payload
        },
        setTotalNumberOfLectures: (state,action)=>{
            state.totalNumberOfLectures= action.payload
        },
        setCompletetedLectures: (state,action)=>{
            state.completedLectures= action.payload
        },
        updateCompletedLectures: (state,action)=>{
            state.completedLectures= [...state.completedLectures, action.payload]
        }
    }
});

export const {setCompletetedLectures,setCourseSectionData,setEntireCourseData,setTotalNumberOfLectures,updateCompletedLectures}= viewCourseSlice.actions;
export default viewCourseSlice.reducer;