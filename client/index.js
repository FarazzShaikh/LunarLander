import main from './src/main';
import * as Cookies from './src/Engine/Cookies';
import { Modal_main } from './src/TitleScreen/TitleScreen';
// Entrypoint

const dev_login_bypass = false;
const dev_only_splash = false;

if (dev_only_splash) {
	Modal_main((data) => {
		console.log(data);
	}, 1234);
} else {
	if (dev_login_bypass) {
		Cookies.setCookies({
			name: 'test7',
			uuid: 1234,
		});
		main();
	} else {
		if (!Cookies.userRegistered()) {
			Modal_main((data) => {
				Cookies.setCookies(data);
				main();
			});
		} else {
			main();
		}
	}
}
