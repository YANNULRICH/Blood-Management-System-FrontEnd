import _ from 'lodash';
import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability';
import store from '../../store/appStore';
import { AuthUserType } from '../../store/redux.types';
import Permissions from './index';

export function defineRulesFor(allPermissionNames: string[]) {
	const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);

	// Enable each permission
	allPermissionNames.forEach((permissionName) => {
		can(permissionName, Permissions);
	});
	return rules;
}

const ability = new PureAbility([]);

/*--------------------------------------------------------------
 * The following script sets permissions for authenticated user
 * So we listen for authUser state and we update permissions accordingly
 */
let currentAuth: AuthUserType['data'] = null;
store.subscribe(() => {
	const prevAuth = currentAuth;
	const state = store.getState();
	// Get current auth user
	currentAuth = state.authUser.data;
	// Check if it a new user
	if (!_.isEqual(prevAuth, currentAuth)) {
		// Update its permissions
		if (currentAuth === null) // @ts-ignore
			ability.update(defineRulesFor([]));
		else // @ts-ignore
			ability.update(defineRulesFor(currentAuth.getAllPermissionNames()));
	}
});

export default ability;
