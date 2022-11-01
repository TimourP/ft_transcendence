import { Routes, Route } from 'react-router-dom';
import Login from './screens/log/Login';
import Register from './screens/log/Register';


/**
 *	React Component
 *	Describe the different possible routes and UI rendered consequently.
 */
const Main = () => {
return (         
	<Routes>
		<Route path='/' element={<Login/>} />
		<Route path='/login' element={<Login/>} />
		<Route path='/register' element={<Register/>} />
	</Routes>
);
}
export default Main;