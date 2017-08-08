function errorMessageHandler(code) {
	switch (code) {
		case 'auth/invalid-email':
			return 'Please enter a valid email address.'
			break
		case 'auth/user-disabled':
			return 'User is currently disabled.'
			break
		case 'auth/user-not-found':
			return 'User not found.'
			break
		case 'auth/wrong-password':
			return 'The password you entered is incorrect.'
			break
		case 'auth/email-already-in-use':
			return 'The email you entered is already in use.'
			break
		case 'auth/weak-password':
			return 'Please enter a stronger password.'
			break
		case 'auth/expired-action-code':
			return 'Action code is expired.'
			break
		case 'auth/invalid-action-code':
			return 'Action code is invalid.'
			break
	}
}

export default errorMessageHandler
