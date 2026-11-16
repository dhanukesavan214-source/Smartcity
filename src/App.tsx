import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import { StoreProvider } from './store';
import { Admin, Bus, EV, Parking, Users } from './pages2';
import { Civic, ComplaintAccepted, Escalate, Home, Login, ThankYou } from './pages';

function App() {
  return <StoreProvider><Routes><Route path="/login" element={<Login />} /><Route element={<Layout />}><Route path="/home" element={<Home />} /><Route path="/module/civic" element={<Civic />} /><Route path="/module/parking" element={<Parking />} /><Route path="/module/ev" element={<EV />} /><Route path="/module/bus" element={<Bus />} /><Route path="/users" element={<Users />} /><Route path="/complaint-accepted" element={<ComplaintAccepted />} /><Route path="/escalate" element={<Escalate />} /><Route path="/thank-you" element={<ThankYou />} /><Route path="/admin" element={<Admin />} /></Route><Route path="*" element={<Navigate to="/login" replace />} /></Routes></StoreProvider>;
}
export default App;
