import { Routes, Route } from 'react-router-dom';
import Login from './screens/log/Login';
import Register from './screens/log/Register';

const Main = () => {
return (         
	<Routes>
		<Route path='/' element={<Login/>} />
		<Route path='/topics' element={<Register/>} />
	</Routes>
);
}
export default Main;