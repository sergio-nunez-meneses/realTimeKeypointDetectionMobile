export async function ajax(method, url, data = null) {
	return new Promise(resolve => {
		let xhr = new XMLHttpRequest();

		xhr.open(method, url, true);
		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status < 400) {
				resolve(JSON.parse(this.response));
			}
			else {
				resolve({
					status  : xhr.status,
					response: this.response,
				});
			}
		}

		if (data !== null) {
			xhr.send(data);
		}
		else {
			xhr.send();
		}
	});
}
