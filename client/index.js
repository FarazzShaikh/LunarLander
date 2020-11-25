import * as Cookies from './Shared/Cookies';
import { Modal_main } from './TitleScreen/TitleScreen';
import Radio from './Shared/Radio';

import './Shared/CRT.css';
import DevScreen from './TitleScreen/DevScreen';
// Entrypoint

const dev_login_bypass = true;
const devScreen = new DevScreen();
devScreen.show(() => {
	devScreen.hide();

	setTimeout(() => {
		const radio = new Radio();

		if (dev_login_bypass) {
			Cookies.setCookies({
				name: 'TEST',
				uuid: 1606285731272,
			});

			getMain()
				.then((main) => {
					main.default(radio);
				})
				.catch((e) => console.error(e));
		} else {
			if (!Cookies.userRegistered()) {
				Modal_main((data) => {
					Cookies.setCookies(data);
					getMain()
						.then((main) => {
							main.default(radio);
						})
						.catch((e) => console.error(e));
				});
			} else {
				getMain()
					.then((main) => {
						main.default(radio);
					})
					.catch((e) => console.error(e));
			}
		}
	}, 300);
});

async function getMain() {
	return await import(
		/* webpackChunkName: "main_chunk" */
		/* webpackMode: "lazy" */
		`./src/main`
	);
}
