export function userRegistered() {
	return document.cookie.length > 0;
}

export function getCookies() {
	return JSON.parse(document.cookie.split('=')[1]);
}

export function setCookies(data) {
	document.cookie =
		`lunarlander_Cookies=` +
		JSON.stringify(data) +
		`; expires=Thu, ${new Date(Date.now() + 4.32e8).toUTCString()}`;
}

export function deleteCookies() {
	document.cookie =
		'lunarlander_Cookies=;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}
