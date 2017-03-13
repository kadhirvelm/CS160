export function mapStateToProps(state) {
	const { amazonDB, website } = state
	return {
		amazonDB,
		website
	}
}