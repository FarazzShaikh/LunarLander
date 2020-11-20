import main from './src/main';
import * as Cookies from './Shared/Cookies';
import { Modal_main } from './TitleScreen/TitleScreen';
import Radio from './src/Objects/Radio';

// Entrypoint

const dev_login_bypass = false;

const radio = new Radio();

if (dev_login_bypass) {
	Cookies.setCookies({
		name: 'test7',
		uuid: 1234,
	});

	main(radio);
} else {
	if (!Cookies.userRegistered()) {
		Modal_main((data) => {
			Cookies.setCookies(data);
			main(radio);
		});
	} else {
		main(radio);
	}
}

async function getMain() {
	return await import(/* webpackMode: "eager" */ `./src/main`);
}
