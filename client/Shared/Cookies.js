export function userRegistered() {
	return !!sessionStorage.getItem('lunarlander_Cookies');
}

export function getCookies() {
	return JSON.parse(sessionStorage.getItem('lunarlander_Cookies'));
}

export function setCookies(data) {
	sessionStorage.setItem('lunarlander_Cookies', JSON.stringify(data));
}

export function deleteCookies() {
	sessionStorage.removeItem('lunarlander_Cookies');
}
