import { matchRoutes, useLocation } from "react-router-dom"
import * as ROUTES from '../commons/urls/front';

const useCurrentPath = (): string | null => {
	const location = useLocation()
	const matched = matchRoutes([
		{ path: ROUTES.HOME },
		{ path: ROUTES.DASHBOARD.INDEX },
	], location)

	if (!matched) {
		return null;
	}

	return matched[0].route.path
}

export default useCurrentPath;
