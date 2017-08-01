function errorMessageHandler(code) {
	switch (code) {
		case 'auth/invalid-email':
			return 'Please enter a valid email address.'
			break
		case 'auth/user-disabled':
			return 'The user associated with the credential is currently disabled.'
			break
		case 'auth/user-not-found':
			return 'The user associated with the credential was not found.'
			break
		case 'auth/wrong-password':
			return 'The password you entered is inccorect.'
			break
		case 'auth/email-already-in-use':
			return 'The email you entered is already in use.'
			break
		case 'auth/weak-password':
			return 'The password you entered is too weak. Please enter a stronger password.'
			break
		case 'auth/expired-action-code':
			return 'The action code you entered is expired. Please request a new one.'
			break
		case 'auth/invalid-action-code':
			return 'The action code you entered is invalid. Please enter a valid one.'
			break
	}
}

export default errorMessageHandler
