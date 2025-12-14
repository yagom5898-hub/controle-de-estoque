function Icon(props){ return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#60a5fa"/></linearGradient></defs>{props.children}</svg> }
function Dashboard(){ return <Icon><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Icon> }
function Client(){ return <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon> }
function Car(){ return <Icon><path d="M5 16l1.5-4.5A3 3 0 0 1 9.4 9h5.2a3 3 0 0 1 2.9 2.5L19 16"/><path d="M3 16h18"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></Icon> }
function Wrench(){ return <Icon><path d="M14 7a4 4 0 1 0-4 4l8 8 4-4-8-8z"/></Icon> }
function Box(){ return <Icon><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/></Icon> }
function Cash(){ return <Icon><rect x="3" y="6" width="18" height="12"/><circle cx="12" cy="12" r="3"/></Icon> }
function Calendar(){ return <Icon><rect x="3" y="4" width="18" height="18"/><path d="M8 2v4M16 2v4"/><path d="M3 10h18"/></Icon> }
function Report(){ return <Icon><path d="M7 21h10"/><rect x="7" y="3" width="10" height="18"/><path d="M10 8h6M10 12h6M10 16h6"/></Icon> }
function Backup(){ return <Icon><path d="M4 14v6h16v-6"/><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/></Icon> }
export default { Icon, Dashboard, Client, Car, Wrench, Box, Cash, Calendar, Report, Backup }
