/**
 * This file list all permissions handled by the app
 */

export default class Permissions {
	static security = {
		roles: {
			add: 'auth.add_group',
			change: 'auth.change_group',
			delete: 'auth.delete_group',
			view: 'auth.view_group',
		},
		permissions: {
			view: 'auth.view_permission',
		},
		visibilityGroups: {
			add: 'users.add_visibilitygroup',
			change: 'users.change_visibilitygroup',
			delete: 'users.delete_visibilitygroup',
			view: 'users.view_visibilitygroup',
		},
		users: {
			add: 'users.add_user',
			change: 'users.change_user',
			delete: 'users.delete_user',
			view: 'users.view_user',
		}
	}

	static person = {
		add: 'posts.add_person',
		change: 'posts.change_person',
		delete: 'posts.delete_person',
		view: 'posts.view_person',
	}

	static activity = {
		add: 'events.add_activities',
		change: 'events.change_activities',
		delete: 'events.delete_activities',
		view: 'events.view_activities',
		type: {
			add: 'events.add_activitytype',
			change: 'events.change_activitytype',
			delete: 'events.delete_activitytype',
			view: 'events.view_activitytype',
		}
	}

	static document = {
		add: 'docmanager.add_documents',
		change: 'docmanager.change_documents',
		delete: 'docmanager.delete_documents',
		view: 'docmanager.view_documents',
	}

	static documentCategory = {
		add: 'docmanager.add_documentcategory',
		change: 'docmanager.change_documentcategory',
		delete: 'docmanager.delete_documentcategory',
		view: 'docmanager.view_documentcategory',
	}

	static articles = {
		categories: {
			add: 'publications.add_articlecategories',
			change: 'publications.change_articlecategories',
			delete: 'publications.delete_articlecategories',
			view: 'publications.view_articlecategories',
		},
		flag: {
			add: 'publications.add_articleflag',
			change: 'publications.change_articleflag',
			delete: 'publications.delete_articleflag',
			view: 'publications.view_articleflag',
		},
		paragraph: {
			add: 'publications.add_articleparagraphs',
			change: 'publications.change_articleparagraphs',
			delete: 'publications.delete_articleparagraphs',
			view: 'publications.view_articleparagraphs',
		},
		add: 'publications.add_articles',
		change: 'publications.change_articles',
		delete: 'publications.delete_articles',
		view: 'publications.view_articles',
		barbi: 'publications.can_view_dashboard',
	}

	static posts = {
		add: 'posts.add_posts',
		change: 'posts.change_posts',
		delete: 'posts.delete_posts',
		view: 'posts.view_posts',

		person: {
			add: 'posts.add_person',
			change: 'posts.change_person',
			delete: 'posts.delete_person',
			view: 'posts.view_person',
		},
		address: {
			add: 'posts.add_address',
			change: 'posts.change_address',
			delete: 'posts.delete_address',
			view: 'posts.view_address',
		},
		services: {
			add: 'posts.add_services',
			change: 'posts.change_services',
			delete: 'posts.delete_services',
			view: 'posts.view_services',
		}
	}

	static discussion = {
		add: 'forum.add_discussions',
		change: 'forum.change_discussions',
		delete: 'forum.delete_discussions',
		view: 'forum.view_discussions',
		comment: {
			add: 'forum.add_discussioncomment',
			change: 'forum.change_discussioncomment',
			delete: 'forum.delete_discussioncomment',
			view: 'forum.view_discussioncomment',
		},
		particpant: {
			add: 'forum.add_discussionparticipants',
			change: 'forum.change_discussionparticipants',
			delete: 'forum.delete_discussionparticipants',
			view: 'forum.view_discussionparticipants',
		}
	}

	static school = {
		add: 'schoolchart.add_school',
		change: 'schoolchart.change_school',
		delete: 'pschoolchart.delete_school',
		view: 'schoolchart.view_school',
	}

	static rooms = {
		room: {
			add: 'meeting_rooms.add_rooms',
			change: 'meeting_rooms.change_rooms',
			delete: 'meeting_rooms.delete_rooms',
			view: 'meeting_rooms.view_rooms',
		},
		reservation: {
			add: 'meeting_rooms.add_roomsreservations',
			change: 'meeting_rooms.change_roomsreservations',
			delete: 'meeting_rooms.delete_roomsreservations',
			view: 'meeting_rooms.view_roomsreservations',
		}

	}

	static sector = {
		add: 'schoolchart.add_sector',
		change: 'schoolchart.change_sector',
		delete: 'pschoolchart.delete_sector',
		view: 'schoolchart.view_sector',
	}

	static refenretiel = {
		localisation: {
			add: 'referentiel.add_localisation',
			change: 'referentiel.change_localisation',
			delete: 'referentiel.delete_localisation',
			view: 'referentiel.view_localisation',
		}
	}


}
