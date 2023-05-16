import {useFetch} from "use-http";
import {LARAVEL_API_LOGOUT, LARAVEL_API_URL} from "../../common/constants";

const Logout = () => {
    const {get} = useFetch(`${LARAVEL_API_URL}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        }
    });
    const logout = () => {
        get(`${LARAVEL_API_LOGOUT}`).then(res => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            window.location.href = '/';
        });
    };

    logout();
}

export default Logout;