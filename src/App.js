import {observer} from "mobx-react-lite";
import {Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import IsAuth from "./components/utils/IsAuth";
import Settings from "./pages/users/Settings";
import Profile from "./pages/users/Profile";
import UsersTablePage from "./pages/users/UserTablePage";
import LogoutComponent from "./components/utils/LogoutComponent";
import Page404 from "./pages/Page404";
import UserDeleted from "./pages/UserDeleted";
import ToursPage from "./pages/tours/ToursPage";
import TourPage from "./pages/tours/TourPage";
import CreateUpdateTourPage from "./pages/tours/CreateUpdateTourPage";
import MyToursPage from "./pages/tours/MyToursPage";
import CountriesPage from "./pages/countries/CountriesPage";
import CreateUpdateCountryPage from "./pages/countries/CreateUpdateCountryPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path={'/login'} element={<LoginPage/>}/>
            <Route path={'/register'} element={<RegisterPage/>}/>
            <Route element={<IsAuth/>}>
                <Route path={'/users/settings'} element={<Settings/>}/>
                <Route path={'/users/null'} element={<UserDeleted/>}/>
                <Route path={'/users/:username'} element={<Profile/>}/>
                <Route path={'/users'} element={<UsersTablePage/>}/>

                <Route path={'/tours'} element={<ToursPage/>}/>
                <Route path={'/tours/create'} element={<CreateUpdateTourPage/>}/>
                <Route path={'/tours/update/:tourId'} element={<CreateUpdateTourPage/>}/>
                <Route path={'/tours/:tourId'} element={<TourPage/>}/>
                <Route path={'/my-tours'} element={<MyToursPage/>}/>

                <Route path={'/countries'} element={<CountriesPage/>}/>
                <Route path={'/countries/create'} element={<CreateUpdateCountryPage/>}/>
                <Route path={'/countries/update/:countryId'} element={<CreateUpdateCountryPage/>}/>

                <Route path={'/404'} element={<Page404/>}/>
                <Route path={'/logout'} element={<LogoutComponent/>}/>
            </Route>
        </Routes>
    )
        ;
}

export default observer(App);
