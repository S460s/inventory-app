const errMsg = document.querySelector('#errMsg');
const closeBtn = document.querySelector('#closeBtn');

closeBtn.addEventListener('click', () => {
	errMsg.classList.add('is-hidden');
});
