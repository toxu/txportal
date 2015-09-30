import {
    MF_PAGE_SELECT
} from '../constants/action_types';

export function utterTabSelected(id) {
	  return {
		    type: MF_PAGE_SELECT,
		    activePageId: id
	  };
}
