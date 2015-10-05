import {
    MF_PAGE_SELECT
} from '../constants/action_types';

export function mainformTabSelected(id) {
	  return {
		    type: MF_PAGE_SELECT,
		    activePageId: id
	  };
}
