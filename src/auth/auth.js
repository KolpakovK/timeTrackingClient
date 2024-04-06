import router from "../router"

export function isAuthenticated(){
  let token = localStorage.getItem('token');
  if (!token) router.push('/login');
};

export function logOut(){
  localStorage.removeItem('token');
  router.push('/login');
};

export const getHeaders = () => {
  let token = localStorage.getItem('token');
  if (token){
    return {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    }
  }
  else{
    return null
  }
}