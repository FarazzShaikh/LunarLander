export async function getSong(index, name) {
	return await import(/* webpackMode: "eager" */ `./${index}- ${name}.mp3`);
}
